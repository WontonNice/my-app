create table if not exists public.student_exam_sessions (
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id text not null,
  answers jsonb not null default '{}'::jsonb,
  completed_sections text[] not null default '{}',
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  primary key (user_id, assessment_id)
);

alter table public.student_exam_sessions enable row level security;

do $$ begin
  create policy "Students can read their own exam sessions"
    on public.student_exam_sessions
    for select
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

create index if not exists student_exam_sessions_updated_at_idx
  on public.student_exam_sessions(updated_at desc);

notify pgrst, 'reload schema';
