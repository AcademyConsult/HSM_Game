import {
  generateUnsubscribeToken,
  verifyUnsubscribeToken,
  buildUnsubscribeUrl,
} from "../lib/unsubscribe-token";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`[test] FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`[test] PASS: ${message}`);
}

function main() {
  if (!process.env.UNSUBSCRIBE_HMAC_SECRET) {
    throw new Error(
      "UNSUBSCRIBE_HMAC_SECRET is not set. Add it to .env.local or pass it inline.",
    );
  }

  const sampleId = process.argv[2] ?? "42";

  const token = generateUnsubscribeToken(sampleId);
  console.log(`[test] id=${sampleId}`);
  console.log(`[test] token=${token}`);

  assert(
    /^[0-9a-f]{64}$/.test(token),
    "token is a 64-char lowercase hex string",
  );

  assert(
    verifyUnsubscribeToken(sampleId, token),
    "verify returns true for matching id+token",
  );

  assert(
    !verifyUnsubscribeToken(
      sampleId,
      token.replace(/.$/, (c) => (c === "0" ? "1" : "0")),
    ),
    "verify returns false when token is tampered",
  );

  assert(
    !verifyUnsubscribeToken(`${sampleId}-other`, token),
    "verify returns false when id is different",
  );

  assert(
    !verifyUnsubscribeToken(sampleId, "not-hex"),
    "verify returns false for malformed token",
  );

  assert(
    !verifyUnsubscribeToken(sampleId, token.slice(0, -1)),
    "verify returns false for wrong-length token",
  );

  assert(
    verifyUnsubscribeToken(sampleId, token.toUpperCase()),
    "verify accepts uppercase hex (regex is case-insensitive)",
  );

  const numericId = 7;
  const numericToken = generateUnsubscribeToken(numericId);
  assert(
    verifyUnsubscribeToken(numericId, numericToken),
    "verify works for numeric ids",
  );
  assert(
    verifyUnsubscribeToken("7", numericToken),
    "string '7' verifies against token generated from number 7",
  );

  const base_url = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
  const url = buildUnsubscribeUrl(sampleId, base_url);
  console.log(`[test] url=${url}`);
  assert(
    url ===
      base_url +
        `/unsubscribe?id=${encodeURIComponent(sampleId)}&token=${token}`,
    "buildUnsubscribeUrl composes id + token correctly",
  );

  console.log("[test] All checks passed");
}

main();
