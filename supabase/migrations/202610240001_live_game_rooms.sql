-- Live game state is private: answer keys remain server-side. All reads and writes
-- pass through authenticated /api/game-rooms endpoints using the service role.
create table if not exists public.live_game_rooms (
  id uuid primary key,
  code text not null unique check (code ~ '^[A-Z2-9]{6}$'),
  host_id uuid not null references auth.users(id) on delete cascade,
  member_ids uuid[] not null default '{}',
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  payload jsonb not null
);
create index if not exists live_game_rooms_host_updated on public.live_game_rooms(host_id, updated_at desc);
create index if not exists live_game_rooms_members on public.live_game_rooms using gin(member_ids);
alter table public.live_game_rooms enable row level security;
revoke all on public.live_game_rooms from anon, authenticated;
grant all on public.live_game_rooms to service_role;
