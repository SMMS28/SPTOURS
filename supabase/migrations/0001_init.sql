create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  slug text unique not null,
  description text,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references public.destinations(id) on delete set null,
  title text not null,
  slug text unique not null,
  destination text not null,
  location text not null,
  cover_image text,
  short_description text not null,
  description text,
  duration_days int not null check (duration_days > 0),
  price_inr numeric(12,2) not null check (price_inr >= 0),
  inclusions text[] not null default '{}',
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.package_images (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.package_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  day_number int not null check (day_number > 0),
  title text not null,
  details text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  package_id uuid references public.packages(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, package_id)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete cascade,
  travelers_count int not null default 1 check (travelers_count > 0),
  travel_date date,
  total_amount numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_destinations_updated_at on public.destinations;
create trigger set_destinations_updated_at
before update on public.destinations
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_packages_updated_at on public.packages;
create trigger set_packages_updated_at
before update on public.packages
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_inquiries_updated_at on public.inquiries;
create trigger set_inquiries_updated_at
before update on public.inquiries
for each row execute procedure public.handle_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute procedure public.handle_updated_at();

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.packages enable row level security;
alter table public.package_images enable row level security;
alter table public.package_itinerary_days enable row level security;
alter table public.inquiries enable row level security;
alter table public.favorites enable row level security;
alter table public.bookings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Public read published destinations"
on public.destinations
for select
using (is_published = true or public.is_admin());

create policy "Admin manage destinations"
on public.destinations
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read published packages"
on public.packages
for select
using (is_published = true or public.is_admin());

create policy "Admin manage packages"
on public.packages
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read package images"
on public.package_images
for select
using (true);

create policy "Admin manage package images"
on public.package_images
for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read package itinerary"
on public.package_itinerary_days
for select
using (true);

create policy "Admin manage package itinerary"
on public.package_itinerary_days
for all
using (public.is_admin())
with check (public.is_admin());

create policy "User read own profile"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

create policy "User update own profile"
on public.profiles
for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Users create own inquiries"
on public.inquiries
for insert
with check (user_id is null or user_id = auth.uid());

create policy "Users read own inquiries"
on public.inquiries
for select
using (user_id = auth.uid() or public.is_admin());

create policy "Admin manage inquiries"
on public.inquiries
for update
using (public.is_admin())
with check (public.is_admin());

create policy "Users manage own favorites"
on public.favorites
for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Users manage own bookings"
on public.bookings
for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());
