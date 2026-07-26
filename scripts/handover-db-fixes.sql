-- ============================================================================
-- SP TOURS — handover database fixes
--
-- Run this in the Supabase SQL Editor:
--   https://supabase.com/dashboard/project/ilbtleibfglzigrshjmb/sql/new
--
-- Audited state as of this run (read-only check against the live database):
--   0007 profiles.phone/city .............. APPLIED
--   0008 inquiries location ............... APPLIED
--   0009 profiles_guard_role trigger ...... APPLIED
--   0010 is_admin SECURITY DEFINER ........ APPLIED
--   0006 bookings.booking_reference ....... MISSING   <- section 1 below
--   0011 OAuth profile capture ............ MISSING   <- section 2 below
--
--   sptoursrjy@gmail.com .................. exists, confirmed, role=admin
--   smmsrao@gmail.com ..................... exists, confirmed, NO profile row
--   3 claude-*@mailinator.com test users .. unconfirmed, safe to delete
--
-- Sections 1 and 2 are just the two missing migration files inlined. Sections
-- 3-5 are cleanup. Everything is idempotent — safe to re-run.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 1. Migration 0006 — booking references
--    Without these columns every booking insert fails with 42703. The app has a
--    fallback that synthesises a reference, so this restores real ones.
-- ---------------------------------------------------------------------------
alter table public.bookings
  add column if not exists booking_reference text,
  add column if not exists referral_code text,
  add column if not exists share_token text;

update public.bookings
set
  booking_reference = coalesce(booking_reference, concat('BK-', to_char(created_at, 'YYYYMMDD'), '-', substring(id::text, 1, 8))),
  share_token = coalesce(share_token, encode(gen_random_bytes(6), 'hex'))
where booking_reference is null or share_token is null;

alter table public.bookings
  alter column booking_reference set default concat('BK-', to_char(timezone('utc', now()), 'YYYYMMDD'), '-', substring(gen_random_uuid()::text, 1, 8)),
  alter column share_token set default encode(gen_random_bytes(6), 'hex');

create unique index if not exists bookings_booking_reference_key on public.bookings (booking_reference);
create unique index if not exists bookings_share_token_key on public.bookings (share_token);

alter table public.inquiries
  add column if not exists travelers_count int,
  add column if not exists travel_date date,
  add column if not exists booking_id uuid references public.bookings(id) on delete set null,
  add column if not exists source text not null default 'website';

alter table public.inquiries drop constraint if exists inquiries_travelers_count_check;
alter table public.inquiries
  add constraint inquiries_travelers_count_check check (travelers_count is null or travelers_count > 0);

create index if not exists inquiries_booking_id_idx on public.inquiries (booking_id);
create index if not exists inquiries_travel_date_idx on public.inquiries (travel_date);


-- ---------------------------------------------------------------------------
-- 2. Migration 0011 — capture the provider's name/photo on sign-up
--    Google sends the display name as `name` and the photo as `picture`;
--    handle_new_user only read `full_name`, so Google sign-ups got a blank name.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  resolved_name text;
  resolved_avatar text;
begin
  resolved_name := nullif(trim(coalesce(
    meta->>'full_name',
    meta->>'name',
    nullif(trim(concat_ws(' ', meta->>'given_name', meta->>'family_name')), ''),
    ''
  )), '');

  resolved_avatar := nullif(trim(coalesce(meta->>'avatar_url', meta->>'picture', '')), '');

  insert into public.profiles (id, full_name, phone, avatar_url, role)
  values (new.id, coalesce(resolved_name, ''), nullif(meta->>'phone', ''), resolved_avatar, 'user')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Backfill names/avatars for accounts that already signed in via a provider.
update public.profiles p
set
  full_name = coalesce(
    nullif(p.full_name, ''),
    nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), '')
  ),
  avatar_url = coalesce(
    p.avatar_url,
    nullif(trim(coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', '')), '')
  )
from auth.users u
where u.id = p.id
  and (nullif(p.full_name, '') is null or p.avatar_url is null);


-- ---------------------------------------------------------------------------
-- 3. Give every account a profile row
--    smmsrao@gmail.com predates the trigger and has none, so the account page
--    would render blank for them.
-- ---------------------------------------------------------------------------
insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(nullif(trim(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), ''), ''),
  'user'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);


-- ---------------------------------------------------------------------------
-- 4. Confirm any unconfirmed accounts
--    Supabase requires a confirmation email that its built-in sender does not
--    deliver externally, which is why password login returned
--    400 email_not_confirmed. This unblocks it without SMTP.
--    (Delete the test users in section 5 first if you'd rather not confirm them.)
-- ---------------------------------------------------------------------------
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email_confirmed_at is null
  and email not like 'claude-%@mailinator.com';


-- ---------------------------------------------------------------------------
-- 5. Remove the test users created while diagnosing
-- ---------------------------------------------------------------------------
delete from auth.users where email like 'claude-%@mailinator.com';


-- ---------------------------------------------------------------------------
-- 6. OPTIONAL — set the admin password.
--    sptoursrjy@gmail.com already exists, is confirmed and is role=admin, so
--    this is only needed if the password is unknown. Replace the placeholder,
--    and change it again from the app afterwards.
-- ---------------------------------------------------------------------------
-- update auth.users
-- set encrypted_password = extensions.crypt('PUT_A_NEW_PASSWORD_HERE', extensions.gen_salt('bf')),
--     updated_at = now()
-- where lower(email) = 'sptoursrjy@gmail.com';


-- ---------------------------------------------------------------------------
-- 7. Verify
-- ---------------------------------------------------------------------------
select 'bookings.booking_reference' as check, count(*)::text as ok
  from information_schema.columns
  where table_schema='public' and table_name='bookings' and column_name='booking_reference'
union all
select 'handle_new_user reads picture',
       (pg_get_functiondef(p.oid) like '%picture%')::text
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='handle_new_user'
union all
select 'users without a profile', count(*)::text
  from auth.users u where not exists (select 1 from public.profiles p where p.id=u.id)
union all
select 'unconfirmed users', count(*)::text from auth.users where email_confirmed_at is null
union all
select 'admins', count(*)::text from public.profiles where role='admin';
