-- ============================================================
-- XtoX Logistics — ALL-IN-ONE Supabase setup
-- Isko Supabase Dashboard → SQL Editor → New query mein paste karke
-- RUN karo. Idempotent hai — kitni baar bhi chala sakte ho.
-- ============================================================

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
  status text not null default 'new',
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
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============ SHIPMENTS (tracking) ============
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  origin text not null,
  destination text not null,
  status text not null default 'in_transit',
  current_location text,
  eta_date date,
  updated_at timestamptz not null default now()
);

-- ============ CHAT ============
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_token text not null unique,
  name text,
  phone text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  admin_unread int not null default 0,
  visitor_unread int not null default 0
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_quote_created_at on public.quote_requests (created_at desc);
create index if not exists idx_driver_created_at on public.driver_applications (created_at desc);
create index if not exists idx_chat_messages_conv on public.chat_messages (conversation_id, created_at);
create index if not exists idx_chat_conv_last on public.chat_conversations (last_message_at desc);

-- ============ ROW LEVEL SECURITY ============
alter table public.quote_requests enable row level security;
alter table public.driver_applications enable row level security;
alter table public.shipments enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- Public website forms INSERT only (anon)
drop policy if exists "public can submit quote requests" on public.quote_requests;
create policy "public can submit quote requests"
  on public.quote_requests for insert to anon with check (true);

drop policy if exists "public can submit driver applications" on public.driver_applications;
create policy "public can submit driver applications"
  on public.driver_applications for insert to anon with check (true);

-- Public tracking lookup (anon read-only)
drop policy if exists "public can view shipments" on public.shipments;
create policy "public can view shipments"
  on public.shipments for select to anon using (true);

-- Chat: NO anon policies (all access via service-role through Next.js server)
drop policy if exists "visitor full access to own conversation" on public.chat_conversations;
drop policy if exists "visitor manages own conversation" on public.chat_conversations;
drop policy if exists "visitor can read messages of conversation by token" on public.chat_messages;
drop policy if exists "visitor can send messages to own conversation" on public.chat_messages;
drop policy if exists "visitor can send visitor-messages to own conversation" on public.chat_messages;

-- ============ EXIM DOCUMENT STORAGE ============
-- Uploads only via Next.js /api/documents with the service-role key
-- (no anon policies — same pattern as chat tables).
insert into storage.buckets (id, name, public)
values ('exim-documents', 'exim-documents', false)
on conflict (id) do nothing;

-- ============ RESOURCES CMS ============
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('article', 'case-study', 'faq', 'blog')),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  tag text not null default '',
  extra text not null default '',
  image_url text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.resources add column if not exists image_url text not null default '';

create index if not exists idx_resources_kind on public.resources (kind, created_at desc);

alter table public.resources enable row level security;

drop policy if exists "public can view published resources" on public.resources;
create policy "public can view published resources"
  on public.resources for select to anon using (published = true);

-- ============ CONTENT COVER IMAGES (public bucket) ============
insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

drop policy if exists "public can view content images" on storage.objects;
create policy "public can view content images"
  on storage.objects for select to anon using (bucket_id = 'content-images');

-- ============ DEMO SHIPMENTS (seed) ============
insert into public.shipments (tracking_code, origin, destination, status, current_location, eta_date)
values
  ('XTX123456', 'Surat, GJ', 'Mumbai JNPT Port', 'in_transit', 'Vapi checkpoint', current_date + 2),
  ('XTX789012', 'Nashik, MH', 'Dubai (Jebel Ali)', 'out_for_delivery', 'Jebel Ali customs', current_date + 1),
  ('XTX345678', 'Nashik, MH', 'Rotterdam, NL', 'delivered', 'Rotterdam DC', current_date - 3)
on conflict (tracking_code) do nothing;
