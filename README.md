# Nathan Tutors

Student tutoring portal built with React, Vite, Express, TypeScript, and Supabase.

## Scripts

Run the client locally:

```powershell
npm.cmd run dev:client
```

Build the full app:

```powershell
npm.cmd run build
```

Run all TypeScript checks:

```powershell
npm.cmd run typecheck
```

Run lint checks:

```powershell
npm.cmd run lint
```

Run the complete release gate (typecheck, lint, and production build):

```powershell
npm.cmd run verify
```

Start the production server after building:

```powershell
npm.cmd run start
```

Copy `.env.example` to `.env` for local server configuration.

## Auth

The browser auth flow uses Supabase email/password auth.

Required local variables:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The server routes that manage staff, rosters, and attendance also require a
Supabase service-role secret. Either service-role variable name is supported:

```txt
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
# or SUPABASE_SERVICE_ROLE_KEY=
```

Signup creates a student account by default using user metadata:

```txt
role=student
```

Teacher accounts should be assigned manually in Supabase by setting user metadata to:

```txt
role=teacher
```

## Project Layout

```txt
client/src/
  content/      Static page content and simple display data
  pages/        Route-level screens
  styles/       Global styles
  App.tsx       Top-level client app component
  main.tsx      React entrypoint

server/src/
  config/       Environment parsing and app configuration
  lib/          Shared service clients, such as Supabase
  routes/       Express route modules
  app.ts        Express app, middleware, and routes
  server.ts     Production listener
```

This keeps feature work from piling into `App.tsx` or `server.ts`. When student accounts,
assignments, assessments, and rewards are added, they should each get their own feature
folder instead of being mixed into the entry files.

## Staff dashboard storage rollout

Staff rosters, schedules, swimming records, dismissal details, and attendance are stored
in database tables so they do not enlarge Supabase Auth access tokens.

1. Apply `supabase/migrations/202607150001_staff_dashboard_storage.sql` to Supabase.
2. In Supabase, open **Authentication -> Hooks**, enable **Custom Access Token**, and
   select `public.custom_access_token_hook`.
3. Deploy the application.
4. Copy and verify legacy Auth metadata without deleting it:

```powershell
npm.cmd run migrate:staff-dashboard
```

5. After verifying the deployed staff and admin dashboards, remove the legacy Auth copy:

```powershell
npm.cmd run migrate:staff-dashboard:compact
```

The client automatically refreshes an older token once if the API rejects it. Signing
out and back in remains the manual recovery path if Supabase cannot refresh the session.
Never run the compact command before the copy-and-verify command succeeds.

## Reliability and release checks

- Render uses `/health` as a lightweight process health check.
- `/health/ready` and `/api/health/ready` verify that the server can reach the
  database-backed staff dashboard storage. The result is cached briefly so monitoring
  does not add meaningful database load.
- Authenticated client requests use the newest local Supabase session, force one token
  refresh after a `401` or `431`, and retry only read-only requests on transient failures.
- All browser API calls time out after 15 seconds. External attendance webhooks time out
  after 5 seconds, so a slow integration cannot leave the dashboard hanging indefinitely.
- API error responses include a request reference that matches the server log entry.
- The HTML shell is never cached, while versioned Vite assets are cached immutably. This
  prevents an old page from loading files removed by a newer deployment.

Before every deployment, run:

```powershell
npm.cmd run verify
```

After deployment, confirm both endpoints return HTTP 200:

```txt
/health
/api/health/ready
```

If `/health` is up but readiness is down, check the Supabase project status and the
server's `SUPABASE_URL` and service-role variables. If both endpoints are down, check the
Render service and the latest deployment logs first.
