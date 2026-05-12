-- CovalenStudios — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Safe to re-run: uses IF NOT EXISTS / DO blocks where possible.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enum: service category
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'quote_service') then
    create type quote_service as enum ('smma', 'dev', 'uiux', 'other');
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- Table: quote_inquiries
-- ---------------------------------------------------------------------------
create table if not exists public.quote_inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  service     quote_service not null default 'other',
  budget      text,
  message     text not null,
  source      text,
  -- Lightweight workflow column for triage in the dashboard.
  status      text not null default 'new'
              check (status in ('new', 'contacted', 'won', 'lost', 'archived'))
);

-- Index for sorting by recency in the admin dashboard.
create index if not exists quote_inquiries_created_at_idx
  on public.quote_inquiries (created_at desc);

-- Index for filtering by service.
create index if not exists quote_inquiries_service_idx
  on public.quote_inquiries (service);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Inserts come from our server route using the service-role key, which
-- bypasses RLS. We lock the table down so the anon key cannot read or
-- write inquiries from the browser.
alter table public.quote_inquiries enable row level security;

-- Drop any prior policies so this script is idempotent.
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'quote_inquiries'
  loop
    execute format('drop policy %I on public.quote_inquiries', pol.policyname);
  end loop;
end$$;

-- No anon/authenticated policies are defined — only service_role can access.

-- ---------------------------------------------------------------------------
-- Optional: notify trigger placeholder (uncomment to enable pg_notify)
-- ---------------------------------------------------------------------------
-- create or replace function public.notify_new_quote()
-- returns trigger language plpgsql as $$
-- begin
--   perform pg_notify('new_quote', row_to_json(new)::text);
--   return new;
-- end$$;
--
-- drop trigger if exists trg_notify_new_quote on public.quote_inquiries;
-- create trigger trg_notify_new_quote
--   after insert on public.quote_inquiries
--   for each row execute function public.notify_new_quote();
