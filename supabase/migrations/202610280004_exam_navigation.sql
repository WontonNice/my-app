-- Persist the student's last screen/question for each section alongside their draft.
alter table public.student_exam_sessions add column if not exists navigation jsonb;
notify pgrst, 'reload schema';
