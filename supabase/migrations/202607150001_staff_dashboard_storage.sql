create table if not exists public.staff_dashboard_data (
  staff_user_id uuid primary key references auth.users(id) on delete cascade,
  dashboard_data jsonb not null default '{"attendance":[],"roster":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_attendance_records (
  staff_user_id uuid not null references auth.users(id) on delete cascade,
  attendance_date date not null,
  statuses jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (staff_user_id, attendance_date)
);

alter table public.staff_dashboard_data enable row level security;
alter table public.staff_attendance_records enable row level security;

grant select, insert, update, delete on public.staff_dashboard_data to service_role;
grant select, insert, update, delete on public.staff_attendance_records to service_role;

create index if not exists staff_attendance_records_user_date_idx
  on public.staff_attendance_records(staff_user_id, attendance_date);

-- Copy the current Auth metadata into database-backed storage. Keep the Auth
-- copy during rollout so the previous application version can still operate.
insert into public.staff_dashboard_data (staff_user_id, dashboard_data, updated_at)
select
  id,
  (coalesce(raw_user_meta_data->'dashboard_data', '{"attendance":[],"roster":[]}'::jsonb) - 'attendanceRecords'),
  now()
from auth.users
where coalesce(raw_app_meta_data->>'role', raw_user_meta_data->>'role') = 'staff'
on conflict (staff_user_id) do nothing;

insert into public.staff_attendance_records (staff_user_id, attendance_date, statuses, updated_at)
select
  users.id,
  attendance.key::date,
  attendance.value,
  now()
from auth.users as users
cross join lateral jsonb_each(
  case
    when jsonb_typeof(users.raw_user_meta_data->'dashboard_data'->'attendanceRecords') = 'object'
      then users.raw_user_meta_data->'dashboard_data'->'attendanceRecords'
    else '{}'::jsonb
  end
) as attendance(key, value)
where coalesce(users.raw_app_meta_data->>'role', users.raw_user_meta_data->>'role') = 'staff'
  and attendance.key ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  and jsonb_typeof(attendance.value) = 'object'
on conflict (staff_user_id, attendance_date) do nothing;

-- Auth metadata is embedded in access-token JWTs. Exclude the operational
-- dashboard payload while retaining the small identity fields the client uses.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  claims jsonb;
  metadata jsonb;
begin
  claims := event->'claims';
  metadata := coalesce(claims->'user_metadata', '{}'::jsonb) - 'dashboard_data';
  claims := jsonb_set(claims, '{user_metadata}', metadata, true);
  return jsonb_build_object('claims', claims);
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

notify pgrst, 'reload schema';
