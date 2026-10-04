-- Phase 3: Knowledge Graph start
-- Tables for People, Places, Themes, Links. Run after phase2.

create table if not exists people (
  id text primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists places (
  id text primary key,
  name text not null,
  description text
);

create table if not exists themes (
  id text primary key,
  name text not null,
  description text
);

create table if not exists passage_links (
  id uuid primary key default gen_random_uuid(),
  from_ref text not null,
  to_ref text not null,
  link_type text default 'connection',
  unique(from_ref, to_ref)
);

-- Seed Phase 3 samples
insert into people (id, name, description) values
  ('abraham','Abraham','Father of faith. Covenant, promise.'),
  ('moses','Moses','Freed Israel, gave law.'),
  ('david','David','Shepherd to king.'),
  ('jesus','Jesus','Word made flesh.'),
  ('paul','Paul','Apostle to nations.')
on conflict (id) do nothing;

insert into themes (id, name, description) values
  ('faith','Faith','Trust God.'),
  ('covenant','Covenant','I will be your God.'),
  ('love','Love','God love, love neighbor.'),
  ('prayer','Prayer','Talk with God.')
on conflict (id) do nothing;

insert into passage_links (from_ref, to_ref) values
  ('Genesis 1','John 1'),
  ('Genesis 12','Romans 4'),
  ('Exodus 20','Deuteronomy 5'),
  ('John 1','Genesis 1'),
  ('Romans 8','Genesis 1')
on conflict (from_ref, to_ref) do nothing;

-- Public read for study content
alter table people enable row level security;
alter table places enable row level security;
alter table themes enable row level security;
alter table passage_links enable row level security;

drop policy if exists "public study read" on people;
create policy "public study read" on people for select using (true);
drop policy if exists "public study read" on places;
create policy "public study read" on places for select using (true);
drop policy if exists "public study read" on themes;
create policy "public study read" on themes for select using (true);
drop policy if exists "public study read" on passage_links;
create policy "public study read" on passage_links for select using (true);
