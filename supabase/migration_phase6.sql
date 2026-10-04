-- Phase 6: analytics + subscriptions (for North Star + money later)
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event text not null,
  data jsonb default '{}',
  created_at timestamp with time zone default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  tier text default 'free' check (tier in ('free','premium','church')),
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table analytics_events enable row level security;
alter table subscriptions enable row level security;

drop policy if exists "own analytics" on analytics_events;
create policy "own analytics" on analytics_events for all using (auth.uid() = user_id);

drop policy if exists "own sub" on subscriptions;
create policy "own sub" on subscriptions for all using (auth.uid() = user_id);
