-- Privilege-escalation fix + admin provisioning.
--
-- The "User update own profile" policy from 0001 is row-level with no column
-- restriction:
--     using (id = auth.uid() or public.is_admin())
--     with check (id = auth.uid() or public.is_admin())
-- so any authenticated user could run
--     update public.profiles set role = 'admin' where id = auth.uid();
-- and gain the admin panel. RLS policies can't restrict individual columns, so
-- the guard is a trigger.

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    -- auth.uid() is null for the service role and for SQL-editor/superuser
    -- sessions, which is how an operator legitimately provisions an admin.
    if auth.uid() is null then
      return new;
    end if;

    if not public.is_admin() then
      raise exception 'Only an administrator can change a profile role';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
before update on public.profiles
for each row execute procedure public.prevent_role_self_escalation();

-- ---------------------------------------------------------------------------
-- Promote the operator account to admin.
--
-- The auth user must exist first. Because Auth → Emails has no custom SMTP
-- configured, a normal sign-up will never receive its confirmation mail, so
-- create it in the dashboard instead:
--   Authentication → Users → Add user → tick "Auto Confirm User", set a password.
-- Then this statement grants the role. Safe to re-run.
-- ---------------------------------------------------------------------------
update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
  and lower(u.email) = lower('sptoursrjy@gmail.com')
  and p.role <> 'admin';

-- If the profile row is missing (trigger added after the user was created),
-- create it as admin.
insert into public.profiles (id, full_name, role)
select u.id, coalesce(u.raw_user_meta_data->>'full_name', 'SP Tours Admin'), 'admin'
from auth.users u
where lower(u.email) = lower('sptoursrjy@gmail.com')
  and not exists (select 1 from public.profiles p where p.id = u.id);
