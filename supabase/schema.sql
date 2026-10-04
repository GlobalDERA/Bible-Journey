-- Bible Journey Phase 0 Database
-- Beginner explanation:
-- Tables = Excel sheets. Each row = one thing.
-- Run this in Supabase SQL Editor.

-- 1. Profiles: one row per user, extends Supabase auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  preferred_time text default 'morning' check (preferred_time in ('morning','afternoon','evening','custom')),
  created_at timestamp with time zone default now()
);

-- 2. Translations: which Bibles we can show
create table if not exists translations (
  id text primary key,
  name text not null,
  language text default 'en',
  license text default 'public-domain',
  is_active boolean default true
);

insert into translations (id, name, license) values
  ('kjv','King James Version','public-domain'),
  ('web','World English Bible','public-domain'),
  ('esv','English Standard Version','api-bible-needs-key')
on conflict (id) do nothing;

-- 3. Journeys: a user's plan (e.g. 365-day whole Bible)
create table if not exists journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text default 'My Bible Journey',
  mode text default 'whole' check (mode in ('whole','chronological','canonical','nt','ot','thematic','custom')),
  total_days int default 365,
  start_date date default current_date,
  created_at timestamp with time zone default now()
);

-- 4. Journey days: Day 1 = Genesis 1-3, Day 2 = Genesis 4-7, etc.
create table if not exists journey_days (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid references journeys(id) on delete cascade,
  day_number int not null,
  title text not null,
  estimated_minutes int default 15,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  unique(journey_id, day_number)
);

-- 5. Personal memory: highlights, bookmarks, notes (Phase 4 will expand)
create table if not exists user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  passage_ref text not null,
  content text,
  tags text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Turn on Row Level Security (simple: users only see their own data)
alter table profiles enable row level security;
alter table journeys enable row level security;
alter table journey_days enable row level security;
alter table user_notes enable row level security;

-- Policies: beginner-safe - you can only read/write your own rows
drop policy if exists "own profile" on profiles;
create policy "own profile" on profiles for all using (auth.uid() = id);

drop policy if exists "own journeys" on journeys;
create policy "own journeys" on journeys for all using (auth.uid() = user_id);

drop policy if exists "own journey days" on journey_days;
create policy "own journey days" on journey_days for all using (
  exists (select 1 from journeys j where j.id = journey_days.journey_id and j.user_id = auth.uid())
);

drop policy if exists "own notes" on user_notes;
create policy "own notes" on user_notes for all using (auth.uid() = user_id);

-- Everyone can read translations list
alter table translations enable row level security;
drop policy if exists "public translations" on translations;
create policy "public translations" on translations for select using (true);
