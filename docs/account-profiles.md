# Account profiles and recovery

Students and staff open **Profile settings** from their account menu. Pictures are cropped to a square, resized to 256 pixels and stored privately with the account profile. The teacher's **Student accounts** workspace shows the last Supabase sign-in and a live online indicator. A separate lease per browser tab refreshes every 30 seconds; the teacher roster refreshes every 15 seconds and marks leases older than 90 seconds offline. This indicates a connected authenticated browser, not attention or attendance.

Apply `supabase/migrations/202610240004_account_profiles.sql` in each environment. It was applied to the configured Nathan Tutors project on October 24, 2026. Its four tables and three functions are service-role only, with RLS enabled and no anonymous or authenticated browser access. The API verifies the current Supabase user on every protected request; only teachers/admins can read presence.

## Email delivery setup

The existing Render service uses its free tier, which blocks outbound SMTP on ports 25, 465 and 587. The HTTPS Resend adapter is now configured in production.

Setup status (October 26, 2026): `mail.nathantutors.com` is verified in the `nathanim560` Resend workspace (domain ID `50ed35ad-fcac-4b9f-ace1-a4b2f15eb629`). The three records below were added in Porkbun and checked through public DNS; Resend reports all three verified. Existing website, forwarding and nameserver settings were preserved. The owner approved a sending-only key restricted to this subdomain; it was transferred directly into Render's server environment without being stored in the repository.

Render service `srv-d8l7tk58nd3s73e09q90` has `RESEND_API_KEY`, `EMAIL_FROM=Nathan Tutors <accounts@mail.nathantutors.com>`, `APP_PUBLIC_URL=https://www.nathantutors.com`, and `TRUST_PROXY_HOPS=1`. Configuration deploy `dep-dbflja2jnfac73cr55j0` is live on existing commit `5f38910924ee9737f1a52479e303539bbda3b90c`. The production profile page now enables sending verification emails. No local development mail credentials were added.

Validation: all eight isolated account tests pass. The owner sent a real verification email after the live profile's current-password check; Resend reports it delivered (email ID `01a17877-f0d0-7982-b19c-337ce995a3e0`). The owner followed the mailbox link and confirmed verification; the production profile now shows the address as verified. A real request through the production Forgot password page then delivered a reset email (Resend email ID `01a1787a-0678-74b6-936e-3e0a5cbad260`). No password was changed: actual password replacement is covered by the isolated route tests, not a live account mutation.

Resend supplied these required DNS records, relative to `nathantutors.com`:

| Type | Host | Value |
| --- | --- | --- |
| TXT | `resend._domainkey.mail` | Copy the public DKIM value from the Resend domain verification page. |
| CNAME | `rsend.mail` | `rsend.forge.rmta.net` |
| CNAME | `send.mail` | `send.forge.rmta.net` |

Recheck the live Resend records before applying them in another environment. Receiving is disabled and tracking is not configured. The optional root DMARC change was not applied.

1. Connect a Resend account and verify a sending domain you own, such as a dedicated subdomain of `nathantutors.com`. Disable link tracking for authentication messages.
2. Set these **server** environment variables in Render: `RESEND_API_KEY` (a sending-only key), `EMAIL_FROM` (a mailbox on the verified domain), and `APP_PUBLIC_URL=https://www.nathantutors.com`.
3. Set `TRUST_PROXY_HOPS=1` on Render so public-route limits use the connecting client's IP. Leave unset when running directly on localhost. Only trust a proxy count matching the deployment topology.
4. Deploy the application changes, then use a test account with a mailbox you control to check verification, expired/used links, and password recovery. Never put API keys in chat, Git, or `VITE_` variables.

Other hosts can use SMTP instead: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `APP_PUBLIC_URL`. Port 465 uses implicit TLS; other ports require STARTTLS. Resend takes precedence when both configurations are present. HTTPS links are required except for localhost development. No external email provider or paid plan is created by the code.

## Account behavior

- Existing username logins and synthetic Supabase email addresses stay intact. The profile's separately verified address is used for recovery.
- Adding/changing an address requires the current password and mailbox verification. A pending address never replaces the current recovery address until verified. One verified address belongs to one account.
- Verification links expire after 60 minutes; reset links expire after 30. Tokens are cryptographically random, stored only as hashes, consumed atomically, and passed in URL fragments to keep them out of server logs and referrers.
- Opening a link does not consume it: the user must press the confirmation button. Passwords require 12–256 characters. A successful reset invalidates outstanding recovery links.
- Recovery returns “Email not found” (404) for unknown, unverified, pending-only, or archived addresses, without creating a token or sending mail. Public and authenticated routes use database-backed rate limits. Archived accounts cannot recover or edit their profiles.
- Missing delivery configuration produces an explicit setup message. Delivery failures never mark an address verified. `emailDeliveryReady` means configuration is present, not a completed end-to-end delivery test.
- Profile images accept PNG, JPEG and WebP only, with size and signature checks. SVG and remote-image URLs are not accepted.

`npm run test:accounts` runs isolated route, permission, token, presence and mail-adapter tests. These tests stub delivery and do not send emails or change real passwords. Production verification and recovery-email delivery have also been checked as described above.

## Colors and daily streaks

Migration `202610260003_account_preferences_streak.sql` was applied to the configured Supabase project on October 26, 2026. Apply it to other environments before deploying this update. Six curated accent colors are saved per account through `/api/account/preferences`; the warm neutral background stays unchanged. The student portal and profile use the selected palette.

Signed-in, visible visits call `/api/account/check-in`. The database records at most one check-in per America/New_York calendar day, atomically across tabs and devices. Consecutive dates extend the streak, missed dates reset it, and the best streak persists. Existing accounts start with their first recorded check-in; historical visits are not invented. The portal header, home page and profile show the streak. Dates and counts from the browser are ignored.

Validation for this update: 14 account tests pass; server typecheck and targeted client lint pass. `supabase/tests/account_preferences_streak.sql` passed against the configured database, with all fixture changes rolled back. Desktop and 390px previews cover palette persistence, streak layout, separate login links, and the unknown-email error retaining the recovery form. Full client typecheck is currently blocked by an unrelated `spectating` prop mismatch in `features/games/world/WorldRoom.tsx`. Application code has not been deployed by this update.
