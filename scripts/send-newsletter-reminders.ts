import { supabase } from "../lib/db";
import { sendMail, GraphSendMailError } from "../lib/email";
import {
  buildUnsubscribeUrl,
  buildOneClickUnsubscribeUrl,
} from "../lib/unsubscribe-token";
import readline from "node:readline/promises";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// === ANSI helpers ===
const RESET = "\x1b[0m";
const wrap = (code: string) => (s: string) => `${code}${s}${RESET}`;
const color = {
  red: wrap("\x1b[31m"),
  green: wrap("\x1b[32m"),
  yellow: wrap("\x1b[33m"),
  blue: wrap("\x1b[34m"),
  magenta: wrap("\x1b[35m"),
  cyan: wrap("\x1b[36m"),
  gray: wrap("\x1b[90m"),
  bold: wrap("\x1b[1m"),
  dim: wrap("\x1b[2m"),
  redBold: wrap("\x1b[1;31m"),
  greenBold: wrap("\x1b[1;32m"),
  cyanBold: wrap("\x1b[1;36m"),
};

// === CLI args ===
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
${color.bold("send-newsletter-reminders")} — invite challenge participants to apply / re-engage

Usage: bun scripts/send-newsletter-reminders.ts [flags]

Flags:
  (none)     Test mode. No emails sent. Logs preview + recipient lists.
  --live     Live mode. Sends emails. Persists sent addresses per term.
  --debug    Test mode + live filter. Previews exactly what live mode would do.
  --html     Export recipient tables + email previews to a self-contained HTML file. No emails sent.
  -h, --help Show this help.
`);
  process.exit(0);
}
const liveMode = args.includes("--live");
const debugMode = args.includes("--debug");
const htmlMode = args.includes("--html");
if (liveMode && debugMode) {
  console.error(color.red("Error: --live and --debug are mutually exclusive."));
  process.exit(1);
}
if (htmlMode && liveMode) {
  console.error(color.red("Error: --html and --live are mutually exclusive."));
  process.exit(1);
}
const mode: "test" | "live" | "debug" = liveMode ? "live" : debugMode ? "debug" : "test";

// === Constants ===
const CHALLENGE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://challenge.academyconsult.de";
const APPLY_URL = "https://bewerben.academyconsult.de/s/-1";
const PRIVACY_URL = "https://academyconsult.de/unternehmen/datenschutz/";
const IMPRESSUM_URL = "https://academyconsult.de/unternehmen/impressum/";
const PUBLIC_ASSET_BASE = "https://challenge.academyconsult.de";

// Date the challenge submissions close (used in Template 2 copy).
// Update this each term to match the landing-page deadline.
const CHALLENGE_DEADLINE = "29.04.";

// Pace live sends so we stay well under Microsoft Graph's per-mailbox throttle
// (~30 messages/min on Exchange Online). 2s ⇒ ~30/min including the send latency
// itself, with comfortable headroom against transient 429s. Bumping this is
// safe; lowering it risks throttling mid-batch.
const SEND_INTERVAL_MS = 2_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Top 3 prizes (mirrors landing page); image filenames live in /public.
const PRIZES: Array<{
  rank: string;
  title: string;
  description: string;
  image: string;
}> = [
  {
    rank: "1. Preis",
    title: "Tiny House Trip von Raus.Life",
    description: "Ein Wochenende abschalten in einem Tiny House mitten in der Natur.",
    image: "/221102_Raus_Cabins_Alt_Kentzlin_0003_HDR_HiRes.jpg",
  },
  {
    rank: "2. Preis",
    title: "10 × 100 % Gutschein Reformer Pilates",
    description: "Reformer-Pilates-Sessions im HerSpaceStudio.",
    image: "/HerSpaceStudio_cropped.png",
  },
  {
    rank: "3. Preis",
    title: "Semesterticket für die Boulderwelt",
    description: "Ein ganzes Semester unbegrenzt klettern.",
    image: "/Boulderwelt Bild.jpg",
  },
];

// === Semester ===
type SemesterInfo = {
  key: string; // e.g. "2026_sose" or "2025_wise"
  label: string; // e.g. "Sommersemester 2026" or "Wintersemester 2025/26"
  type: "sose" | "wise";
  year: number;
};

function getSemesterFromDate(date: Date): SemesterInfo {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month >= 4 && month <= 9) {
    return {
      type: "sose",
      year,
      key: `${year}_sose`,
      label: `Sommersemester ${year}`,
    };
  }
  // WiSe spans October–March; bucket under the start year
  const startYear = month >= 10 ? year : year - 1;
  return {
    type: "wise",
    year: startYear,
    key: `${startYear}_wise`,
    label: `Wintersemester ${startYear}/${String(startYear + 1).slice(-2)}`,
  };
}

// === Email helpers ===
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function publicAssetUrl(path: string): string {
  // Encode each path segment so spaces & special chars survive in the URL.
  const encoded = path
    .split("/")
    .map((seg) => (seg ? encodeURIComponent(seg) : seg))
    .join("/");
  return `${PUBLIC_ASSET_BASE}${encoded}`;
}

function buildEmailHeader(): string {
  // logo_text.png is the official wordmark (2015×680, ≈3:1). Explicit width +
  // height attributes prevent iOS Mail from rendering it at native size and
  // overflowing the viewport. <div> wrapper keeps the same left edge as the
  // <p> body text below.
  return `<div style="margin:8px 0 24px; padding:0;">
    <img src="${publicAssetUrl("/logo_text.png")}" alt="Academy Consult" width="190" height="64" style="display:block; border:0; margin:0; width:190px; height:64px;" />
  </div>`;
}

function buildEmailFooter(unsubscribeUrl: string): string {
  return `<hr style="border:none; border-top:1px solid #ccc; margin:24px 0;" />
  <p style="font-size: 9pt; color: #666; line-height: 1.5;">
    Du erhältst diese E-Mail, weil du dich beim Academy Consult Newsletter angemeldet hast.<br/>
    <a href="${unsubscribeUrl}" style="color:#666;">Vom Newsletter abmelden</a>
    &nbsp;·&nbsp;
    <a href="${PRIVACY_URL}" style="color:#666;">Datenschutz</a>
    &nbsp;·&nbsp;
    <a href="${IMPRESSUM_URL}" style="color:#666;">Impressum</a>
  </p>`;
}

// === Template 1: current-term participant — apply now, deadline tonight ===
function buildCurrentTermEmail(input: {
  vorname: string;
  currentYear: number;
  applyUrl: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const { vorname, currentYear, applyUrl, unsubscribeUrl } = input;
  const subject = `Letzte Chance: Bewerbung bei Academy Consult endet heute um 23:59 Uhr`;
  const html = `<div style="font-family: Verdana, Geneva, sans-serif; font-size: 11pt; color: #222; line-height: 1.6; padding: 0 24px;">
  ${buildEmailHeader()}

  <p>Hey ${escapeHtml(vorname)},</p>

  <p>vielen Dank, dass du bei der <strong>Academy Consult Challenge ${currentYear}</strong> dabei warst — wir hoffen, du hattest Spaß!</p>

  <div style="background:#fff3f3; border-left:4px solid #993333; border-radius:4px; padding:16px 20px; margin:16px 0 20px;">
    <div style="font-size:13pt; font-weight:bold; color:#993333; margin-bottom:4px;">⏰ Bewerbungsphase endet heute um 23:59 Uhr!</div>
    <div style="font-size:10pt; color:#444; line-height:1.5;">Wenn du Teil von Academy Consult werden möchtest, ist heute deine letzte Chance. Bewirb dich jetzt und werde Teil der größten studentischen Unternehmensberatung Deutschlands.</div>
  </div>

  <p>Falls du dich noch nicht beworben hast, ist jetzt der perfekte Moment: Mit einer Bewerbung sicherst du dir die Chance, an spannenden Beratungsprojekten mitzuarbeiten und ein starkes Netzwerk aufzubauen.</p>

  <p>
    <a href="${applyUrl}" style="background:#993333; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px; display:inline-block; font-weight:bold;">Jetzt bewerben</a>
  </p>

  <p>Wir freuen uns auf deine Bewerbung!<br/>Dein Team von Academy Consult</p>

  ${buildEmailFooter(unsubscribeUrl)}
</div>`;
  return { subject, html };
}

// === Template 2: previous-term participant — re-engage with prize showcase ===
function buildPreviousTermEmail(input: {
  vorname: string;
  pastSemesterLabel: string;
  currentYear: number;
  challengeDeadline: string;
  challengeUrl: string;
  applyUrl: string;
  unsubscribeUrl: string;
}): { subject: string; html: string } {
  const {
    vorname,
    pastSemesterLabel,
    currentYear,
    challengeDeadline,
    challengeUrl,
    applyUrl,
    unsubscribeUrl,
  } = input;
  const subject = `Sei dabei: Academy Consult Challenge ${currentYear} läuft noch bis zum ${challengeDeadline}!`;

  const prizesHtml = PRIZES.map(
    (p) => `
    <tr>
      <td style="vertical-align:top; padding:12px 16px 12px 0; width:160px;">
        <img src="${publicAssetUrl(p.image)}" alt="${escapeHtml(p.title)}" style="width:160px; height:120px; object-fit:cover; border-radius:6px; display:block;" />
      </td>
      <td style="vertical-align:top; padding:12px 0;">
        <div style="font-size:10pt; color:#993333; font-weight:bold; letter-spacing:0.5px;">${escapeHtml(p.rank)}</div>
        <div style="font-size:12pt; font-weight:bold; margin-top:2px;">${escapeHtml(p.title)}</div>
        <div style="font-size:10pt; color:#555; margin-top:4px;">${escapeHtml(p.description)}</div>
      </td>
    </tr>`
  ).join("");

  const html = `<div style="font-family: Verdana, Geneva, sans-serif; font-size: 11pt; color: #222; line-height: 1.6; max-width:640px; padding: 0 24px;">
  ${buildEmailHeader()}

  <p>Hey ${escapeHtml(vorname)},</p>

  <p>im <strong>${escapeHtml(pastSemesterLabel)}</strong> hast du bei der <strong>Academy Consult Challenge</strong> mitgemacht — schön, dass du damals dabei warst!</p>

  <p>Auch dieses Semester findet die Academy Consult Challenge wieder statt — und du kannst noch bis zum <strong>${escapeHtml(challengeDeadline)}</strong> teilnehmen. Es warten wieder tolle Preise auf dich:</p>

  <div style="background:#fff3f3; border-left:4px solid #993333; border-radius:4px; padding:16px 20px; margin:0 0 20px;">
    <div style="font-size:13pt; font-weight:bold; color:#993333; margin-bottom:4px;">⏰ Bewerbungsphase endet heute um 23:59 Uhr!</div>
    <div style="font-size:10pt; color:#444; line-height:1.5;">Wenn du Teil von Academy Consult werden möchtest, ist heute deine letzte Chance. Bewirb dich jetzt und sichere dir deinen Platz in unserem Team.</div>
  </div>

  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:16px 0 8px;">
    ${prizesHtml}
  </table>
  <p style="font-size:10pt; color:#777; font-style:italic; margin:0 0 16px;">… und viele weitere Preise</p>

  <h3 style="font-size:13pt; font-weight:bold; margin:28px 0 12px; color:#222;">Unser Newsletter-Gewinnspiel</h3>

  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0 0 16px;">
    <tr>
      <td style="vertical-align:top; padding:12px 16px 12px 0; width:160px;">
        <img src="${publicAssetUrl("/Amazon gutschein.png")}" alt="Amazon Gutschein" style="width:160px; height:120px; object-fit:contain; border-radius:6px; display:block;" />
      </td>
      <td style="vertical-align:top; padding:12px 0;">
        <div style="font-size:12pt; font-weight:bold; margin-top:2px;">2 × 100 € Amazon Gutschein</div>
        <div style="font-size:10pt; color:#555; margin-top:4px;">Exklusiv von E-Fellows für deinen nächsten Amazon-Einkauf 🛒</div>
      </td>
    </tr>
  </table>

  <p style="margin-top:24px;"><strong>Was du tun kannst:</strong></p>
  <ol style="padding-left:20px;">
    <li style="margin-bottom:8px;"><a href="${applyUrl}" style="color:#993333; font-weight:bold;">Bewirb dich</a> und werde Teil der größten studentischen Unternehmensberatung Deutschlands.</li>
    <li><a href="${challengeUrl}" style="color:#993333; font-weight:bold;">Mach bei der Challenge mit</a> und sichere dir die Chance auf einen der Preise oben.</li>
  </ol>

  <p style="margin-top:24px;">
    <a href="${challengeUrl}" style="background:#000; color:#fff; padding:10px 20px; text-decoration:none; border-radius:4px; display:inline-block; margin-right:8px;">Zur Challenge</a>
    <a href="${applyUrl}" style="background:#993333; color:#fff; padding:10px 20px; text-decoration:none; border-radius:4px; display:inline-block;">Jetzt bewerben</a>
  </p>

  <p>Wir freuen uns auf dich!<br/>Dein Team von Academy Consult</p>

  ${buildEmailFooter(unsubscribeUrl)}
</div>`;
  return { subject, html };
}

// === Persistence (ac_challenge_reminders) ===
async function loadAlreadySentEmails(term: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("ac_challenge_reminders")
    .select("email")
    .eq("term", term);
  if (error) {
    console.error(color.red(`Failed to load reminder history: ${error.message}`));
    process.exit(1);
  }
  return new Set((data ?? []).map((r) => (r.email as string).toLowerCase()));
}

async function markReminderSent(
  email: string,
  term: string,
  submissionId: string | number,
): Promise<void> {
  const { error } = await supabase
    .from("ac_challenge_reminders")
    .upsert(
      { email: email.toLowerCase(), term, submission_id: submissionId },
      { onConflict: "email,term", ignoreDuplicates: true },
    );
  if (error) throw error;
}

// === Table ===
function renderTable(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length)),
  );
  const horizontal = (l: string, m: string, r: string) =>
    l + widths.map((w) => "─".repeat(w + 2)).join(m) + r;
  const top = color.gray(horizontal("┌", "┬", "┐"));
  const sep = color.gray(horizontal("├", "┼", "┤"));
  const bot = color.gray(horizontal("└", "┴", "┘"));
  const v = color.gray("│");
  const headerLine =
    v +
    headers.map((h, i) => " " + color.bold(h.padEnd(widths[i])) + " ").join(v) +
    v;
  const bodyLines = rows.map(
    (r) =>
      v +
      r.map((cell, i) => " " + (cell ?? "").padEnd(widths[i]) + " ").join(v) +
      v,
  );
  return [top, headerLine, sep, ...bodyLines, bot].join("\n");
}

// === Confirmation ===
async function confirm(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(prompt)).trim().toLowerCase();
  rl.close();
  return answer === "yes" || answer === "y";
}

// === Recipient bucketing ===
type Bucket = "current" | "previous";

type Recipient = {
  id: number; // submission id used for unsubscribe HMAC + audit row
  email: string; // lowercased
  firstName: string;
  bucket: Bucket;
  // For "current": the current semester. For "previous": the most-recent past semester.
  referencedSemester: SemesterInfo;
};

type SubmissionRow = {
  id: number;
  email: string;
  first_name: string | null;
  has_newsletter: boolean;
  created_at: string;
};

function bucketRecipients(
  rows: SubmissionRow[],
  currentSemester: SemesterInfo,
): Recipient[] {
  // Group by lowercased email; rows arrive sorted desc by created_at
  const byEmail = new Map<string, SubmissionRow[]>();
  for (const row of rows) {
    const key = row.email.toLowerCase();
    const list = byEmail.get(key) ?? [];
    list.push(row);
    byEmail.set(key, list);
  }

  const recipients: Recipient[] = [];
  for (const [email, group] of byEmail) {
    const latest = group[0]; // most recent submission (desc order)
    // Respect the most recent newsletter preference: if their last opt was false, skip.
    if (!latest.has_newsletter) continue;

    const inCurrent = group.find(
      (r) =>
        getSemesterFromDate(new Date(r.created_at)).key === currentSemester.key,
    );

    if (inCurrent) {
      recipients.push({
        id: inCurrent.id,
        email,
        firstName: inCurrent.first_name ?? "",
        bucket: "current",
        referencedSemester: currentSemester,
      });
    } else {
      recipients.push({
        id: latest.id,
        email,
        firstName: latest.first_name ?? "",
        bucket: "previous",
        referencedSemester: getSemesterFromDate(new Date(latest.created_at)),
      });
    }
  }
  // Stable order: current first, then previous, then alphabetical email
  recipients.sort((a, b) => {
    if (a.bucket !== b.bucket) return a.bucket === "current" ? -1 : 1;
    return a.email.localeCompare(b.email);
  });
  return recipients;
}

// === HTML export ===
function escapeAttr(html: string): string {
  return html.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function buildHtmlRecipientTable(headers: string[], rows: string[][]): string {
  const ths = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const trs = rows
    .map(
      (r) =>
        `<tr>${r.map((cell) => `<td>${escapeHtml(cell ?? "")}</td>`).join("")}</tr>`,
    )
    .join("\n");
  return `<table>\n  <thead><tr>${ths}</tr></thead>\n  <tbody>${trs}</tbody>\n</table>`;
}

function buildHtmlExport(opts: {
  semester: SemesterInfo;
  generatedAt: Date;
  filterEnabled: boolean;
  alreadySentCount: number;
  currentBucket: Recipient[];
  previousBucket: Recipient[];
  t1Mail: { subject: string; html: string } | null;
  t2Mail: { subject: string; html: string } | null;
}): string {
  const { semester, generatedAt, filterEnabled, alreadySentCount, currentBucket, previousBucket, t1Mail, t2Mail } = opts;
  const total = currentBucket.length + previousBucket.length;
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${generatedAt.getFullYear()}-${pad2(generatedAt.getMonth() + 1)}-${pad2(generatedAt.getDate())} ${pad2(generatedAt.getHours())}:${pad2(generatedAt.getMinutes())}`;

  const currentTable =
    currentBucket.length > 0
      ? buildHtmlRecipientTable(
          ["#", "Vorname", "Email"],
          currentBucket.map((r, i) => [String(i + 1), r.firstName, r.email]),
        )
      : "<p><em>Keine Empfänger.</em></p>";

  const previousTable =
    previousBucket.length > 0
      ? buildHtmlRecipientTable(
          ["#", "Vorname", "Email", "Letztes Semester"],
          previousBucket.map((r, i) => [
            String(i + 1),
            r.firstName,
            r.email,
            r.referencedSemester.label,
          ]),
        )
      : "<p><em>Keine Empfänger.</em></p>";

  const previewSection = (
    label: string,
    mail: { subject: string; html: string } | null,
    sampleEmail: string,
    fallback: string,
  ) =>
    mail
      ? `<div class="preview-meta">
        <span class="label">Betreff:</span> ${escapeHtml(mail.subject)}<br>
        <span class="label">Vorschau für:</span> ${escapeHtml(sampleEmail)}
      </div>
      <iframe srcdoc="${escapeAttr(mail.html)}" class="email-frame"></iframe>`
      : `<p><em>${fallback}</em></p>`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Newsletter Preview — ${escapeHtml(semester.label)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; color: #222; background: #f5f5f5; margin: 0; padding: 24px; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 22px; margin: 0 0 16px; color: #111; }
    h2 { font-size: 16px; margin: 32px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #993333; color: #993333; }
    .meta { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px; }
    .meta dl { margin: 0; display: grid; grid-template-columns: max-content 1fr; gap: 4px 16px; }
    .meta dt { font-weight: 600; color: #555; }
    .meta dd { margin: 0; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-t1 { background: #e0f0ff; color: #0055aa; }
    .badge-t2 { background: #f3e8ff; color: #6600aa; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; margin-bottom: 8px; }
    thead tr { background: #993333; color: #fff; }
    th { text-align: left; padding: 10px 14px; font-size: 13px; }
    td { padding: 8px 14px; border-top: 1px solid #eee; font-size: 13px; }
    tr:nth-child(even) td { background: #fafafa; }
    .preview-meta { background: #fff; border: 1px solid #ddd; border-radius: 6px 6px 0 0; padding: 12px 16px; font-size: 13px; }
    .label { font-weight: 600; color: #555; }
    .email-frame { width: 100%; height: 700px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 6px 6px; background: #fff; display: block; }
    .count { color: #666; font-weight: normal; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Newsletter Reminder — Vorschau</h1>
    <div class="meta">
      <dl>
        <dt>Semester</dt><dd>${escapeHtml(semester.label)}</dd>
        <dt>Erstellt am</dt><dd>${escapeHtml(dateStr)}</dd>
        <dt>Filter</dt><dd>${filterEnabled ? `aktiv (${alreadySentCount} bereits gesendet dieses Semester)` : "deaktiviert (Test-Modus)"}</dd>
        <dt>Gesamt Empfänger</dt><dd>${total} <span class="badge badge-t1">${currentBucket.length} T1</span> <span class="badge badge-t2">${previousBucket.length} T2</span></dd>
      </dl>
    </div>

    <h2>Template 1 — Current-term <span class="count">(${currentBucket.length})</span></h2>
    ${currentTable}

    <h2>Template 2 — Previous-term <span class="count">(${previousBucket.length})</span></h2>
    ${previousTable}

    <h2>Vorschau Template 1</h2>
    ${previewSection("T1", t1Mail, currentBucket[0]?.email ?? "", "Keine current-term Empfänger — keine Vorschau verfügbar.")}

    <h2>Vorschau Template 2</h2>
    ${previewSection("T2", t2Mail, previousBucket[0]?.email ?? "", "Keine previous-term Empfänger — keine Vorschau verfügbar.")}
  </div>
</body>
</html>`;
}

// === Main ===
async function main() {
  const banner = "Academy Consult — Newsletter Reminder";
  const bar = "═".repeat(banner.length + 4);
  console.log("");
  console.log(color.cyanBold(bar));
  console.log(color.cyanBold(`  ${banner}  `));
  console.log(color.cyanBold(bar));
  console.log("");

  const modeLabel =
    mode === "live"
      ? color.redBold("LIVE (will send emails)")
      : mode === "debug"
        ? color.yellow("DEBUG (test send + live filter)")
        : color.cyan("TEST (no emails sent, no filter)");
  console.log(`${color.bold("Mode:")}             ${modeLabel}`);

  const now = new Date();
  const currentSemester = getSemesterFromDate(now);
  console.log(
    `${color.bold("Current semester:")} ${color.magenta(currentSemester.label)} ${color.gray(
      `(key: ${currentSemester.key})`,
    )}`,
  );

  const useFilter = mode !== "test";
  const alreadySent: Set<string> = useFilter
    ? await loadAlreadySentEmails(currentSemester.key)
    : new Set();
  if (useFilter) {
    console.log(
      `${color.bold("Already sent:")}     ${color.yellow(String(alreadySent.size))} address(es) in ${color.gray(currentSemester.key)}`,
    );
  } else {
    console.log(`${color.bold("Filter:")}           ${color.gray("disabled (test mode)")}`);
  }

  console.log("");
  console.log(color.dim("Querying Supabase…"));

  // Fetch every verified submission (newest first), grouped client-side by email.
  // Unverified submissions are excluded — those users never actually "took part".
  // .range covers up to 10000 rows; bump if the participant base ever exceeds that.
  const { data, error } = await supabase
    .from("ac_challenge_submissions")
    .select("id, email, first_name, has_newsletter, created_at")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .range(0, 9999);

  if (error) {
    console.error(color.red(`Query failed: ${error.message}`));
    process.exit(1);
  }

  const rows = (data ?? []) as SubmissionRow[];
  const allRecipients = bucketRecipients(rows, currentSemester);

  // Apply dedup filter (live + debug modes only)
  const recipients = useFilter
    ? allRecipients.filter((r) => !alreadySent.has(r.email))
    : allRecipients;

  const skipped = allRecipients.length - recipients.length;
  const currentBucket = recipients.filter((r) => r.bucket === "current");
  const previousBucket = recipients.filter((r) => r.bucket === "previous");

  const eligibleLine = useFilter
    ? `${color.green(String(allRecipients.length))} (${color.yellow(String(skipped))} already received this term, ${color.green(String(recipients.length))} new)`
    : color.green(String(allRecipients.length));
  console.log(`${color.bold("Eligible:")}         ${eligibleLine}`);
  console.log(
    `${color.bold("Buckets:")}          ${color.cyan(`${currentBucket.length} current-term`)} · ${color.magenta(`${previousBucket.length} previous-term`)}`,
  );
  console.log("");

  if (recipients.length === 0) {
    console.log(color.yellow("Nothing to send. Exiting."));
    return;
  }

  // === Recipient tables (one per bucket) ===
  if (currentBucket.length > 0) {
    console.log(color.cyanBold(`Template 1 — current-term recipients (${currentBucket.length}):`));
    console.log(
      renderTable(
        ["#", "Vorname", "Email"],
        currentBucket.map((r, i) => [String(i + 1), r.firstName, r.email]),
      ),
    );
    console.log("");
  }

  if (previousBucket.length > 0) {
    console.log(
      color.cyanBold(`Template 2 — previous-term recipients (${previousBucket.length}):`),
    );
    console.log(
      renderTable(
        ["#", "Vorname", "Email", "Letztes Semester"],
        previousBucket.map((r, i) => [
          String(i + 1),
          r.firstName,
          r.email,
          r.referencedSemester.label,
        ]),
      ),
    );
    console.log("");
  }

  // === Email previews ===
  const rule = color.gray("─".repeat(80));
  let t1Mail: { subject: string; html: string } | null = null;
  let t2Mail: { subject: string; html: string } | null = null;

  if (currentBucket.length > 0) {
    const sample = currentBucket[0];
    t1Mail = buildCurrentTermEmail({
      vorname: sample.firstName || "Teilnehmer:in",
      currentYear: currentSemester.year,
      applyUrl: APPLY_URL,
      unsubscribeUrl: buildUnsubscribeUrl(sample.id),
    });
    console.log(
      color.bold("Template 1 preview ") + color.gray(`(rendered for ${sample.email})`),
    );
    console.log(rule);
    console.log(`${color.bold("Subject:")} ${t1Mail.subject}`);
    console.log(rule);
    console.log("");
  }

  if (previousBucket.length > 0) {
    const sample = previousBucket[0];
    t2Mail = buildPreviousTermEmail({
      vorname: sample.firstName || "Teilnehmer:in",
      pastSemesterLabel: sample.referencedSemester.label,
      currentYear: currentSemester.year,
      challengeDeadline: CHALLENGE_DEADLINE,
      challengeUrl: CHALLENGE_URL,
      applyUrl: APPLY_URL,
      unsubscribeUrl: buildUnsubscribeUrl(sample.id),
    });
    console.log(
      color.bold("Template 2 preview ") + color.gray(`(rendered for ${sample.email})`),
    );
    console.log(rule);
    console.log(`${color.bold("Subject:")} ${t2Mail.subject}`);
    console.log(rule);
    console.log("");
  }

  // === HTML export (--html flag) ===
  if (htmlMode) {
    const pad2 = (n: number) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
    const filename = `newsletter-preview-${ts}.html`;
    const filepath = resolve(process.cwd(), filename);
    writeFileSync(
      filepath,
      buildHtmlExport({
        semester: currentSemester,
        generatedAt: now,
        filterEnabled: useFilter,
        alreadySentCount: alreadySent.size,
        currentBucket,
        previousBucket,
        t1Mail,
        t2Mail,
      }),
      "utf-8",
    );
    console.log(color.greenBold(`HTML export written to: ${filename}`));
    return;
  }

  // === Confirm ===
  // ETA assumes one send every SEND_INTERVAL_MS plus ~500ms call latency.
  const etaSec = Math.ceil(
    (recipients.length * (SEND_INTERVAL_MS + 500)) / 1000,
  );
  const etaStr =
    etaSec >= 60
      ? `~${Math.floor(etaSec / 60)}m ${etaSec % 60}s`
      : `~${etaSec}s`;

  const prompt =
    mode === "live"
      ? `${color.redBold("⚠  LIVE MODE — emails will be sent for real.")}\nProceed and send ${color.bold(String(recipients.length))} email(s) (${currentBucket.length} T1 · ${previousBucket.length} T2)? ${color.gray(`ETA ${etaStr} at ${SEND_INTERVAL_MS}ms intervals.`)}\nType ${color.yellow('"yes"')} to confirm: `
      : `Proceed with ${color.cyan(mode === "debug" ? "test send (with live filter)" : "test send")} for ${color.bold(String(recipients.length))} recipient(s)? Type ${color.yellow('"yes"')} to confirm: `;

  if (!(await confirm(prompt))) {
    console.log(color.yellow("Aborted. No emails sent."));
    return;
  }

  if (mode !== "live") {
    console.log("");
    console.log(
      color.cyan(
        `[${mode}] No emails sent. Each recipient would receive their bucket's template (with their own name, semester, unsubscribe link, etc.).`,
      ),
    );
    return;
  }

  // === Live send ===
  console.log("");
  console.log(color.bold("Sending…"));
  let sent = 0;
  let failed = 0;
  const failedAddresses: string[] = [];

  for (let i = 0; i < recipients.length; i++) {
    if (i > 0) await sleep(SEND_INTERVAL_MS);
    const r = recipients[i];
    const mail =
      r.bucket === "current"
        ? buildCurrentTermEmail({
            vorname: r.firstName || "Teilnehmer:in",
            currentYear: currentSemester.year,
            applyUrl: APPLY_URL,
            unsubscribeUrl: buildUnsubscribeUrl(r.id),
          })
        : buildPreviousTermEmail({
            vorname: r.firstName || "Teilnehmer:in",
            pastSemesterLabel: r.referencedSemester.label,
            currentYear: currentSemester.year,
            challengeDeadline: CHALLENGE_DEADLINE,
            challengeUrl: CHALLENGE_URL,
            applyUrl: APPLY_URL,
            unsubscribeUrl: buildUnsubscribeUrl(r.id),
          });
    const prefix = `[${i + 1}/${recipients.length}]`;
    const tag = r.bucket === "current" ? color.cyan("T1") : color.magenta("T2");
    // RFC 8058 / Gmail-Yahoo bulk-sender unsubscribe headers, set as MAPI
    // extended properties because Microsoft Graph rejects them in
    // `internetMessageHeaders` (those are restricted to "x-…").
    //
    //   List-Unsubscribe       → tagged property String 0x1045 (PidTagListUnsubscribe)
    //   List-Unsubscribe-Post  → named property in the PS_INTERNET_HEADERS GUID
    //
    // The HTTPS URI in List-Unsubscribe is the one-click endpoint; combined
    // with List-Unsubscribe-Post, MUAs POST `List-Unsubscribe=One-Click` to
    // it without any user interaction. The in-body link still points at the
    // user-facing /unsubscribe page (see unsubscribeUrl above).
    const oneClickUrl = buildOneClickUnsubscribeUrl(r.id);
    const PS_INTERNET_HEADERS = "{00020386-0000-0000-C000-000000000046}";
    const extendedProperties = [
      { id: "String 0x1045", value: `<${oneClickUrl}>` },
      {
        id: `String ${PS_INTERNET_HEADERS} Name List-Unsubscribe-Post`,
        value: "List-Unsubscribe=One-Click",
      },
    ];
    try {
      await sendMail({
        to: r.email,
        subject: mail.subject,
        htmlBody: mail.html,
        extendedProperties,
      });
      sent++;
      console.log(`  ${color.green("✓")} ${color.gray(prefix)} ${tag} ${r.email}`);
      try {
        await markReminderSent(r.email, currentSemester.key, r.id);
      } catch (e) {
        // Email was sent but DB record failed — warn loudly so the operator can
        // reconcile manually before re-running (or this address may be
        // emailed twice).
        console.log(
          `     ${color.yellow("⚠")}  email sent but failed to record in ac_challenge_reminders: ${color.yellow((e as Error).message ?? String(e))}`,
        );
      }
    } catch (e) {
      failed++;
      failedAddresses.push(r.email);
      console.log(
        `  ${color.red("✗")} ${color.gray(prefix)} ${tag} ${r.email} — ${color.red((e as Error).message ?? String(e))}`,
      );
      // 429 from Microsoft Graph means we hit a per-mailbox throttle. Honour
      // the Retry-After header so the rest of the batch doesn't cascade-fail.
      // The current row stays counted as "failed" and will be retried on the
      // next run (it's not in ac_challenge_reminders yet).
      if (e instanceof GraphSendMailError && e.status === 429) {
        const waitMs = (e.retryAfter ?? 60) * 1000;
        console.log(
          `     ${color.yellow(`⚠  Throttled (429). Microsoft Graph Retry-After: ${e.retryAfter ?? "unspecified"}s. Pausing batch for ${Math.ceil(waitMs / 1000)}s before continuing.`)}`,
        );
        await sleep(waitMs);
      }
    }
  }

  console.log("");
  console.log(color.bold("Done."));
  console.log(`  ${color.greenBold(`${sent} sent`)}`);
  console.log(
    `  ${failed > 0 ? color.redBold(`${failed} failed`) : color.gray(`${failed} failed`)}`,
  );
  if (failedAddresses.length > 0) {
    console.log(color.red("Failed addresses:"));
    for (const a of failedAddresses) console.log(`  - ${a}`);
  }
  console.log("");
  console.log(`Records persisted to ${color.gray("ac_challenge_reminders")}.`);
}

main().catch((e) => {
  console.error(color.red(`Fatal: ${(e as Error)?.message ?? e}`));
  process.exit(1);
});
