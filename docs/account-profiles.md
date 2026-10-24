# Account profiles and recovery

Students and staff open **Profile settings** from their account menu. Pictures are cropped to a square, resized to 256 pixels and stored privately with the account profile. The teacher's **Student accounts** workspace shows the last Supabase sign-in and a live online indicator. A separate lease per browser tab refreshes every 30 seconds; the teacher roster refreshes every 15 seconds and marks leases older than 90 seconds offline. This indicates a connected authenticated browser, not attention or attendance.

Apply `supabase/migrations/202610240004_account_profiles.sql` in each environment. It was applied to the configured Nathan Tutors project on October 24, 2026. Its four tables and three functions are service-role only, with RLS enabled and no anonymous or authenticated browser access. The API verifies the current Supabase user on every protected request; only teachers/admins can read presence.

## Email delivery setup

The existing Render service uses its free tier, which blocks outbound SMTP on ports 25, 465 and 587. Use the HTTPS Resend adapter on that tier. An existing provider was not found in the inspected Render/Supabase settings or open provider tabs; real email delivery remains pending.

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
- Recovery responses do not disclose whether an email is registered. Public and authenticated routes use database-backed rate limits. Archived accounts cannot recover or edit their profiles.
- Missing delivery configuration produces an explicit setup message. Delivery failures never mark an address verified. `emailDeliveryReady` means configuration is present, not a completed end-to-end delivery test.
- Profile images accept PNG, JPEG and WebP only, with size and signature checks. SVG and remote-image URLs are not accepted.

`npm run test:accounts` runs isolated route, permission, token, presence and mail-adapter tests. These tests stub delivery and do not send emails or change real passwords. Production mail delivery still needs the provider setup above.
