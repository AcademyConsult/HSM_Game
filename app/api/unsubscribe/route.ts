import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { unsubscribeSchema } from "@/lib/validation";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const unsubscribeLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (unsubscribeLimiter(ip)) {
    console.log("[unsubscribe] Rate limited");
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  console.log("[unsubscribe] Received unsubscribe request");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.log("[unsubscribe] Failed to parse request body");
    return NextResponse.json(
      { error: "Ungültiger Request-Body" },
      { status: 400 }
    );
  }

  const parsed = unsubscribeSchema.safeParse(body);
  if (!parsed.success) {
    console.log("[unsubscribe] Validation failed:", parsed.error.issues);
    return NextResponse.json(
      { error: "Ungültiges Token-Format" },
      { status: 400 }
    );
  }

  const { id, token } = parsed.data;

  if (!verifyUnsubscribeToken(id, token)) {
    console.log("[unsubscribe] HMAC verification failed for id:", id);
    return NextResponse.json(
      { error: "Ungültiges Token" },
      { status: 401 }
    );
  }

  console.log("[unsubscribe] Token verified, looking up submission");

  const { data: submission, error: fetchError } = await supabase
    .from("ac_challenge_submissions")
    .select("id, first_name, has_newsletter")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("[unsubscribe] Database query failed:", fetchError);
    return NextResponse.json(
      { error: "Datenbankfehler" },
      { status: 500 }
    );
  }

  if (!submission) {
    console.log("[unsubscribe] Submission not found for id:", id);
    return NextResponse.json(
      { error: "Eintrag nicht gefunden" },
      { status: 404 }
    );
  }

  if (!submission.has_newsletter) {
    console.log("[unsubscribe] Already unsubscribed, returning success idempotently");
    return NextResponse.json({ name: submission.first_name, alreadyUnsubscribed: true });
  }

  console.log("[unsubscribe] Updating has_newsletter to false");
  const { error: updateError } = await supabase
    .from("ac_challenge_submissions")
    .update({ has_newsletter: false })
    .eq("id", submission.id);

  if (updateError) {
    console.error("[unsubscribe] Database update failed:", updateError);
    return NextResponse.json(
      { error: "Abmeldung fehlgeschlagen" },
      { status: 500 }
    );
  }

  console.log("[unsubscribe] Unsubscribed successfully");
  return NextResponse.json({ name: submission.first_name, alreadyUnsubscribed: false });
}
