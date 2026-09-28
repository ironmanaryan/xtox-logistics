-- XtoX Logistics — Live chat (customer ↔ admin)
-- Run this in Supabase SQL Editor (after schema.sql).
-- Idempotent: safe to re-run.

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

-- All chat reads/writes go through the Next.js server using the
-- SUPABASE_SERVICE_ROLE_KEY (bypasses RLS):
--   - visitors: POST/GET /api/chat (scoped by their random visitor_token)
--   - admin:    /api/admin/* (protected by ADMIN_PASSWORD)
-- So NO anon policies here on purpose — direct anon access is denied.

-- Clean up policies from older versions of this file, if any:
drop policy if exists "visitor full access to own conversation" on public.chat_conversations;
drop policy if exists "visitor manages own conversation" on public.chat_conversations;
drop policy if exists "visitor can read messages of conversation by token" on public.chat_messages;
drop policy if exists "visitor can send messages to own conversation" on public.chat_messages;
drop policy if exists "visitor can send visitor-messages to own conversation" on public.chat_messages;
