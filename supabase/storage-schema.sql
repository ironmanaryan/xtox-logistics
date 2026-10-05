-- XtoX Logistics — EXIM document storage
-- Supabase Dashboard → SQL Editor → New query mein paste karke RUN karo.
-- Idempotent hai — kitni baar bhi chala sakte ho.
--
-- Uploads sirf Next.js API (/api/documents) se service-role key ke
-- through hote hain, isliye anon ke liye koi policy nahi hai
-- (chat tables wala pattern — server-side access only).

insert into storage.buckets (id, name, public)
values ('exim-documents', 'exim-documents', false)
on conflict (id) do nothing;
