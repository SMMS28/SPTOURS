-- Optional precise location on leads, so the admin can see where an enquiry or
-- booking request came from.
--
-- Deliberately opt-in: the browser Geolocation API requires an explicit user
-- gesture and permission grant, and the forms submit fine when it is declined.
-- consent_at records that the visitor actively shared it rather than it being
-- inferred, which matters because coordinates at this precision are personal data.

alter table public.inquiries
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists location_accuracy_m numeric(10, 2),
  add column if not exists location_consent_at timestamptz;

alter table public.bookings
  add column if not exists latitude numeric(9, 6),
  add column if not exists longitude numeric(9, 6),
  add column if not exists location_accuracy_m numeric(10, 2),
  add column if not exists location_consent_at timestamptz;

-- Sanity bounds so a malformed client payload can't store nonsense.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'inquiries_latitude_range') then
    alter table public.inquiries
      add constraint inquiries_latitude_range check (latitude is null or (latitude >= -90 and latitude <= 90)),
      add constraint inquiries_longitude_range check (longitude is null or (longitude >= -180 and longitude <= 180));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'bookings_latitude_range') then
    alter table public.bookings
      add constraint bookings_latitude_range check (latitude is null or (latitude >= -90 and latitude <= 90)),
      add constraint bookings_longitude_range check (longitude is null or (longitude >= -180 and longitude <= 180));
  end if;
end $$;

-- Existing RLS is unchanged and already covers these columns: the public insert
-- policy on inquiries and the owner policy on bookings are row-level, not
-- column-level, and only admins can read the full inquiry/booking tables back.
