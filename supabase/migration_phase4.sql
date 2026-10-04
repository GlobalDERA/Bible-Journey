-- Phase 4: highlights + bookmarks tables (notes already exist from Phase 0)
-- Run after migration_phase3.sql

create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  passage_ref text not null,
  verse int default 1,
  text text,
  color text default '#FFF176',
  created_at timestamp with time zone default now()
);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  passage_ref text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, passage_ref)
);

alter table highlights enable row level security;
alter table bookmarks enable row level security;

drop policy if exists "own highlights" on highlights;
create policy "own highlights" on highlights for all using (auth.uid() = user_id);

drop policy if exists "own bookmarks" on bookmarks;
create policy "own bookmarks" on bookmarks for all using (auth.uid() = user_id);
