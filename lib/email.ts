let cachedToken: { token: string; expiresAt: number } | null = null;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getGraphAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log("[email] Using cached Graph API token");
    return cachedToken.token;
  }

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Azure AD credentials are not configured");
  }

  console.log("[email] Requesting new Graph API token");
  const response = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    }
  );

  if (!response.ok) {
    console.error("[email] Token request failed:", response.status);
    throw new Error("Failed to get Graph API token");
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000, // refresh 5min before expiry
  };

  console.log("[email] Acquired new Graph API token, expires in:", data.expires_in, "seconds");
  return cachedToken.token;
}

interface SendMailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  bcc?: string;
  // Single-value extended (MAPI) properties. Use this to set headers that
  // Graph's `internetMessageHeaders` rejects because they don't start with
  // "x-" — notably List-Unsubscribe (PidTagListUnsubscribe, "String 0x1045")
  // and List-Unsubscribe-Post, which has no tagged property and must be set
  // via the PS_INTERNET_HEADERS named-property namespace
  // ({00020386-0000-0000-C000-000000000046}).
  extendedProperties?: Array<{ id: string; value: string }>;
}

export class GraphSendMailError extends Error {
  constructor(
    public status: number,
    public retryAfter: number | null,
    public body: string,
  ) {
    super(
      `Graph sendMail failed: ${status}` +
        (retryAfter !== null ? ` (Retry-After: ${retryAfter}s)` : ""),
    );
    this.name = "GraphSendMailError";
  }
}

export async function sendMail({
  to,
  subject,
  htmlBody,
  bcc,
  extendedProperties,
}: SendMailOptions): Promise<void> {
  const accessToken = await getGraphAccessToken();
  const sender = process.env.GRAPH_MAIL_SENDER;

  if (!sender) {
    throw new Error("GRAPH_MAIL_SENDER is not configured");
  }

  const message: Record<string, unknown> = {
    subject,
    body: { contentType: "HTML", content: htmlBody },
    toRecipients: [{ emailAddress: { address: to } }],
  };

  if (bcc) {
    message.bccRecipients = [{ emailAddress: { address: bcc } }];
  }

  if (extendedProperties && extendedProperties.length > 0) {
    message.singleValueExtendedProperties = extendedProperties;
  }

  console.log("[email] Sending mail");
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${sender}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, saveToSentItems: false }),
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const retryAfterHeader = response.headers.get("Retry-After");
    let retryAfter: number | null = null;
    if (retryAfterHeader) {
      const n = parseInt(retryAfterHeader, 10);
      // Microsoft Graph returns delta-seconds, not HTTP-dates.
      if (!Number.isNaN(n)) retryAfter = n;
    }
    console.error(
      `[email] Graph API sendMail failed: ${response.status}` +
        (retryAfter !== null ? ` (Retry-After: ${retryAfter}s)` : ""),
    );
    if (body) console.error(`[email] Response body: ${body.slice(0, 500)}`);
    throw new GraphSendMailError(response.status, retryAfter, body);
  }

  console.log("[email] Mail sent successfully");
}

export function buildVerificationEmailHtml({
  vorname,
  verificationUrl,
  hatWerbungAboniert,
}: {
  vorname: string;
  verificationUrl: string;
  hatWerbungAboniert: boolean;
}): string {
  const greeting = vorname ? `Hey ${escapeHtml(vorname)},` : "Hey,";
  const newsletterMention = hatWerbungAboniert ? " und das Newsletter-Abo" : "";
  const eFellowsBlock = hatWerbungAboniert
    ? `<p><strong>e-fellows Gewinnspiel:</strong><br/>
  Um final am Gewinnspiel für den 200&nbsp;€ Amazon-Gutschein teilzunehmen, musst du dich noch bei unserem Partner e-fellows registrieren.
  Alle Infos findest du hier:
  <a href="https://www.e-fellows.net/academy-consult-challenge">https://www.e-fellows.net/academy-consult-challenge</a>
</p>`
    : "";

  return `<div style="font-family: Verdana, Geneva, sans-serif; font-size: 11pt;">
  <p>${greeting}</p>

  <p>vielen Dank für Deine Teilnahme an der <strong>Academy Consult Challenge</strong>!</p>

  <p>
    Um Deine Teilnahme${newsletterMention} abzuschließen, klicke auf diesen Link, um Deine E-Mail-Adresse zu bestätigen:<br/>
    <a href="${verificationUrl}">${verificationUrl}</a>
  </p>

  <p>Solltest du dich nicht angemeldet haben, kannst du diese E-Mail einfach ignorieren.</p>

  ${eFellowsBlock}

  <p>Viel Erfolg!<br/>Dein Team von Academy Consult</p>
</div>`;
}
