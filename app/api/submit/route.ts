import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { submitSchema } from "@/lib/validation";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail, buildVerificationEmailHtml } from "@/lib/email";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const submitLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (submitLimiter(ip)) {
    console.log("[submit] Rate limited");
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  console.log("[submit] Received submission request");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.log("[submit] Failed to parse request body");
    return NextResponse.json(
      { error: "Ungültiger Request-Body" },
      { status: 400 }
    );
  }

  // Validate input
  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    console.log("[submit] Validation failed:", parsed.error.issues);
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, vorname, nachname, schaetzwert, captchaToken, HatWerbungAboniert } =
    parsed.data;

  console.log("[submit] Input validated");

  // Verify reCAPTCHA
  console.log("[submit] Verifying reCAPTCHA token...");
  const recaptchaResult = await verifyRecaptcha(captchaToken);
  if (!recaptchaResult.success) {
    console.log("[submit] reCAPTCHA failed");
    return NextResponse.json(
      { error: recaptchaResult.error },
      { status: 400 }
    );
  }
  console.log("[submit] reCAPTCHA passed");

  // Generate verification token
  const verificationToken = crypto.randomUUID();
  const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://challenge.academyconsult.de";
  const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;

  console.log("[submit] Generated verification token, expires:", tokenExpiresAt);

  const emailLower = email.toLowerCase();
  const COOLDOWN_MS = 90 * 24 * 60 * 60 * 1000; // 3 months
  const cooldownThresholdISO = new Date(Date.now() - COOLDOWN_MS).toISOString();

  // Insert first, then check for any concurrent / pre-existing entry within the
  // cooldown window. Inserting before checking shrinks the race window from
  // "however long the email send takes" down to the few ms between INSERT
  // commit and SELECT — and lets the loser delete itself deterministically.
  console.log("[submit] Inserting submission row");
  const { data: inserted, error: insertError } = await supabase
    .from("ac_challenge_submissions")
    .insert({
      email: emailLower,
      first_name: vorname,
      last_name: nachname,
      estimation_value: schaetzwert,
      is_verified: false,
      verification_token: verificationToken,
      has_newsletter: HatWerbungAboniert,
      token_expires_at: tokenExpiresAt,
    })
    .select("id, created_at")
    .single();

  if (insertError || !inserted) {
    console.error("[submit] Insert failed:", insertError);
    return NextResponse.json(
      { error: "Daten konnten nicht gespeichert werden." },
      { status: 500 }
    );
  }

  const ourId = inserted.id;
  const rollback = async (reason: string) => {
    const { error: rollbackError } = await supabase
      .from("ac_challenge_submissions")
      .delete()
      .eq("id", ourId);
    if (rollbackError) {
      console.error(`[submit] Rollback (${reason}) failed:`, rollbackError);
    }
  };

  // Earliest entry in the cooldown window for this email is the legitimate
  // raffle entry. If that's not us — either an older row blocks us, or a
  // concurrent submission beat us — we delete ourselves and return 409.
  console.log("[submit] Checking for cooldown / concurrent entries");
  const { data: winners, error: checkError } = await supabase
    .from("ac_challenge_submissions")
    .select("id")
    .eq("email", emailLower)
    .gt("created_at", cooldownThresholdISO)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1);

  if (checkError) {
    console.error("[submit] Cooldown check failed:", checkError);
    await rollback("cooldown check error");
    return NextResponse.json(
      { error: "Daten konnten nicht gespeichert werden." },
      { status: 500 }
    );
  }

  const winnerId = winners?.[0]?.id;
  if (winnerId !== ourId) {
    console.log("[submit] Cooldown active or race lost, returning 409");
    await rollback("cooldown / lost race");
    return NextResponse.json(
      { error: "This email has recently taken part." },
      { status: 409 }
    );
  }

  // Send verification email; roll back if delivery fails so the user can retry
  // without being blocked by their own pending entry.
  console.log("[submit] Sending verification email");
  try {
    await sendMail({
      to: email,
      subject: "Academy Consult Challenge | Verifiziere deine Email",
      htmlBody: buildVerificationEmailHtml({
        vorname,
        verificationUrl,
        hatWerbungAboniert: HatWerbungAboniert,
      }),
      bcc: process.env.BCC_EMAIL,
    });
    console.log("[submit] Email sent successfully");
  } catch (err) {
    console.error("[submit] Email sending failed:", err);
    await rollback("email send failure");
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." },
      { status: 500 }
    );
  }

  console.log("[submit] Submission created successfully");
  return NextResponse.json({ message: "Item created successfully" });
}
