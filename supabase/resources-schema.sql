-- XtoX Logistics — Resources CMS (articles, case studies, FAQs, blog)
-- Supabase Dashboard → SQL Editor → New query mein paste karke RUN karo.
-- Idempotent hai — kitni baar bhi chala sakte ho.
--
-- Website ke 4 resource pages DB se padhte hain (60-sec ISR),
-- admin dashboard ke Content tab se edit hote hain.

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('article', 'case-study', 'faq', 'blog')),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  tag text not null default '',
  extra text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_resources_kind on public.resources (kind, created_at desc);

alter table public.resources enable row level security;

-- Public website can READ published items only
drop policy if exists "public can view published resources" on public.resources;
create policy "public can view published resources"
  on public.resources for select to anon using (published = true);

-- Writes: service_role key only via Next.js admin APIs (no anon policy = denied)
