-- Private boards belong to existing student accounts. All browser access is via
-- the existing authenticated Express API; no anonymous links or second roster.
create table if not exists public.student_boards (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  title text not null check (length(title) between 1 and 200),
  state text not null,
  epoch uuid not null default gen_random_uuid(),
  revision bigint not null default 1,
  archived_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid not null references auth.users(id),
  checkpoint_at timestamptz not null default now()
);
create table if not exists public.board_participants (
  board_id uuid not null references public.student_boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('editor','viewer')),
  primary key (board_id,user_id)
);
create table if not exists public.board_revisions (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.student_boards(id) on delete cascade,
  epoch uuid not null,
  state text not null,
  title text not null,
  label text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.board_assets (
  id uuid primary key,
  board_id uuid not null references public.student_boards(id) on delete cascade,
  object_path text not null unique,
  name text not null,
  mime text not null,
  bytes integer not null check (bytes > 0 and bytes <= 10485760),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index if not exists student_boards_student_updated on public.student_boards(student_id,updated_at desc);
create index if not exists board_participants_user on public.board_participants(user_id,board_id);
create index if not exists board_revisions_board_created on public.board_revisions(board_id,created_at desc);
alter table public.student_boards enable row level security;
alter table public.board_participants enable row level security;
alter table public.board_revisions enable row level security;
alter table public.board_assets enable row level security;
revoke all on public.student_boards, public.board_participants, public.board_revisions, public.board_assets from anon, authenticated;
grant all on public.student_boards, public.board_participants, public.board_revisions, public.board_assets to service_role;

-- CAS + membership checks occur in one transaction. The server validates the
-- candidate CRDT against this exact revision before calling this function.
create or replace function public.commit_student_board(p_id uuid,p_actor uuid,p_revision bigint,p_epoch uuid,p_state text,p_checkpoint boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare b public.student_boards; r text;
begin
  select * into b from public.student_boards where id=p_id for update;
  if not found or b.deleted_at is not null then raise exception 'Board not found'; end if;
  if b.owner_id=p_actor then r := 'owner'; else select role into r from public.board_participants where board_id=p_id and user_id=p_actor for share; end if;
  if r is null or r='viewer' or b.archived_at is not null then raise exception 'Board is not editable'; end if;
  if b.revision<>p_revision or b.epoch<>p_epoch then return null; end if;
  if p_state=b.state then return to_jsonb(b); end if;
  if p_checkpoint or b.checkpoint_at < now()-interval '5 minutes' then
    insert into public.board_revisions(board_id,epoch,state,title,label,created_by) values(b.id,b.epoch,b.state,b.title,'Automatic checkpoint',b.updated_by);
  end if;
  update public.student_boards set state=p_state, revision=revision+1, updated_by=p_actor, updated_at=now(),
    checkpoint_at=case when p_checkpoint or b.checkpoint_at<now()-interval '5 minutes' then now() else b.checkpoint_at end
    where id=p_id returning * into b;
  return to_jsonb(b);
end $$;
create or replace function public.create_student_board(p_id uuid,p_student uuid,p_owner uuid,p_title text,p_state text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.student_boards(id,student_id,owner_id,title,state,updated_by) values(p_id,p_student,p_owner,p_title,p_state,p_owner);
  if p_student<>p_owner then insert into public.board_participants values(p_id,p_student,'editor'); end if;
  insert into public.board_revisions(board_id,epoch,state,title,label,created_by)
    select id,epoch,state,title,'Board created',p_owner from public.student_boards where id=p_id;
end $$;
create or replace function public.manage_student_board(p_id uuid,p_actor uuid,p_revision bigint,p_action text,p_value jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare b public.student_boards; s public.board_revisions;
begin
  select * into b from public.student_boards where id=p_id for update;
  if not found or b.deleted_at is not null then raise exception 'Board not found'; end if;
  if b.owner_id<>p_actor then raise exception 'Owner access required'; end if;
  if b.revision<>p_revision then return null; end if;
  if p_action='rename' then
    update public.student_boards set title=p_value->>'title' where id=p_id;
  elsif p_action='archive' then
    update public.student_boards set archived_at=case when (p_value->>'archived')::boolean then now() else null end where id=p_id;
  elsif p_action='delete' then
    update public.student_boards set deleted_at=now() where id=p_id;
  elsif p_action='participant' then
    if (p_value->>'id')::uuid=b.owner_id then raise exception 'Owner cannot be changed'; end if;
    if p_value->>'role'='remove' then
      if (p_value->>'id')::uuid=b.student_id then raise exception 'Keep the student on their board'; end if;
      delete from public.board_participants where board_id=p_id and user_id=(p_value->>'id')::uuid;
    else
      insert into public.board_participants values(p_id,(p_value->>'id')::uuid,p_value->>'role') on conflict(board_id,user_id) do update set role=excluded.role;
    end if;
  elsif p_action='checkpoint' then
    insert into public.board_revisions(board_id,epoch,state,title,label,created_by) values(b.id,b.epoch,b.state,b.title,'Named checkpoint',p_actor);
  elsif p_action='restore' then
    select * into s from public.board_revisions where board_id=p_id and id=(p_value->>'id')::uuid;
    if not found then raise exception 'Version not found'; end if;
    insert into public.board_revisions(board_id,epoch,state,title,label,created_by) values(b.id,b.epoch,b.state,b.title,'Before restore',p_actor);
    -- New Y.Doc is supplied by the server; the new epoch rejects stale offline edits.
    update public.student_boards set state=p_value->>'state',epoch=gen_random_uuid(),title=s.title,checkpoint_at=now() where id=p_id;
  else raise exception 'Unknown board action'; end if;
  update public.student_boards set revision=revision+1,updated_at=now(),updated_by=p_actor where id=p_id returning * into b;
  return to_jsonb(b);
end $$;
revoke all on function public.commit_student_board(uuid,uuid,bigint,uuid,text,boolean), public.create_student_board(uuid,uuid,uuid,text,text), public.manage_student_board(uuid,uuid,bigint,text,jsonb) from public,anon,authenticated;
grant execute on function public.commit_student_board(uuid,uuid,bigint,uuid,text,boolean), public.create_student_board(uuid,uuid,uuid,text,text), public.manage_student_board(uuid,uuid,bigint,text,jsonb) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('student-board-assets','student-board-assets',false,10485760,array['image/png','image/jpeg','image/gif','image/webp','application/pdf','text/plain','application/octet-stream']) on conflict(id) do nothing;
-- Service-to-service fanout only. Even installations with broad existing
-- authenticated Realtime policies cannot join these internal private topics.
create policy "board internal receive only by service role" on realtime.messages as restrictive for select to anon,authenticated using (realtime.topic() not like 'board-internal:%');
create policy "board internal publish only by service role" on realtime.messages as restrictive for insert to anon,authenticated with check (realtime.topic() not like 'board-internal:%');
notify pgrst, 'reload schema';
