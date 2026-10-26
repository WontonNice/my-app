begin;
alter table public.account_profiles
  add column if not exists theme_color text not null default 'forest' check (theme_color in ('forest', 'navy', 'plum', 'teal', 'clay', 'slate')),
  add column if not exists login_streak integer not null default 0 check (login_streak >= 0),
  add column if not exists login_best integer not null default 0 check (login_best >= 0),
  add column if not exists login_last_day date,
  add column if not exists login_days date[] not null default '{}';

-- One atomic update per New York calendar day, including simultaneous tabs/devices.
-- The browser cannot supply a date or streak count. Existing profile data is preserved.
create or replace function public.record_account_login(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  today date := (current_timestamp at time zone 'America/New_York')::date;
  saved account_profiles%rowtype;
begin
  insert into account_profiles(user_id, login_streak, login_best, login_last_day, login_days)
    values (p_user_id, 1, 1, today, array[today])
  on conflict (user_id) do update set
    login_streak = case when account_profiles.login_last_day = today then account_profiles.login_streak
      when account_profiles.login_last_day = today - 1 then account_profiles.login_streak + 1 else 1 end,
    login_best = greatest(account_profiles.login_best, case when account_profiles.login_last_day = today then account_profiles.login_streak
      when account_profiles.login_last_day = today - 1 then account_profiles.login_streak + 1 else 1 end),
    login_last_day = today,
    login_days = array(select distinct day from unnest(account_profiles.login_days || array[today]) day where day >= today - 6 order by day)
  returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.record_account_login(uuid) from public, anon, authenticated;
grant execute on function public.record_account_login(uuid) to service_role;
notify pgrst, 'reload schema';
commit;
