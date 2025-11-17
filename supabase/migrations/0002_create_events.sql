create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  payload jsonb,
  created_at timestamptz default now()
);
