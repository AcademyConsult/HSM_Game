import crypto from "node:crypto";

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_HMAC_SECRET;
  if (!secret) {
    throw new Error("UNSUBSCRIBE_HMAC_SECRET is not configured");
  }
  return secret;
}

export function generateUnsubscribeToken(id: string | number, secret: string = getSecret()): string {
  const message = `unsubscribe:${id}`;
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

export function verifyUnsubscribeToken(
  id: string | number,
  token: string,
  secret: string = getSecret()
): boolean {
  if (!/^[0-9a-f]{64}$/i.test(token)) return false;

  const expected = generateUnsubscribeToken(id, secret);
  const expectedBuf = Buffer.from(expected, "hex");
  const tokenBuf = Buffer.from(token, "hex");

  if (expectedBuf.length !== tokenBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, tokenBuf);
}

export function buildUnsubscribeUrl(id: string | number, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://challenge.academyconsult.de";
  const token = generateUnsubscribeToken(id);
  return `${base}/unsubscribe?id=${encodeURIComponent(String(id))}&token=${token}`;
}
