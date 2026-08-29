create extension if not exists pgcrypto;

create table if not exists public.teacher_library_books (
  book_id text primary key,
  title text not null,
  access_code text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_library_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null references public.teacher_library_books(book_id) on delete cascade,
  attempt_number integer not null check (attempt_number > 0),
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  total_time_seconds integer not null check (total_time_seconds >= 0),
  question_stats jsonb not null default '[]'::jsonb,
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  unique (user_id, book_id, attempt_number)
);

alter table public.teacher_library_books enable row level security;
alter table public.student_library_attempts enable row level security;

do $$ begin
  create policy "Students can read their own library attempts"
    on public.student_library_attempts
    for select
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

create index if not exists student_library_attempts_book_id_idx
  on public.student_library_attempts(book_id, completed_at desc);

create index if not exists student_library_attempts_user_book_idx
  on public.student_library_attempts(user_id, book_id, attempt_number desc);

notify pgrst, 'reload schema';
