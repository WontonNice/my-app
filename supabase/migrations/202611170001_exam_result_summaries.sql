begin;
-- The teacher roster reads every saved exam result. Each result embeds a full copy of the exam it
-- was taken on (result.analysisContent), which made that read about 38 MB for one class.
-- This view returns each result without the copy, plus a hash that identifies the copy, so the
-- server can read the small rows every time and fetch each distinct exam copy only once.
create or replace view public.student_exam_result_summaries
with (security_invoker = true) as
select
  id,
  user_id,
  assessment_id,
  completed_at,
  updated_at,
  result - 'analysisContent' as result,
  case when result ? 'analysisContent' then md5((result -> 'analysisContent')::text) end as snapshot_hash,
  -- Selected only when a copy is fetched, always together with its hash from the same row.
  result -> 'analysisContent' as snapshot
from public.student_exam_results;
revoke all on public.student_exam_result_summaries from anon, authenticated;
grant select on public.student_exam_result_summaries to service_role;
notify pgrst, 'reload schema';
commit;
