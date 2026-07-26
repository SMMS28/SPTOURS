# SP Tours & Travels — redesign (Next.js port)

Production code for the redesign, written to your existing stack: **Next.js (App Router) · TypeScript · Tailwind CSS v4 · framer-motion**. Drop it into `web/` and run.

## What's here

```
src/
  app/
    layout.tsx                  # root shell — fonts (Bricolage Grotesque / Manrope / Space Mono), <body>
    globals.css                 # the redesign theme: ivory/ink + one clay accent, keyframes, scrollbar
    (site)/                     # marketing route group — gets the SiteHeader + SiteFooter
      layout.tsx
      page.tsx                  # Home
      packages/page.tsx         # All journeys (filterable)
      packages/[slug]/page.tsx  # Package detail (itinerary, sticky booking)
      northeast/page.tsx        # The Northeast — states rail, stops, seasons, cuisine, how-to-reach
      contact/page.tsx          # Contact — form composes a pre-filled WhatsApp message
    (auth)/                     # bare — sign in / register / reset (shared AuthShell)
      layout.tsx
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
    profile/                    # account area — own header, no marketing chrome
      layout.tsx
      page.tsx                  # My trips · Saved · Profile details
    admin/
      layout.tsx                # bare (no marketing chrome) — re-add your auth gate here
      page.tsx                  # Admin dashboard (Dashboard / Packages / Inquiries / Bookings / Destinations)
  components/
    auth-shell.tsx              # split sign-in / register / reset screen
    site-header.tsx             # fixed nav, transparent→ivory on scroll, WhatsApp CTA
    site-footer.tsx
    home-experience.tsx         # hero crossfade, bento journeys, parallax promise, contact
    packages-discovery.tsx      # filter chips + grid
    package-detail.tsx          # detail body + accordion itinerary
  lib/
    site.ts                     # brand constants, WhatsApp helpers, the 7 packages, itineraries, inclusions
```

## Integrate

1. Copy `src/` into your project's `web/` (merge with your existing `src/`).
2. `framer-motion` is already in your `package.json` — nothing to install.
3. Fonts load via `next/font/google` (no config needed).
4. Images reference files already in `public/images/…` (hero-bg + northeast covers + logo-2026.png).
5. `npm run dev` → the redesign is live.

## Notes / wiring left for you

- **globals.css** is self-contained for the redesign. If you keep other shadcn components, merge their tokens back in rather than replacing wholesale.
- **Admin auth**: `app/admin/layout.tsx` is intentionally bare. Re-add your Supabase check (redirect if not admin), same as the old admin layout.
- **Data**: pages read from `lib/site.ts` (the real 7 packages). Swap these for your Supabase queries (`getPublishedPackages`, etc.) — the component props map 1:1 to your `TravelPackage` fields.
- **Admin tables** (inquiries / bookings) use sample rows for the prototype — point them at your `inquiries` / `bookings` tables.
- **WhatsApp**: number + message templates live in `lib/site.ts` (`WHATSAPP_NUMBER`, `wa()`, `WA_PLAN`, `WA_ENQUIRE`). Every enquiry CTA routes there.
- This is written to your conventions but hasn't been run through your build here — do a `npm run lint` / `tsc` pass after copying.

## Design system

- **Palette**: paper `#F5F0E6`, ink `#17130D`, dark `#14110B`, clay `#9B6A4C` (single accent), muted `#6B6252`.
- **Type**: Bricolage Grotesque (display), Manrope (body), Space Mono (labels).
- **Motion**: ken-burns hero, scroll reveals, parallax, magnetic/hover lifts, count-ups — all respect `prefers-reduced-motion`.
