-- ═══════════════════════════════════════════════════════════════
-- Sahilin Nabzı — beach_posts table + RLS + realtime
-- ───────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor to go live.
--
-- This migration is DORMANT by default: the app runs on mock data
-- until you (a) install @supabase/supabase-js, (b) set
-- NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY, and
-- (c) run this SQL. No UI changes are required to switch.
-- ═══════════════════════════════════════════════════════════════

-- 1. Table -------------------------------------------------------
create table if not exists public.beach_posts (
  id          uuid primary key default gen_random_uuid(),
  username    text        not null check (char_length(username) between 3 and 20),
  text        text        not null check (char_length(text) between 5 and 220),
  beach       text        not null
                  check (beach in ('Başiskele')),
  created_at  timestamptz not null default now()
);

-- Newest-first index for the initial page load.
create index if not exists beach_posts_created_at_desc_idx
  on public.beach_posts (created_at desc);

-- 2. Row Level Security -----------------------------------------
alter table public.beach_posts enable row level security;

-- Anyone (anon + authenticated) can READ posts.
drop policy if exists "beach_posts are readable by all" on public.beach_posts;
create policy "beach_posts are readable by all"
  on public.beach_posts for select
  using (true);

-- Anyone can INSERT (no auth by design — see the implementation plan).
drop policy if exists "anyone can insert a beach_post" on public.beach_posts;
create policy "anyone can insert a beach_post"
  on public.beach_posts for insert
  with check (true);

-- No UPDATE / DELETE policies => those are blocked at the database.
-- (The realtime subscription only listens to INSERT events anyway.)

-- 3. Realtime ----------------------------------------------------
-- Publish only INSERTs for this table. UPDATE/DELETE are ignored
-- per the implementation plan.
alter publication supabase_realtime add table public.beach_posts;
