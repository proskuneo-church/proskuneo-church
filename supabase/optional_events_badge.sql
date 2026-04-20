-- Optional patch: add badge label support for upcoming/featured events.
-- Safe to run multiple times.

alter table if exists public.events
  add column if not exists badge text;
