begin;
alter table public.achievement_designs drop constraint if exists achievement_designs_id_check;
alter table public.achievement_designs add constraint achievement_designs_id_check
  check (id in ('perfect-math', 'perfect-english', 'login-week'));

alter table public.account_profiles add column if not exists login_week_earned_at timestamptz;
-- Existing seven-day streaks qualify immediately; this is their recognition time.
update public.account_profiles set login_week_earned_at = now()
  where login_best >= 7 and login_week_earned_at is null;

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
    login_week_earned_at = coalesce(account_profiles.login_week_earned_at,
      case when greatest(account_profiles.login_best, case
        when account_profiles.login_last_day = today then account_profiles.login_streak
        when account_profiles.login_last_day = today - 1 then account_profiles.login_streak + 1 else 1 end) >= 7 then now() end),
    login_last_day = today,
    login_days = array(select distinct day from unnest(account_profiles.login_days || array[today]) day where day >= today - 6 order by day)
  returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.record_account_login(uuid) from public, anon, authenticated;
grant execute on function public.record_account_login(uuid) to service_role;
notify pgrst, 'reload schema';
commit;
