import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "hACk the Case Email Preview",
  description: "Preview of the hACk the Case confirmation email.",
  robots: {
    index: false,
    follow: false,
  },
};

const emailHtml = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="x-apple-disable-message-reformatting">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>You’re in — hACk the Case</title>
</head>
<body style="margin:0;padding:0;background:#000000;">
  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    You’re in — hACk the Case on Thursday, 23 October at Celonis (Munich).
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#000000;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:640px;border-collapse:collapse;background:#000000;">
          
          <!-- Top accent bar -->
          <tr><td style="height:8px;background:#993333;font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Partner logos image (black background image, responsive) -->
          <tr>
            <td align="center" style="padding:16px 24px 8px 24px;">
              <img src="/logos_hack_the_case.png"
                   alt="Academy Consult × Celonis × Lovable × Corbado × Vestigas"
                   width="592"
                   style="display:block;border:0;width:100%;max-width:592px;height:auto;">
            </td>
          </tr>

          <!-- Hero headline like the poster -->
          <tr>
            <td style="padding:8px 24px 0 24px;text-align:center;">
              <div style="font-family:Verdana, Geneva, sans-serif;font-size:34px;line-height:1.15;color:#ffffff;font-weight:700;letter-spacing:0.5px;">
                <span style="color:#ffffff;">h</span><span style="color:#993333;">AC</span><span style="color:#ffffff;">k the case</span>
              </div>
            </td>
          </tr>

          <!-- Date & location -->
          <tr>
            <td style="padding:6px 24px 18px 24px;text-align:center;font-family:Verdana, Geneva, sans-serif;color:#ffffff;">
              <div style="font-size:12pt;line-height:1.5;opacity:0.95;">
                23.10.2025<br>
                📍 Celonis Office, Munich
              </div>
            </td>
          </tr>

          <!-- Tagline with pill highlight -->
          <tr>
            <td style="padding:0 24px 28px 24px;text-align:center;font-family:Verdana, Geneva, sans-serif;color:#ffffff;">
              <div style="font-size:18px;font-weight:700;line-height:1.4;">
                Solving real business cases with
                <span style="display:inline-block;padding:6px 10px;background:#993333;border-radius:10px;color:#ffffff;">
                  innovative tech solutions
                </span>
              </div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:0 24px 10px 24px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;line-height:1.6;color:#ffffff;">
              <p style="margin:0 0 12px 0;">Dear <strong>participant</strong>,</p>
              <p style="margin:0;">
                Your profile truly stood out in a highly competitive pool. Congratulations! You’ve been selected to participate in
                <strong>hACk the Case</strong> on <strong>Thursday, 23 October</strong>.
                We received many outstanding applications and still have a waitlist. If you can’t attend, please let us know immediately so we can offer your spot to another applicant.
              </p>
            </td>
          </tr>

          <!-- Card: When & where -->
          <tr>
            <td style="padding:14px 24px 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="border:1px solid #993333;border-radius:12px;background:#000000;">
                <tr>
                  <td style="padding:14px 18px 10px 18px;font-family:Verdana, Geneva, sans-serif;">
                    <div style="font-weight:700;color:#993333;font-size:13pt;line-height:1.3;">When &amp; where</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 18px 18px 18px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;line-height:1.6;color:#ffffff;">
                    <p style="margin:0;"><strong>Arrival:</strong> Please arrive by <strong>09:45</strong>. The official program ends around <strong>20:00</strong>; there will be time to network afterward.</p>
                    <p style="margin:10px 0 0 0;">
                      <strong>Location:</strong> <span style="font-weight:700;">Celonis Office, Theresienstraße 6, 80333 Munich</span> —
                      <a href="https://share.google/1DcFXMKaPLyqQYd4n" style="color:#993333;text-decoration:underline;font-family:Verdana, Geneva, sans-serif;">Open in Maps</a>
                    </p>
                    <p style="margin:10px 0 0 0;">
                      <strong>Building access:</strong> You’ll receive a separate email with a short access form. Please complete it before arrival to ensure smooth entry.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card: What to expect -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="border:1px solid #333333;border-radius:12px;background:#000000;">
                <tr>
                  <td style="padding:14px 18px 10px 18px;font-family:Verdana, Geneva, sans-serif;">
                    <div style="font-weight:700;color:#993333;font-size:13pt;line-height:1.3;">What to expect</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 18px 18px 18px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;line-height:1.6;color:#ffffff;">
                    <ul style="margin:0;padding-left:18px;">
                      <li><strong>3 keynotes</strong> to get you inspired.</li>
                      <li><strong>3 partners:</strong> Celonis, Corbado, and Vestigas <em>(Corbado &amp; Vestigas are founded by Academy Consult members; Celonis is our host partner).</em></li>
                      <li>Two exciting cases to choose from, with <strong>cloud credits provided by our partner Lovable</strong>.</li>
                      <li>Plenty of time to network with founders and peers, including a networking session after the finals.</li>
                      <li><strong>Food &amp; drinks will be provided</strong> throughout the day.
                        If you have dietary restrictions, please email
                        <a href="mailto:hackathon@academyconsult.de" style="color:#993333;text-decoration:underline;">hackathon@academyconsult.de</a>.
                      </li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card: Optional Talent Pool + CTA -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="border:1px solid #333333;border-radius:12px;background:#000000;">
                <tr>
                  <td style="padding:14px 18px 10px 18px;font-family:Verdana, Geneva, sans-serif;">
                    <div style="font-weight:700;color:#993333;font-size:13pt;line-height:1.3;">Optional: Celonis Talent Pool</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 18px 16px 18px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;line-height:1.6;color:#ffffff;">
                    <p style="margin:0 0 12px 0;">
                      As one of our sponsors, Celonis has a Talent Pool to track where later applicants had their initial contact (e.g., hACk the Case).
                      You can sign up here. This is not a newsletter; signing up via this link prioritizes your application in Celonis’ process.
                    </p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background:#993333;border-radius:8px;">
                          <a href="https://app3.greenhouse.io/e/okotjj"
                             style="display:inline-block;padding:10px 16px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;color:#ffffff;text-decoration:none;font-weight:700;">
                             Join Celonis Talent Pool
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Calendar CTA -->
          <tr>
            <td style="padding:20px 24px 0 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                     style="border:1px solid #333333;border-radius:12px;background:#000000;">
                <tr>
                  <td style="padding:14px 18px 8px 18px;font-family:Verdana, Geneva, sans-serif;">
                    <div style="font-weight:700;color:#993333;font-size:13pt;line-height:1.3;">Add to calendar</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 18px 18px 18px;">
                    <!-- Buttons -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <!-- Google Calendar -->
                        <td style="background:#993333;border-radius:8px;">
                          <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=hACk%20the%20Case&dates=20251023T094500/20251023T200000&details=Solving%20real%20business%20cases%20with%20innovative%20tech%20solutions.&location=Celonis%20Office%2C%20Theresienstra%C3%9Fe%206%2C%2080333%20Munich&ctz=Europe%2FBerlin"
                             style="display:inline-block;padding:10px 16px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;color:#ffffff;text-decoration:none;font-weight:700;">
                             Add to Google Calendar
                          </a>
                        </td>
                        <td style="width:12px;">&nbsp;</td>
                        <!-- ICS download (data URI) -->
                        <td style="background:#1a1a1a;border:1px solid #993333;border-radius:8px;">
                          <a href="data:text/calendar;charset=utf-8,BEGIN%3AVCALENDAR%0AVERSION%3A2.0%0APRODID%3A-//Academy%20Consult//hACk%20the%20Case//EN%0ABEGIN%3AVEVENT%0AUID%3Ahackthecase-20251023%40academyconsult.de%0ADTSTAMP%3A20250801T120000Z%0ADTSTART%3A20251023T074500Z%0ADTEND%3A20251023T180000Z%0ASUMMARY%3AhACk%20the%20Case%0ALOCATION%3ACelonis%20Office%5C%2C%20Theresienstra%C3%9Fe%206%5C%2C%2080333%20Munich%0ADESCRIPTION%3AhACk%20the%20Case%20at%20Celonis%20Office%2C%20Munich.%20Solving%20real%20business%20cases%20with%20innovative%20tech%20solutions.%0AEND%3AVEVENT%0AEND%3AVCALENDAR%0A"
                             download="hack-the-case.ics"
                             style="display:inline-block;padding:10px 16px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;color:#ffffff;text-decoration:none;font-weight:700;">
                             Download .ics
                          </a>
                        </td>
                      </tr>
                    </table>
                    <!-- /Buttons -->
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding:22px 24px 8px 24px;font-family:Verdana, Geneva, sans-serif;font-size:11pt;line-height:1.6;color:#ffffff;">
              <p style="margin:0 0 8px 0;">We’re excited to build with you next Thursday!</p>
              <p style="margin:0;"><strong>Your Academy Consult Hackathon Team</strong></p>
            </td>
          </tr>

          <!-- Footer: Social icons (SVG with text labels; swap for PNG if Outlook desktop hides them) -->
          <tr>
            <td style="padding:10px 24px 18px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #333333;">
                <tr>
                  <td style="padding-top:14px;text-align:center;font-family:Verdana, Geneva, sans-serif;">
                    <!-- Icon link -->
                    <a href="https://www.linkedin.com/company/academy-consult/mycompany/" style="color:#ffffff;text-decoration:none;margin:0 8px;display:inline-block;">
                      <span style="display:inline-block;width:36px;height:36px;border-radius:18px;background:#993333;text-align:center;vertical-align:middle;">
                        <!-- LinkedIn SVG (white) -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-top:8px;">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                      </span>
                      <span style="padding-left:6px;vertical-align:middle;">LinkedIn</span>
                    </a>

                    <a href="https://www.youtube.com/channel/UCCJetCDqnmoOtOuE5hv0Z1Q" style="color:#ffffff;text-decoration:none;margin:0 8px;display:inline-block;">
                      <span style="display:inline-block;width:36px;height:36px;border-radius:18px;background:#993333;text-align:center;vertical-align:middle;">
                        <!-- YouTube SVG (white) -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-top:8px;">
                          <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
                        </svg>
                      </span>
                      <span style="padding-left:6px;vertical-align:middle;">YouTube</span>
                    </a>

                    <a href="https://de-de.facebook.com/AcademyConsult" style="color:#ffffff;text-decoration:none;margin:0 8px;display:inline-block;">
                      <span style="display:inline-block;width:36px;height:36px;border-radius:18px;background:#993333;text-align:center;vertical-align:middle;">
                        <!-- Facebook SVG (white) -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-top:8px;">
                          <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                        </svg>
                      </span>
                      <span style="padding-left:6px;vertical-align:middle;">Facebook</span>
                    </a>

                    <a href="https://instagram.com/academy.consult" style="color:#ffffff;text-decoration:none;margin:0 8px;display:inline-block;">
                      <span style="display:inline-block;width:36px;height:36px;border-radius:18px;background:#993333;text-align:center;vertical-align:middle;">
                        <!-- Instagram SVG (white) -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-top:8px;">
                          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                        </svg>
                      </span>
                      <span style="padding-left:6px;vertical-align:middle;">Instagram</span>
                    </a>

                    <a href="https://academyconsult.de/" style="color:#ffffff;text-decoration:none;margin:0 8px;display:inline-block;">
                      <span style="display:inline-block;width:36px;height:36px;border-radius:18px;background:#993333;text-align:center;vertical-align:middle;">
                        <!-- Globe/website SVG (white) -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" style="margin-top:8px;">
                          <path d="M11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m5.9 15.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.98 7.98 0 0 1 2.9 12.8Z" />
                        </svg>
                      </span>
                      <span style="padding-left:6px;vertical-align:middle;">Website</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr><td style="height:8px;background:#993333;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export default function EmailPreviewPage() {
  return (
    <main className="min-h-screen bg-black py-10 text-white">
      <div className="mx-auto w-full max-w-5xl rounded-xl border border-[#993333] bg-black/60 p-4 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-white">
          hACk the Case Email Preview
        </h1>
        <iframe
          title="hACk the Case Email"
          srcDoc={emailHtml}
          className="h-[1800px] w-full rounded-lg border border-[#333333] bg-white"
        />
      </div>
    </main>
  );
}
