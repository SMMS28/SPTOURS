# FirstFlight Travels Rebuild (`web/`)

Modern travel app scaffold using:

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth + Postgres + RLS + Storage-ready schema

## Included in this scaffold

- Public pages: home, destinations, packages, package details, contact
- Auth pages: register, login, forgot-password, auth callback
- User area: profile with favorites + booking history
- Admin area: dashboard + package CRUD + destination CRUD + inquiries + bookings
- Supabase helpers for browser/server
- Starter migration with role-based RLS policies
- Server-side package discovery with pagination, sort, and month-of-travel filtering
- Booking planner flow writing to `bookings` + `inquiries`
- Optional webhook-based notifications for booking email/SMS/admin alerts
- Optional observability hooks for GA4, PostHog, and Sentry

## Run locally

1) Install dependencies

```bash
npm install
```

2) Create local env file

```bash
cp .env.example .env.local
```

3) Add your Supabase values in `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=package-media
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional booking notification webhooks
BOOKING_EMAIL_WEBHOOK_URL=
BOOKING_SMS_WEBHOOK_URL=
ADMIN_SLACK_WEBHOOK_URL=
ADMIN_EMAIL_WEBHOOK_URL=

# Optional observability
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_SENTRY_DSN=
```

4) Start dev server

```bash
npm run dev
```

Open http://localhost:3000

## Database setup (Supabase)

Run the SQL in all files under `supabase/migrations/` in order.

This creates:

- `profiles` (with `role`: `user` or `admin`)
- `destinations`
- `packages`
- `package_images`
- `inquiries`
- `favorites`
- `bookings`

It also enables RLS policies so:

- Public users can read published packages/destinations
- Authenticated users can manage their own profile/favorites/bookings
- Admins can manage travel content and inquiries

## Reliability scripts

- Seed packages: `npm run seed:supabase`
- Legacy import: `npm run import:legacy`
- E2E smoke: `npm run test:e2e`
