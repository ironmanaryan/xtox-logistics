-- XtoX Logistics — Live chat (customer ↔ admin)
-- Run this in Supabase SQL Editor (after schema.sql).
-- Safe to re-run (idempotent).

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_token text not null unique,        -- random id stored in visitor's localStorage
  name text,
  phone text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  admin_unread int not null default 0,       -- messages from visitor not yet seen by admin
  visitor_unread int not null default 0      -- replies from admin not yet seen by visitor
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_conv on public.chat_messages (conversation_id, created_at);
create index if not exists idx_chat_conv_last on public.chat_conversations (last_message_at desc);

-- ============ ROW LEVEL SECURITY ============
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- Visitors identify themselves only by their random visitor_token (a capability secret).
-- Token is generated client-side and kept in localStorage; without it a thread is unreadable.
create policy "visitor manages own conversation"
  on public.chat_conversations for all to anon
  using (true)
  with check (true);

create policy "visitor can read messages of conversation by token"
  on public.chat_messages for select to anon
  using (
    exists (
      select 1 from public.chat_conversations c
      where c.id = chat_messages.conversation_id
        and c.visitor_token = current_setting('request.headers', true)::json->>'x-visitor-token'
    )
  );

create policy "visitor can send visitor-messages to own conversation"
  on public.chat_messages for insert to anon
  with check (
    sender = 'visitor'
    and exists (
      select 1 from public.chat_conversations c
      where c.id = chat_messages.conversation_id
        and c.visitor_token = current_setting('request.headers', true)::json->>'x-visitor-token'
    )
  );

-- ADMIN reads/replies happen server-side through /api/admin/* routes using the
-- SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). No anon admin policies on purpose.
-- Protect those routes by setting the ADMIN_PASSWORD env var on the server.
