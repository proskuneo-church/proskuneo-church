# Proskuneo Church Website + Admin CMS

Modern church website built with React (Vite) and Supabase backend.

## Features

### Public Website
- One-page smooth scroll sections: Hero, Countdown, Devotional preview, Featured events, Upcoming carousel, Schedule, Community, Giving, Sermons, Footer.
- Devotional detail routes:
  - `/devotional/bulanan/:slug`
  - `/devotional/harian/:slug`
- Smart service countdown from fixed weekly schedule in frontend (`src/data/serviceSchedule.js`):
  - before service -> HH:MM:SS
  - during first 1 hour -> `LIVE NOW` + YouTube button
  - after 1 hour -> auto switch to next service

### Admin Panel (`/admin`)
- Supabase Auth login
- Role-based access (`super_admin`, `admin`, `editor`)
- CRUD for devotionals, events, sermons
- Media upload (images/audio) to Supabase Storage
- User role management (super admin only)

## Stack
- React + Vite
- React Router
- Supabase JS Client

## Setup

1. Install dependencies

```bash
npm install
```

2. Create environment file

```bash
cp .env.example .env
```

Then fill values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

3. Apply database schema
- Open Supabase SQL Editor
- Run `supabase/schema.sql`

4. Start development

```bash
npm run dev
```

5. Build for production

```bash
npm run build
```

## Notes
- Events table uses `type` (`featured` | `upcoming`) to separate major events and upcoming service posters.
- Service schedule and countdown are intentionally fixed in frontend code (recurring weekly), not from database.
- Editor role can create and edit, but delete is reserved for `admin` and `super_admin`.
- Ensure Storage buckets exist: `event-posters`, `sermon-audio`, `media-library`.
