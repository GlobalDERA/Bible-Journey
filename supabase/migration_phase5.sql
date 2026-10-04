-- Phase 5: log AI questions for trust review (which answers help? which confuse?)
create table if not exists ai_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  passage_ref text,
  question text,
  created_at timestamp with time zone default now()
);

alter table ai_queries enable row level security;
drop policy if exists "own ai" on ai_queries;
create policy "own ai" on ai_queries for all using (auth.uid() = user_id);
