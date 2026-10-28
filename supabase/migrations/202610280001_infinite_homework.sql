begin;
alter table public.student_assignments add column if not exists streak_target integer check (streak_target between 1 and 100);
create table if not exists public.infinite_homework_sessions (
  assignment_id uuid primary key references public.student_assignments(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  state jsonb not null,
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists infinite_homework_student on public.infinite_homework_sessions(student_id);
alter table public.infinite_homework_sessions enable row level security;
revoke all on public.infinite_homework_sessions from anon, authenticated;
grant all on public.infinite_homework_sessions to service_role;
notify pgrst, 'reload schema';
commit;
