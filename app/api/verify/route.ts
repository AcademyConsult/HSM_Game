import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { verifySchema } from "@/lib/validation";

export async function POST(request: Request) {
  console.log("[verify] Received verification request");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.log("[verify] Failed to parse request body");
    return NextResponse.json(
      { error: "Ungültiger Request-Body" },
      { status: 400 }
    );
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    console.log("[verify] Validation failed:", parsed.error.issues);
    return NextResponse.json(
      { error: "Ungültiges Token-Format" },
      { status: 400 }
    );
  }

  const { token } = parsed.data;
  console.log("[verify] Looking up token:", token);

  // Look up submission by token
  const { data: submission, error: fetchError } = await supabase
    .from("ac_challenge_submissions")
    .select("id, first_name, is_verified, token_expires_at")
    .eq("verification_token", token)
    .maybeSingle();

  if (fetchError) {
    console.error("[verify] Database query failed:", fetchError);
    return NextResponse.json(
      { error: "Datenbankfehler" },
      { status: 500 }
    );
  }

  if (!submission) {
    console.log("[verify] Token not found in database");
    return NextResponse.json(
      { error: "Token nicht gefunden" },
      { status: 404 }
    );
  }

  console.log("[verify] Found submission id:", submission.id, "is_verified:", submission.is_verified, "expires:", submission.token_expires_at);

  // Check expiry
  if (new Date(submission.token_expires_at) < new Date()) {
    console.log("[verify] Token expired at:", submission.token_expires_at);
    return NextResponse.json(
      { error: "Token ist abgelaufen" },
      { status: 410 }
    );
  }

  // Already verified — return success idempotently
  if (submission.is_verified) {
    console.log("[verify] Already verified, returning success idempotently");
    return NextResponse.json({ name: submission.first_name });
  }

  // Mark as verified
  console.log("[verify] Marking submission as verified...");
  const { error: updateError } = await supabase
    .from("ac_challenge_submissions")
    .update({ is_verified: true, verified_at: new Date().toISOString() })
    .eq("id", submission.id);

  if (updateError) {
    console.error("[verify] Database update failed:", updateError);
    return NextResponse.json(
      { error: "Verifizierung fehlgeschlagen" },
      { status: 500 }
    );
  }

  console.log("[verify] Verification successful for:", submission.first_name);
  return NextResponse.json({ name: submission.first_name });
}
