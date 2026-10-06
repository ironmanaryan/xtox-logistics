-- XtoX Logistics — cover images for Resources CMS
-- Supabase Dashboard → SQL Editor → New query mein paste karke RUN karo.
-- Idempotent hai.

alter table public.resources add column if not exists image_url text not null default '';

insert into storage.buckets (id, name, public)
values ('content-images', 'content-images', true)
on conflict (id) do nothing;

-- Public website can VIEW cover images
drop policy if exists "public can view content images" on storage.objects;
create policy "public can view content images"
  on storage.objects for select to anon using (bucket_id = 'content-images');

-- Uploads: service_role key only via Next.js admin API (no anon insert = denied)
