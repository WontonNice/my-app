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
