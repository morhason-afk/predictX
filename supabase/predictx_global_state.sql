-- One-row JSON document shared by all clients (forecasts, predictions, economy, leaderboard sections).
-- Run in Supabase SQL editor after creating a project.

create table if not exists predictx_global_state (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into predictx_global_state (id, payload)
values ('main', '{"schemaVersion":1,"forecasts":[],"predictions":[],"backofficeConfig":{},"leaderboardSections":[]}'::jsonb)
on conflict (id) do nothing;

alter table predictx_global_state enable row level security;

-- Demo / MVP: world-readable and world-writable with the anon key.
-- Tighten before real production (auth, service role, or Edge Functions).
create policy "predictx_global_select" on predictx_global_state for select using (true);
create policy "predictx_global_insert" on predictx_global_state for insert with check (true);
create policy "predictx_global_update" on predictx_global_state for update using (true);

-- Dashboard → Database → Replication: enable replication for predictx_global_state (Realtime).
