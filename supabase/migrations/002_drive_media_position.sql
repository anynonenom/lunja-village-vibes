-- Lunja Drive custom media order per folder.
--
-- Run once in Supabase → SQL Editor (or via the Supabase CLI).
-- Safe to re-run: uses `if not exists` guards.
--
-- What it does:
--   1. Adds `public.drive_media.position` (1-based order within a folder).
--   2. Backfills existing rows so each folder keeps its current
--      newest-first display order as positions 1..n.
--   3. Adds a composite index for the ordered listing query.
-- Verification:
--   select folder, path, position from public.drive_media
--   order by folder, position limit 20;

alter table public.drive_media
  add column if not exists position bigint not null default 0;

with ranked as (
  select ctid as row_id,
         row_number() over (partition by folder order by created_at desc) as rn
  from public.drive_media
)
update public.drive_media m
set position = r.rn
from ranked r
where m.ctid = r.row_id
  and (m.position is null or m.position = 0);

create index if not exists drive_media_folder_position_idx
  on public.drive_media (folder, position);
