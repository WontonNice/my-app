-- Run after the migration. Every test mutation rolls back, including profile inserts.
begin;
do $$
declare
  test_user uuid;
  result jsonb;
  today date := (current_timestamp at time zone 'America/New_York')::date;
begin
  select id into test_user from auth.users order by created_at limit 1;
  if test_user is null then raise exception 'A fixture auth user is required'; end if;
  insert into public.account_profiles(user_id) values(test_user) on conflict do nothing;
  update public.account_profiles set login_streak=0, login_best=0, login_last_day=null, login_days='{}' where user_id=test_user;
  result := public.record_account_login(test_user);
  if (result->>'login_streak')::int <> 1 then raise exception 'First visit failed'; end if;
  result := public.record_account_login(test_user);
  if (result->>'login_streak')::int <> 1 or jsonb_array_length(result->'login_days') <> 1 then raise exception 'Same-day deduplication failed'; end if;
  update public.account_profiles set login_streak=3, login_best=3, login_last_day=today-1, login_days=array[today-3,today-2,today-1] where user_id=test_user;
  result := public.record_account_login(test_user);
  if (result->>'login_streak')::int <> 4 or (result->>'login_best')::int <> 4 then raise exception 'Consecutive day failed'; end if;
  update public.account_profiles set login_last_day=today-2 where user_id=test_user;
  result := public.record_account_login(test_user);
  if (result->>'login_streak')::int <> 1 or (result->>'login_best')::int <> 4 then raise exception 'Gap reset/best preservation failed'; end if;
  if has_function_privilege('anon','public.record_account_login(uuid)','EXECUTE') or has_function_privilege('authenticated','public.record_account_login(uuid)','EXECUTE') then raise exception 'Browser role can modify streak'; end if;
  if not has_function_privilege('service_role','public.record_account_login(uuid)','EXECUTE') then raise exception 'API cannot record streak'; end if;
end $$;
rollback;
select 'Account streak database checks passed; all fixture changes rolled back.' as result;
