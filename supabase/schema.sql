-- Proskuneo Church Supabase Schema (Idempotent)
-- Safe to re-run on existing projects.

create extension if not exists pgcrypto;

-- Enum types (safe re-run)
do $$
begin
  create type public.user_role as enum ('super_admin', 'admin', 'editor');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.devotional_type as enum ('monthly', 'daily');
exception
  when duplicate_object then null;
end
$$;

-- Core tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role public.user_role not null default 'editor',
  created_at timestamptz not null default now()
);

create table if not exists public.devotionals (
  id uuid primary key default gen_random_uuid(),
  type public.devotional_type not null,
  title text not null,
  slug text unique,
  author text,
  verse text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time time not null,
  location text,
  speaker text,
  image_url text,
  type text not null default 'upcoming',
  badge text,
  created_at timestamptz not null default now()
);

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text not null,
  date date not null,
  audio_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_url text not null,
  type text not null,
  created_at timestamptz not null default now()
);

-- Migration helpers for existing events table variants
alter table public.events add column if not exists type text;
alter table public.events add column if not exists speaker text;
alter table public.events add column if not exists badge text;

-- Backfill events.type from legacy columns when they exist
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'events'
      and column_name = 'kind'
  ) then
    execute $sql$
      update public.events
      set type = 'featured'
      where coalesce(type, '') = ''
        and kind = 'featured'
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'events'
      and column_name = 'is_featured'
  ) then
    execute $sql$
      update public.events
      set type = 'featured'
      where coalesce(type, '') = ''
        and is_featured = true
    $sql$;
  end if;
end
$$;

update public.events
set type = 'upcoming'
where coalesce(type, '') = '';

alter table public.events alter column type set default 'upcoming';
alter table public.events alter column type set not null;
alter table public.events drop constraint if exists events_type_check;
alter table public.events
  add constraint events_type_check check (type in ('featured', 'upcoming'));

-- Auth helper functions
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'editor')
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.devotionals enable row level security;
alter table public.events enable row level security;
alter table public.sermons enable row level security;
alter table public.media enable row level security;

-- Policies (drop/create so script is re-runnable)
-- profiles

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "super admin read all profiles" on public.profiles;
create policy "super admin read all profiles"
on public.profiles
for select
using (public.current_user_role() = 'super_admin');

drop policy if exists "super admin update profiles" on public.profiles;
create policy "super admin update profiles"
on public.profiles
for update
using (public.current_user_role() = 'super_admin')
with check (public.current_user_role() = 'super_admin');

drop policy if exists "super admin insert profiles" on public.profiles;
create policy "super admin insert profiles"
on public.profiles
for insert
with check (public.current_user_role() = 'super_admin');

-- Public read

drop policy if exists "public read devotionals" on public.devotionals;
create policy "public read devotionals"
on public.devotionals
for select
using (true);

drop policy if exists "public read events" on public.events;
create policy "public read events"
on public.events
for select
using (true);

drop policy if exists "public read sermons" on public.sermons;
create policy "public read sermons"
on public.sermons
for select
using (true);

drop policy if exists "public read media" on public.media;
create policy "public read media"
on public.media
for select
using (true);

-- Editor/Admin write

drop policy if exists "editor admin insert devotionals" on public.devotionals;
create policy "editor admin insert devotionals"
on public.devotionals
for insert
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin update devotionals" on public.devotionals;
create policy "editor admin update devotionals"
on public.devotionals
for update
using (public.current_user_role() in ('super_admin', 'admin', 'editor'))
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin insert events" on public.events;
create policy "editor admin insert events"
on public.events
for insert
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin update events" on public.events;
create policy "editor admin update events"
on public.events
for update
using (public.current_user_role() in ('super_admin', 'admin', 'editor'))
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin insert sermons" on public.sermons;
create policy "editor admin insert sermons"
on public.sermons
for insert
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin update sermons" on public.sermons;
create policy "editor admin update sermons"
on public.sermons
for update
using (public.current_user_role() in ('super_admin', 'admin', 'editor'))
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin insert media" on public.media;
create policy "editor admin insert media"
on public.media
for insert
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "editor admin update media" on public.media;
create policy "editor admin update media"
on public.media
for update
using (public.current_user_role() in ('super_admin', 'admin', 'editor'))
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

-- Delete restrictions

drop policy if exists "admin delete devotionals" on public.devotionals;
create policy "admin delete devotionals"
on public.devotionals
for delete
using (public.current_user_role() in ('super_admin', 'admin'));

drop policy if exists "admin delete events" on public.events;
create policy "admin delete events"
on public.events
for delete
using (public.current_user_role() in ('super_admin', 'admin'));

drop policy if exists "admin delete sermons" on public.sermons;
create policy "admin delete sermons"
on public.sermons
for delete
using (public.current_user_role() in ('super_admin', 'admin'));

drop policy if exists "admin delete media" on public.media;
create policy "admin delete media"
on public.media
for delete
using (public.current_user_role() in ('super_admin', 'admin'));

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('event-posters', 'event-posters', true),
  ('sermon-audio', 'sermon-audio', true),
  ('media-library', 'media-library', true)
on conflict (id) do nothing;

-- Storage policies (re-runnable)
drop policy if exists "public read storage" on storage.objects;
create policy "public read storage"
on storage.objects
for select
using (bucket_id in ('event-posters', 'sermon-audio', 'media-library'));

drop policy if exists "admin write storage" on storage.objects;
create policy "admin write storage"
on storage.objects
for insert
with check (
  bucket_id in ('event-posters', 'sermon-audio', 'media-library')
  and public.current_user_role() in ('super_admin', 'admin', 'editor')
);

drop policy if exists "admin update storage" on storage.objects;
create policy "admin update storage"
on storage.objects
for update
using (public.current_user_role() in ('super_admin', 'admin', 'editor'))
with check (public.current_user_role() in ('super_admin', 'admin', 'editor'));

drop policy if exists "admin delete storage" on storage.objects;
create policy "admin delete storage"
on storage.objects
for delete
using (public.current_user_role() in ('super_admin', 'admin'));

-- Helpful indexes
create index if not exists devotionals_created_at_idx on public.devotionals (created_at desc);
create index if not exists devotionals_slug_idx on public.devotionals (slug);
create index if not exists events_date_time_idx on public.events (date, time);
create index if not exists sermons_date_idx on public.sermons (date desc);
