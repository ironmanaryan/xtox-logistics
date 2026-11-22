-- XtoX Logistics — EXIM document storage
-- Supabase Dashboard → SQL Editor → New query mein paste karke RUN karo.
-- Idempotent hai — kitni baar bhi chala sakte ho.
--
-- Uploads sirf Next.js API (/api/documents) se service-role key ke
-- through hote hain, isliye anon ke liye koi policy nahi hai
-- (chat tables wala pattern — server-side access only).
--
-- Files: PDF, Word, Excel, CSV, TXT, ODT/RTF aur images (JPG/PNG/WebP)
-- up to 20 MB. Bade files browser se signed URL ke through seedhe storage
-- mein jaate hain. Agar bucket na ho to /api/documents khud bana deta hai.

insert into storage.buckets (id, name, public)
values ('exim-documents', 'exim-documents', false)
on conflict (id) do nothing;
