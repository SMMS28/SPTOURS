-- Fix infinite recursion in the profiles RLS policies.
--
-- 0001 defined is_admin() without SECURITY DEFINER:
--
--   create or replace function public.is_admin()
--   returns boolean language sql stable as $$
--     select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
--   $$;
--
-- so its read of public.profiles runs as the caller and is itself subject to RLS.
-- The profiles policies call is_admin():
--
--   using (id = auth.uid() or public.is_admin())
--
-- which re-enters the function, which reads profiles again, and so on. Postgres
-- aborts with 54001 "stack depth limit exceeded".
--
-- It looked intermittent because Postgres short-circuits `or`: for a caller's own
-- row `id = auth.uid()` is true and is_admin() is never reached. Any plan that
-- evaluates the policy against a row the caller does not own — a sequential scan
-- on a small table, or an anonymous request where auth.uid() is null — recurses
-- and the whole query fails. Signed-in traffic hit it constantly; anonymous
-- traffic mostly did not, which is why the site looked fine until you logged in.
--
-- SECURITY DEFINER makes the lookup run as the function owner, bypassing RLS on
-- that internal read and breaking the cycle. This is the standard Supabase
-- pattern for a policy helper that reads the table it guards.
--
-- Disclosure is unchanged: the function still only reports whether the *current*
-- caller is an admin, and returns a bare boolean.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Keep the definer function callable by the usual API roles and nothing more.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;
