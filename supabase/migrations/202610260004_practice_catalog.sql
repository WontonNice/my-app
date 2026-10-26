begin;
create table if not exists public.infinite_practice_catalog (
  id text primary key check(id='main'),
  revision integer not null check(revision>0),
  catalog jsonb not null check(jsonb_typeof(catalog)='object'),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.infinite_practice_catalog enable row level security;
revoke all on public.infinite_practice_catalog from anon, authenticated;
grant all on public.infinite_practice_catalog to service_role;
notify pgrst, 'reload schema';
commit;
