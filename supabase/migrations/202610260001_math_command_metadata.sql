-- Management metadata only. Canonical questions, keys, results and assignments
-- remain in their existing stores; collections contain stable question IDs.
create table if not exists public.math_command_metadata (
  id text primary key check (id = 'main'),
  revision text not null check (length(revision) between 1 and 128),
  state jsonb not null check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.math_command_metadata enable row level security;
revoke all on public.math_command_metadata from anon, authenticated;
grant select, insert, update on public.math_command_metadata to service_role;

comment on table public.math_command_metadata is
  'Singleton teacher-managed math classifications, reference collections and preferences; no copied question database. Server writes use compare-and-swap revision checks.';
