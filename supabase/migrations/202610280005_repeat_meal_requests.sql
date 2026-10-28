begin;
-- Keep ordered requests intact when a student starts the next request.
create table if not exists public.classroom_meal_order_history (
  session_id uuid not null,
  student_id uuid not null,
  revision integer not null check (revision > 0),
  data jsonb not null,
  updated_at timestamptz not null,
  primary key (session_id, student_id, revision),
  foreign key (session_id, student_id) references public.classroom_meal_orders(session_id, student_id) on delete cascade
);
alter table public.classroom_meal_order_history enable row level security;
revoke all on public.classroom_meal_order_history from anon, authenticated;
grant all on public.classroom_meal_order_history to service_role;

-- New name leaves the original function available to an older app during rollout.
create or replace function public.save_classroom_meal_request(
  p_session_id uuid, p_student_id uuid, p_menu_revision integer, p_order_revision integer,
  p_data jsonb, p_cancel boolean default false, p_new_request boolean default false
) returns jsonb language plpgsql set search_path = public as $$
declare meal public.classroom_meal_sessions; previous public.classroom_meal_orders; saved public.classroom_meal_orders;
begin
  if p_cancel is null or p_new_request is null or p_order_revision is null or p_order_revision < 0
    or p_menu_revision is null or p_menu_revision < 1 or (p_cancel and p_new_request) then
    raise exception 'Reload the menu before submitting.' using errcode='P0001';
  end if;
  select * into meal from public.classroom_meal_sessions where id=p_session_id for update;
  if not found or not meal.open or meal.revision<>p_menu_revision then
    raise exception 'Menu changed or ordering closed. Reload before submitting.' using errcode='P0001';
  end if;
  select * into previous from public.classroom_meal_orders where session_id=p_session_id and student_id=p_student_id for update;
  if coalesce(previous.revision,0)<>p_order_revision then
    raise exception 'Your request changed. Refresh before submitting.' using errcode='P0001';
  end if;
  if previous.data->>'teacherDecision'='denied' then
    raise exception 'Your teacher denied this request. Ask your teacher to restore it.' using errcode='P0001';
  end if;
  if p_new_request and previous.status is distinct from 'ordered' then
    raise exception 'This request changed. Refresh before starting another request.' using errcode='P0001';
  end if;
  if previous.status='ordered' and not p_new_request then
    raise exception 'Start another request to order again. Your ordered meal cannot be edited.' using errcode='P0001';
  end if;
  if p_cancel and (previous.student_id is null or previous.status<>'submitted') then
    raise exception 'There is no pending request to cancel.' using errcode='P0001';
  end if;
  if not p_cancel and (jsonb_typeof(p_data) is distinct from 'object' or jsonb_typeof(p_data->'quote') is distinct from 'object') then
    raise exception 'A valid meal request is required.' using errcode='P0001';
  end if;
  if not p_cancel and (previous.status='ordered' or
    (previous.status='cancelled' and previous.data->>'teacherDecision'='removed' and previous.data->>'previousStatus'='ordered')) then
    insert into public.classroom_meal_order_history(session_id,student_id,revision,data,updated_at)
      values(previous.session_id,previous.student_id,previous.revision,previous.data,previous.updated_at);
  end if;
  insert into public.classroom_meal_orders(session_id,student_id,data,status,revision)
    values(p_session_id,p_student_id,case when p_cancel then previous.data else p_data end,
      case when p_cancel then 'cancelled' else 'submitted' end,coalesce(previous.revision,0)+1)
    on conflict(session_id,student_id) do update set data=excluded.data,status=excluded.status,revision=excluded.revision,updated_at=now()
    returning * into saved;
  return jsonb_build_object('order',to_jsonb(saved),'orderedHistory',coalesce((
    select jsonb_agg(to_jsonb(h) order by h.revision) from public.classroom_meal_order_history h
    where h.session_id=p_session_id and h.student_id=p_student_id
  ),'[]'::jsonb));
end; $$;
revoke all on function public.save_classroom_meal_request(uuid,uuid,integer,integer,jsonb,boolean,boolean) from public, anon, authenticated;
grant execute on function public.save_classroom_meal_request(uuid,uuid,integer,integer,jsonb,boolean,boolean) to service_role;
notify pgrst, 'reload schema';
commit;
