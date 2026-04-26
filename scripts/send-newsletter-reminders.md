# send-newsletter-reminders

Sends reminder emails to Academy Consult Challenge participants — either to nudge current-term participants to apply, or to re-engage people who participated in a previous semester.

## Quick start

```bash
# Preview (no emails sent)
bun scripts/send-newsletter-reminders.ts

# Export HTML preview to a file
bun scripts/send-newsletter-reminders.ts --html

# Debug: preview exactly what live mode would send (applies dedup filter, no emails sent)
bun scripts/send-newsletter-reminders.ts --debug

# Production send
bun --env-file=.env.production scripts/send-newsletter-reminders.ts --live
```

## Modes

| Flag      | Behaviour                                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _(none)_  | **Test mode.** Fetches recipients, prints tables and previews, no emails sent. No dedup filter applied — shows all eligible addresses.                                         |
| `--debug` | **Debug mode.** Same as test, but applies the live dedup filter (skips addresses already emailed this term). Use this to see exactly what `--live` would do before committing. |
| `--live`  | **Live mode.** Sends emails for real. Dedup filter active. Persists each sent address to `ac_challenge_reminders`.                                                             |
| `--html`  | **HTML export.** Writes a self-contained `newsletter-preview-<timestamp>.html` file with recipient tables and email previews rendered in iframes. No emails sent.              |

`--live` and `--debug` are mutually exclusive. `--html` and `--live` are mutually exclusive.

## Recipient bucketing

The script fetches all verified submissions from `ac_challenge_submissions`, groups them by email, and assigns each unique address to one of two buckets:

**Template 1 — current-term (`bucket: "current"`)**  
The address has at least one submission in the current semester (determined from `created_at`). The most-recent opt-in (`has_newsletter = true`) must be their latest submission overall.

**Template 2 — previous-term (`bucket: "previous"`)**  
The address has no submission in the current semester but participated in an earlier one. Same newsletter opt-in requirement.

If the latest submission for an email has `has_newsletter = false`, that address is skipped entirely regardless of earlier opt-ins.

Semester detection is automatic: April–September → Sommersemester, October–March → Wintersemester. The current semester key (e.g. `2026_sose`) is used for both bucketing and dedup.

## Email templates

**Template 1** — urgency-focused. Reminds the participant that the application deadline is today (23:59).

**Template 2** — re-engagement. References the semester they last participated in, showcases the top prizes, and includes CTAs for both the challenge and the application.

Both templates include personalised first name, a footer with an unsubscribe link, and RFC 8058 one-click unsubscribe headers (sent as MAPI extended properties to work around Microsoft Graph restrictions).

## Dedup / persistence

In `--live` and `--debug` modes, the script reads from and writes to the `ac_challenge_reminders` Supabase table.

**Schema:**

| Column          | Type | Notes                                                      |
| --------------- | ---- | ---------------------------------------------------------- |
| `email`         | text | Lowercased. Part of the unique constraint `(email, term)`. |
| `term`          | text | Semester key, e.g. `2026_sose`.                            |
| `submission_id` | int  | The submission row used to generate the unsubscribe token. |

Before sending, the script loads all `email` values for the current term. Any address already present is skipped. After a successful send, the address is upserted with `ignoreDuplicates: true` so a double-run is safe.

If an email is sent but the DB write fails, a warning is printed. The address will not be in the dedup list on the next run — re-running would send to that address again. Reconcile manually if needed.

## Rate limiting

Sends are spaced 2 000 ms apart to stay under Microsoft Graph's per-mailbox throttle (~30 messages/min). If a 429 is returned, the script honours the `Retry-After` header before continuing. The failed address is not written to `ac_challenge_reminders` and will be retried on the next run.

## Configuration

Update these constants at the top of the script each term:

| Constant             | Purpose                                          |
| -------------------- | ------------------------------------------------ |
| `CHALLENGE_DEADLINE` | Date shown in Template 2 copy (e.g. `"29.04."`). |
| `PRIZES`             | Top-3 prize list mirroring the landing page.     |
| `APPLY_URL`          | Direct application link.                         |
