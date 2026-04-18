-- Optional patch (do not run if you want to keep the default strict schema).
-- Use this only when upcoming posters should be saved without date/time values.

alter table if exists public.events
  alter column date drop not null,
  alter column time drop not null;

alter table if exists public.events
  drop constraint if exists events_featured_requires_datetime;

alter table if exists public.events
  add constraint events_featured_requires_datetime
  check (
    type <> 'featured'
    or (date is not null and time is not null)
  );
