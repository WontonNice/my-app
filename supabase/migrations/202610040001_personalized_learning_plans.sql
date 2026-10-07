-- No legacy homework table exists: the previous assignment page contained static examples.
-- The API shares auth.users and existing progress/attempt records, not a second roster.
create table if not exists public.student_learning_plans (
  student_id uuid primary key references auth.users(id) on delete cascade,
  passage_pace numeric check (passage_pace > 0 and passage_pace <= 100),
  target_date date,
  teacher_notes text not null default '',
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
create table if not exists public.student_assignments (
  id uuid primary key,
  student_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('passage','practice','exam','external','offline')),
  content_id text,
  title text not null,
  instructions text not null default '',
  url text,
  status text not null check (status in ('planned','assigned','in_progress','review','completed','skipped','cancelled')),
  assigned_at timestamptz,
  due_date date,
  planned_date date,
  completed_at timestamptz,
  estimated_minutes integer check (estimated_minutes > 0 and estimated_minutes <= 10080),
  question_target integer check (question_target > 0 and question_target <= 10000),
  practice_baseline integer,
  completion jsonb,
  events jsonb not null default '[]'::jsonb check (jsonb_typeof(events) = 'array'),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revision integer not null default 1,
  check ((kind in ('passage','practice','exam') and content_id is not null) or (kind in ('external','offline') and content_id is null))
);
create index if not exists student_assignments_student_status_idx on public.student_assignments(student_id,status,due_date);
create index if not exists student_assignments_student_content_idx on public.student_assignments(student_id,kind,content_id);
create index if not exists student_assignments_student_created_idx on public.student_assignments(student_id,created_at desc);
create index if not exists student_assignments_student_planned_idx on public.student_assignments(student_id,planned_date) where status = 'planned';
alter table public.student_assignments enable row level security;
alter table public.student_learning_plans enable row level security;
-- All access goes through authenticated server endpoints. Do not expose drafts,
-- teacher-only notes, or event actors through direct browser database reads.
revoke all on public.student_assignments from anon, authenticated;
revoke all on public.student_learning_plans from anon, authenticated;
grant all on public.student_assignments to service_role;
grant all on public.student_learning_plans to service_role;
notify pgrst, 'reload schema';
