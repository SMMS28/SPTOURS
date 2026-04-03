insert into storage.buckets (id, name, public)
values ('package-media', 'package-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read package media" on storage.objects;
create policy "Public read package media"
on storage.objects
for select
to public
using (bucket_id = 'package-media');

drop policy if exists "Admin upload package media" on storage.objects;
create policy "Admin upload package media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'package-media' and public.is_admin());

drop policy if exists "Admin update package media" on storage.objects;
create policy "Admin update package media"
on storage.objects
for update
to authenticated
using (bucket_id = 'package-media' and public.is_admin())
with check (bucket_id = 'package-media' and public.is_admin());

drop policy if exists "Admin delete package media" on storage.objects;
create policy "Admin delete package media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'package-media' and public.is_admin());
