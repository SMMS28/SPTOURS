create table if not exists public.package_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  day_number int not null check (day_number > 0),
  title text not null,
  details text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.package_itinerary_days enable row level security;

drop policy if exists "Public read package itinerary" on public.package_itinerary_days;
create policy "Public read package itinerary"
on public.package_itinerary_days
for select
using (true);

drop policy if exists "Admin manage package itinerary" on public.package_itinerary_days;
create policy "Admin manage package itinerary"
on public.package_itinerary_days
for all
using (public.is_admin())
with check (public.is_admin());
