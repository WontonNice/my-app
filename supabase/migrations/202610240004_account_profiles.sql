-- Private profile, multi-tab presence and single-use email verification/recovery.
create table if not exists public.account_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  avatar_data text check (octet_length(avatar_data) <= 180000),
  email text,
  email_verified_at timestamptz,
  pending_email text,
  updated_at timestamptz not null default now(),
  check ((email is null) = (email_verified_at is null))
);
create unique index if not exists account_profiles_verified_email on public.account_profiles(lower(email)) where email is not null;
create table if not exists public.account_presence (
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null,
  last_seen_at timestamptz not null default now(),
  last_login_at timestamptz,
  primary key (user_id, client_id)
);
create index if not exists account_presence_recent on public.account_presence(last_seen_at desc);
create table if not exists public.account_email_tokens (
  token_hash text primary key check (length(token_hash) = 64),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  purpose text not null check (purpose in ('verify', 'recover')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);
create index if not exists account_email_tokens_user on public.account_email_tokens(user_id, created_at desc);
create table if not exists public.account_request_limits (
  bucket text primary key,
  window_start timestamptz not null default now(),
  requests integer not null default 1
);
alter table public.account_profiles enable row level security;
alter table public.account_presence enable row level security;
alter table public.account_email_tokens enable row level security;
alter table public.account_request_limits enable row level security;
revoke all on public.account_profiles, public.account_presence, public.account_email_tokens, public.account_request_limits from anon, authenticated;
grant all on public.account_profiles, public.account_presence, public.account_email_tokens, public.account_request_limits to service_role;

create or replace function public.claim_account_request(p_bucket text, p_limit integer, p_seconds integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare count_now integer;
begin
  insert into account_request_limits(bucket) values(p_bucket)
  on conflict(bucket) do update set
    requests = case when account_request_limits.window_start < now() - make_interval(secs => p_seconds) then 1 else account_request_limits.requests + 1 end,
    window_start = case when account_request_limits.window_start < now() - make_interval(secs => p_seconds) then now() else account_request_limits.window_start end
  returning requests into count_now;
  return count_now <= p_limit;
end $$;

create or replace function public.verify_account_email(p_hash text)
returns boolean language plpgsql security definer set search_path = public as $$
declare token account_email_tokens%rowtype;
begin
  select * into token from account_email_tokens where token_hash = p_hash and purpose = 'verify' and used_at is null and expires_at > now();
  if not found then return false; end if;
  perform 1 from account_profiles where user_id = token.user_id for update;
  select * into token from account_email_tokens where token_hash = p_hash and purpose = 'verify' and used_at is null and expires_at > now() for update;
  if not found then return false; end if;
  update account_profiles set email = token.email, email_verified_at = now(), pending_email = null, updated_at = now()
    where user_id = token.user_id and pending_email = token.email;
  if not found then return false; end if;
  update account_email_tokens set used_at = now() where user_id = token.user_id and used_at is null;
  return true;
end $$;

create or replace function public.consume_account_recovery(p_hash text)
returns uuid language plpgsql security definer set search_path = public as $$
declare token account_email_tokens%rowtype;
begin
  select * into token from account_email_tokens where token_hash = p_hash and purpose = 'recover' and used_at is null and expires_at > now();
  if not found then return null; end if;
  perform 1 from account_profiles where user_id = token.user_id for update;
  select * into token from account_email_tokens where token_hash = p_hash and purpose = 'recover' and used_at is null and expires_at > now() for update;
  if not found or not exists (select 1 from account_profiles where user_id = token.user_id and email = token.email and email_verified_at is not null) then return null; end if;
  update account_email_tokens set used_at = now() where token_hash = p_hash;
  return token.user_id;
end $$;
revoke all on function public.claim_account_request(text, integer, integer), public.verify_account_email(text), public.consume_account_recovery(text) from public, anon, authenticated;
grant execute on function public.claim_account_request(text, integer, integer), public.verify_account_email(text), public.consume_account_recovery(text) to service_role;
notify pgrst, 'reload schema';
