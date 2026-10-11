-- XtoX Logistics — Customer dashboard + Driver app tables
-- Supabase Dashboard → SQL Editor → New query mein paste karke RUN karo.
-- Idempotent hai. (ALL-IN-ONE.sql mein bhi included hai.)

create table if not exists public.profiles (
  id uuid primary key,
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

alter table public.quote_requests add column if not exists user_id uuid;

create table if not exists public.loads (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  goods text not null default 'General goods',
  weight_kg numeric not null default 1000,
  fare int not null default 0,
  status text not null default 'open',
  driver_phone text not null default '',
  pod_path text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_loads_status on public.loads (status, created_at desc);

alter table public.profiles enable row level security;
alter table public.loads enable row level security;

drop policy if exists "public can view open loads" on public.loads;
create policy "public can view open loads"
  on public.loads for select to anon using (status = 'open');
