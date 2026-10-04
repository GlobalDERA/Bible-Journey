-- Phase 2 migration: track last read + recovery events
-- Run AFTER migration_phase1.sql worked.

-- Add last read time to profiles for missed-day detection
alter table profiles add column if not exists last_read_at timestamp with time zone;

-- Recovery events: which option did user pick? (for H2 metric: % return after 3+ days missed)
create table if not exists recovery_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  journey_id uuid references journeys(id) on delete cascade,
  missed_days int default 0,
  option text check (option in ('continue','spread7','quick','restart')),
  created_at timestamp with time zone default now()
);

alter table recovery_events enable row level security;
drop policy if exists "own recovery" on recovery_events;
create policy "own recovery" on recovery_events for all using (auth.uid() = user_id);
