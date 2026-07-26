-- Capture the provider's name and avatar on first sign-up.
--
-- handle_new_user only read raw_user_meta_data->>'full_name'. Google puts the
-- display name under `name` (and sometimes `full_name`), the photo under
-- `picture` (sometimes `avatar_url`), and also supplies given_name/family_name.
-- Reading only 'full_name' meant a Google sign-up produced a profile row with an
-- empty name, which is why the account page showed no details.
--
-- The app also calls syncProfileFromProvider() on every /auth/callback, which
-- covers users who signed up by email and linked Google later — this trigger just
-- gets the common case right at the source.

-- 0001 declares avatar_url in its CREATE TABLE, but on this project the profiles
-- table already existed when 0001 ran, so `create table if not exists` was a
-- no-op and the column was never added. Add it before anything references it.
alter table public.profiles
  add column if not exists avatar_url text;

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

  resolved_avatar := nullif(trim(coalesce(
    meta->>'avatar_url',
    meta->>'picture',
    ''
  )), '');

  insert into public.profiles (id, full_name, phone, avatar_url, role)
  values (
    new.id,
    coalesce(resolved_name, ''),
    nullif(meta->>'phone', ''),
    resolved_avatar,
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

-- Backfill anyone who already signed up via a provider and has no name yet.
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
