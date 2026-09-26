-- XtoX Logistics — Supabase schema
-- Run this in Supabase SQL Editor (or via `supabase db push`).

-- ============ QUOTE REQUESTS ============
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  service text not null,
  phone text not null,
  from_city text not null,
  to_city text not null,
  cargo_details text,
  status text not null default 'new',           -- new | contacted | quoted | won | lost
  created_at timestamptz not null default now()
);

-- ============ DRIVER APPLICATIONS ============
create table if not exists public.driver_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  city text not null,
  vehicle_type text not null,
  experience_years int not null default 0,
  rc_number text not null,
  license_number text not null,
  status text not null default 'pending',       -- pending | verified | rejected | onboarded
  created_at timestamptz not null default now()
);

-- ============ SHIPMENTS (tracking) ============
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,           -- e.g. XTX123456
  origin text not null,
  destination text not null,
  status text not null default 'in_transit',    -- booked | picked_up | in_transit | out_for_delivery | delivered
  current_location text,
  eta_date date,
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_quote_created_at on public.quote_requests (created_at desc);
create index if not exists idx_driver_created_at on public.driver_applications (created_at desc);

-- ============ ROW LEVEL SECURITY ============
alter table public.quote_requests enable row level security;
alter table public.driver_applications enable row level security;
alter table public.shipments enable row level security;

-- Public website forms can INSERT only
create policy "public can submit quote requests"
  on public.quote_requests for insert to anon with check (true);

create policy "public can submit driver applications"
  on public.driver_applications for insert to anon with check (true);

-- Anyone can LOOK UP a shipment by tracking code (public tracking page)
create policy "public can view shipments"
  on public.shipments for select to anon using (true);

-- Writes/updates to shipments & status changes: service_role key only (no anon policy = denied)
