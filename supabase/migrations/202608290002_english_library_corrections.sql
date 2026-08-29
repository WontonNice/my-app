create table if not exists public.student_library_corrections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null references public.teacher_library_books(book_id) on delete cascade,
  attempt_id uuid not null references public.student_library_attempts(id) on delete cascade,
  responses jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, book_id, attempt_id)
);

alter table public.student_library_corrections enable row level security;

do $$ begin
  create policy "Students can read their own library corrections"
    on public.student_library_corrections
    for select
    using (auth.uid() = user_id);
exception when duplicate_object then null;
end $$;

create index if not exists student_library_corrections_book_id_idx
  on public.student_library_corrections(book_id, submitted_at desc);

create index if not exists student_library_corrections_user_book_idx
  on public.student_library_corrections(user_id, book_id);

notify pgrst, 'reload schema';
