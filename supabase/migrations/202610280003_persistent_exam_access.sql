begin;
-- Runtime access is independent of the authored exam catalog and has no expiry.
create table if not exists public.assessment_access (
  assessment_id text primary key,
  english_open boolean,
  math_open boolean,
  allow_completed_access boolean,
  corrections_open boolean,
  updated_at timestamptz not null default now()
);
alter table public.assessment_access enable row level security;
revoke all on public.assessment_access from anon, authenticated;
grant all on public.assessment_access to service_role;

create or replace function public.set_assessment_access(p_assessment_id text, p_patch jsonb, p_initial jsonb default '{}'::jsonb)
returns public.assessment_access language plpgsql set search_path = public as $$
declare saved public.assessment_access;
begin
  if p_assessment_id is null or length(p_assessment_id) not between 1 and 300
    or jsonb_typeof(p_patch) is distinct from 'object' or p_patch = '{}'::jsonb then
    raise exception 'Choose an exam and access setting.' using errcode='P0001';
  end if;
  if exists(select 1 from jsonb_each(p_patch) e where e.key not in ('english_open','math_open','allow_completed_access','corrections_open') or jsonb_typeof(e.value) <> 'boolean') then
    raise exception 'Access settings must be boolean values.' using errcode='P0001';
  end if;
  if jsonb_typeof(p_initial) is distinct from 'object' then
    raise exception 'Initial access settings must be an object.' using errcode='P0001';
  end if;
  if exists(select 1 from jsonb_each(p_initial) e where e.key not in ('english_open','math_open','allow_completed_access','corrections_open') or jsonb_typeof(e.value) <> 'boolean') then
    raise exception 'Initial access settings must be boolean values.' using errcode='P0001';
  end if;
  insert into public.assessment_access(assessment_id,english_open,math_open,allow_completed_access,corrections_open)
    values(p_assessment_id,coalesce(p_patch->>'english_open',p_initial->>'english_open','false')::boolean,coalesce(p_patch->>'math_open',p_initial->>'math_open','false')::boolean,coalesce(p_patch->>'allow_completed_access',p_initial->>'allow_completed_access','false')::boolean,coalesce(p_patch->>'corrections_open',p_initial->>'corrections_open','false')::boolean)
    on conflict(assessment_id) do update set
      english_open=case when p_patch ? 'english_open' then (p_patch->>'english_open')::boolean else assessment_access.english_open end,
      math_open=case when p_patch ? 'math_open' then (p_patch->>'math_open')::boolean else assessment_access.math_open end,
      allow_completed_access=case when p_patch ? 'allow_completed_access' then (p_patch->>'allow_completed_access')::boolean else assessment_access.allow_completed_access end,
      corrections_open=case when p_patch ? 'corrections_open' then (p_patch->>'corrections_open')::boolean else assessment_access.corrections_open end,
      updated_at=now()
    returning * into saved;
  return saved;
end; $$;
revoke all on function public.set_assessment_access(text,jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.set_assessment_access(text,jsonb,jsonb) to service_role;
notify pgrst, 'reload schema';
commit;
