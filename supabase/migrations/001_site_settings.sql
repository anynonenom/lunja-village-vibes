-- Lunja Village landing-page cover image settings.
--
-- Run once in Supabase → SQL Editor (or via the Supabase CLI).
-- Safe to re-run: uses `if not exists` and drops/recreates only the
-- public-read policy for this table.
--
-- What it does:
--   1. Creates `public.site_settings(key, url, path, updated_at)`.
--   2. Enables Row Level Security.
--   3. Grants public SELECT so the landing page can render the cover
--      without authentication. Writes stay service-role-only
--      (no insert/update/delete policies for anon/authenticated),
--      so only the server (`src/lib/landing-cover.ts` + `supabase-admin.ts`)
--      can change the active image after `requireDriveSession()`.
-- Verification:
--   select * from public.site_settings where key = 'restaurant_cover';

create table if not exists public.site_settings (
  key text primary key,
  url text not null,
  path text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;

create policy "site_settings public read"
  on public.site_settings
  for select
  using (true);
