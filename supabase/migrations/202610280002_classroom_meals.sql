begin;
create table if not exists public.classroom_meal_sessions (
  id uuid primary key,
  title text not null,
  class_id text not null default 'shsat',
  menu jsonb not null,
  open boolean not null default false,
  revision integer not null default 1,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.classroom_meal_orders (
  session_id uuid not null references public.classroom_meal_sessions(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  status text not null check (status in ('submitted','ordered','cancelled')),
  revision integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key(session_id,student_id)
);
create index if not exists classroom_meals_recent on public.classroom_meal_sessions(class_id,created_at desc);
alter table public.classroom_meal_sessions enable row level security;
alter table public.classroom_meal_orders enable row level security;
revoke all on public.classroom_meal_sessions, public.classroom_meal_orders from anon, authenticated;
grant all on public.classroom_meal_sessions, public.classroom_meal_orders to service_role;
-- Serialize submission against menu closure/price changes and against duplicate requests.
create or replace function public.save_classroom_meal_order(p_session_id uuid, p_student_id uuid, p_menu_revision integer, p_order_revision integer, p_data jsonb, p_cancel boolean default false)
returns public.classroom_meal_orders language plpgsql set search_path = public as $$
declare meal public.classroom_meal_sessions; previous public.classroom_meal_orders; saved public.classroom_meal_orders;
begin
  select * into meal from public.classroom_meal_sessions where id=p_session_id for update;
  if not found or not meal.open or meal.revision<>p_menu_revision then raise exception 'Menu changed or ordering closed. Reload before submitting.' using errcode='P0001'; end if;
  select * into previous from public.classroom_meal_orders where session_id=p_session_id and student_id=p_student_id for update;
  if previous.status='ordered' then raise exception 'Your teacher already placed this order.' using errcode='P0001'; end if;
  if coalesce(previous.revision,0)<>p_order_revision then raise exception 'Your order changed. Reload to see the saved order.' using errcode='P0001'; end if;
  if p_cancel and previous.student_id is null then raise exception 'No order to cancel.' using errcode='P0001'; end if;
  insert into public.classroom_meal_orders(session_id,student_id,data,status,revision)
    values(p_session_id,p_student_id,case when p_cancel then previous.data else p_data end,case when p_cancel then 'cancelled' else 'submitted' end,coalesce(previous.revision,0)+1)
    on conflict(session_id,student_id) do update set data=excluded.data,status=excluded.status,revision=excluded.revision,updated_at=now() returning * into saved;
  return saved;
end; $$;
revoke all on function public.save_classroom_meal_order(uuid,uuid,integer,integer,jsonb,boolean) from public, anon, authenticated;
grant execute on function public.save_classroom_meal_order(uuid,uuid,integer,integer,jsonb,boolean) to service_role;
notify pgrst, 'reload schema';
commit;
