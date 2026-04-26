import { sendMail, buildVerificationEmailHtml } from "../lib/email";

async function main() {
  const recipient = process.env.TEST_EMAIL_RECIPIENT;

  if (!recipient) {
    throw new Error(
      "TEST_EMAIL_RECIPIENT is not set in .env.local"
    );
  }

  const htmlBody = buildVerificationEmailHtml({
    vorname: "Test",
    verificationUrl: "https://example.com/verify?token=test-token",
    hatWerbungAboniert: false,
  });

  await sendMail({
    to: recipient,
    subject: "[Test] Academy Consult Challenge — Azure Email Send",
    htmlBody,
  });

  console.log(`[test] Email dispatched to ${recipient}`);
}

main().catch((err) => {
  console.error("[test] Failed:", err);
  process.exit(1);
});
