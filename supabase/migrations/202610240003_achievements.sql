-- Appearance is teacher-controlled; progress is derived from submitted exam records.
create table if not exists public.achievement_designs (
  id text primary key check (id = 'perfect-math'),
  design jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  updated_by uuid not null references auth.users(id),
  updated_at timestamptz not null default now()
);
alter table public.achievement_designs enable row level security;
revoke all on public.achievement_designs from anon, authenticated;
grant all on public.achievement_designs to service_role;
