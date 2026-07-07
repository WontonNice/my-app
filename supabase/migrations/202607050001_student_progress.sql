create extension if not exists pgcrypto;

create table if not exists public.student_exam_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id text not null,
  result jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, assessment_id)
);

create table if not exists public.student_practice_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_slug text not null,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_slug)
);

alter table public.student_exam_results enable row level security;
alter table public.student_practice_progress enable row level security;

do $$ begin
  create policy "Students can read their exam results" on public.student_exam_results for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Students can read their practice progress" on public.student_practice_progress for select using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

create index if not exists student_exam_results_user_id_idx on public.student_exam_results(user_id);
create index if not exists student_practice_progress_user_id_idx on public.student_practice_progress(user_id);

notify pgrst, 'reload schema';
