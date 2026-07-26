-- Contact fields for the redesigned account area's "Profile details" tab.
-- The redesign collects Full name / Phone / Email / City; full_name already
-- existed, email lives on auth.users, and these two are the new columns.

alter table public.profiles
  add column if not exists phone text,
  add column if not exists city text;

-- Registration now sends phone in the signup metadata alongside full_name,
-- so carry it through to the profile row the same way.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- No new RLS needed: the existing "User update own profile" policy on
-- public.profiles (id = auth.uid() or public.is_admin()) already covers
-- writes to these columns.
