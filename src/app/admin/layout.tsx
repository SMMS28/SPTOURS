import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const role = user ? await getProfileRoleByUserId(user.id) : null;

  if (hasSupabaseEnv && !user) {
    redirect("/login");
  }

  if (hasSupabaseEnv && role !== "admin") {
    redirect("/");
  }

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
