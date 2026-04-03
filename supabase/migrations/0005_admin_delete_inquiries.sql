create policy "Admin delete inquiries"
on public.inquiries
for delete
using (public.is_admin());
