import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

// RFC 8058 one-click unsubscribe endpoint.
//
// This is the URL referenced from the `List-Unsubscribe` mail header.
// Gmail/Yahoo (and other RFC 8058 MUAs) call this with:
//   POST /api/unsubscribe/one-click?id=<id>&token=<hmac>
//   Content-Type: application/x-www-form-urlencoded
//   List-Unsubscribe=One-Click
//
// The handler verifies the HMAC, flips has_newsletter to false, and returns
// 200 — no redirect, no body, no user interaction.
//
// A GET handler is provided too: if a human pastes the header URL into a
// browser they get redirected to the regular confirmation page.

const oneClickLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 30 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (oneClickLimiter(ip)) {
    console.log("[unsubscribe-one-click] Rate limited");
    return new NextResponse(null, { status: 429 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");

  if (!id || !token || !/^[0-9a-f]{64}$/i.test(token)) {
    console.log("[unsubscribe-one-click] Missing or malformed id/token");
    return new NextResponse("invalid request", { status: 400 });
  }

  // RFC 8058 §3.1: body MUST be `List-Unsubscribe=One-Click`, form-encoded.
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/x-www-form-urlencoded")) {
    console.log("[unsubscribe-one-click] Unsupported content type:", contentType);
    return new NextResponse("unsupported content type", { status: 415 });
  }

  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  if (params.get("List-Unsubscribe") !== "One-Click") {
    console.log("[unsubscribe-one-click] Body did not contain List-Unsubscribe=One-Click");
    return new NextResponse("invalid request body", { status: 400 });
  }

  if (!verifyUnsubscribeToken(id, token)) {
    console.log("[unsubscribe-one-click] HMAC verification failed for id:", id);
    return new NextResponse("invalid token", { status: 401 });
  }

  const { data: submission, error: fetchError } = await supabase
    .from("ac_challenge_submissions")
    .select("id, has_newsletter")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("[unsubscribe-one-click] Database query failed:", fetchError);
    return new NextResponse("internal error", { status: 500 });
  }

  // Idempotent: if the row is gone or already unsubscribed, still return 200.
  // The mailbox provider just wants confirmation that the address won't
  // receive further mail; surfacing a 404 here would be noise.
  if (!submission || !submission.has_newsletter) {
    console.log("[unsubscribe-one-click] Already unsubscribed or no row, id:", id);
    return new NextResponse(null, { status: 200 });
  }

  const { error: updateError } = await supabase
    .from("ac_challenge_submissions")
    .update({ has_newsletter: false })
    .eq("id", submission.id);

  if (updateError) {
    console.error("[unsubscribe-one-click] Database update failed:", updateError);
    return new NextResponse("internal error", { status: 500 });
  }

  console.log("[unsubscribe-one-click] Unsubscribed id:", id);
  return new NextResponse(null, { status: 200 });
}

// Some MUAs (and humans) hit the URL with GET. Send them to the user-facing
// page so the experience matches the in-body link.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");
  const target = new URL("/unsubscribe", url);
  if (id) target.searchParams.set("id", id);
  if (token) target.searchParams.set("token", token);
  return NextResponse.redirect(target, 302);
}
