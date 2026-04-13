const RECAPTCHA_VERIFY_URL =
  "https://www.google.com/recaptcha/api/siteverify";
const SCORE_THRESHOLD = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(
  token: string,
  expectedAction = "form_submit"
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("[recaptcha] RECAPTCHA_SECRET_KEY is not configured");
    return { success: false, error: "reCAPTCHA ist nicht konfiguriert" };
  }

  console.log("[recaptcha] Verifying token with Google...");
  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
    }),
  });

  const data: RecaptchaResponse = await response.json();
  console.log("[recaptcha] Google response:", JSON.stringify({ success: data.success, score: data.score, action: data.action, errors: data["error-codes"] }));

  if (!data.success) {
    return {
      success: false,
      error: `reCAPTCHA-Verifizierung fehlgeschlagen: ${data["error-codes"]?.join(", ") ?? "unbekannter Fehler"}`,
    };
  }

  if (data.action && data.action !== expectedAction) {
    console.log("[recaptcha] Action mismatch: expected", expectedAction, "got", data.action);
    return {
      success: false,
      score: data.score,
      error: "reCAPTCHA-Aktion stimmt nicht überein",
    };
  }

  if (data.score !== undefined && data.score < SCORE_THRESHOLD) {
    console.log("[recaptcha] Score too low:", data.score, "< threshold", SCORE_THRESHOLD);
    return {
      success: false,
      score: data.score,
      error: "reCAPTCHA-Score zu niedrig",
    };
  }

  return { success: true, score: data.score };
}
