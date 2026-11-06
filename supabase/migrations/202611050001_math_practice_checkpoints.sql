begin;
create table public.math_practice_checkpoints (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  best bigint not null check (best >= 0),
  session jsonb,
  revision uuid not null,
  primary key (user_id, module_id)
);
alter table public.math_practice_checkpoints enable row level security;
revoke all on public.math_practice_checkpoints from anon, authenticated;
grant select, insert, update on public.math_practice_checkpoints to service_role;
notify pgrst, 'reload schema';
commit;
