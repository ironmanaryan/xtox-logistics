-- Leads captured by /api/lead (homepage + service forms).
-- Run once in the Supabase SQL editor.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  name text not null,
  phone text not null,
  email text,
  company text,
  service text not null,
  from_city text,
  to_city text,
  details text,
  service_details jsonb,

  -- attribution
  source text,
  medium text,
  campaign text,
  utm_term text,
  utm_content text,
  page_path text,

  -- workflow
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  notes text,

  user_id uuid
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_phone_idx on public.leads (phone);

alter table public.leads enable row level security;

-- Public forms insert through the API using the anon key. Nobody can read
-- leads without the service-role key (the admin area uses that).
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Keep updated_at fresh for status changes.
create or replace function public.touch_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
  before update on public.leads
  for each row
  execute function public.touch_leads_updated_at();
