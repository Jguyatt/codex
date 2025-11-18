create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),
  license_key text unique not null,
  machine_hash text,
  plan text default 'lifetime',
  purchased_at timestamptz default now(),
  expires_at timestamptz
);
