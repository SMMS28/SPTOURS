import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Nav chrome for the existing Supabase-backed CRUD screens (packages,
 * destinations, inquiries, bookings). This is the wrapper the old admin layout
 * provided; it moved down a level because the redesigned dashboard at /admin is
 * full-screen with its own tabs and shouldn't inherit it.
 *
 * The role gate lives one level up in admin/layout.tsx and already applies here.
 */
export default function AdminCrudLayout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center gap-6 border-b pb-4 text-sm">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/packages">Packages</Link>
        <Link href="/admin/destinations">Destinations</Link>
        <Link href="/admin/inquiries">Inquiries</Link>
        <Link href="/admin/bookings">Bookings</Link>
        <Link href="/admin/packages/new">New package</Link>
      </div>
      {children}
    </section>
  );
}
