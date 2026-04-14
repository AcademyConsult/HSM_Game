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

  // Check duplicate email
  console.log("[submit] Checking for duplicate email...");
  const { data: existing, error: lookupError } = await supabase
    .from("ac_challenge_submissions")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (lookupError) {
    console.error("[submit] Duplicate check query failed:", lookupError);
  }

  if (existing) {
    console.log("[submit] Duplicate email found, returning 409");
    return NextResponse.json(
      { error: "This email has already taken part." },
      { status: 409 }
    );
  }

  // Generate verification token
  const verificationToken = crypto.randomUUID();
  const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://challenge.academyconsult.de";
  const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;

  console.log("[submit] Generated verification token, expires:", tokenExpiresAt);

  // Send verification email
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
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut." },
      { status: 500 }
    );
  }

  // Store submission
  console.log("[submit] Inserting submission into database...");
  const { error: insertError } = await supabase.from("ac_challenge_submissions").insert({
    email: email.toLowerCase(),
    first_name: vorname,
    last_name: nachname,
    estimation_value: schaetzwert,
    is_verified: false,
    verification_token: verificationToken,
    has_newsletter: HatWerbungAboniert,
    token_expires_at: tokenExpiresAt,
  });

  if (insertError) {
    console.error("[submit] Database insert failed:", insertError);
    return NextResponse.json(
      { error: "Daten konnten nicht gespeichert werden." },
      { status: 500 }
    );
  }

  console.log("[submit] Submission created successfully");
  return NextResponse.json({ message: "Item created successfully" });
}
