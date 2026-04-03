import Link from "next/link";
import { linkButton } from "@/lib/link-styles";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin | SP TOURS AND TRAVELLS",
};

export default async function AdminDashboardPage() {
  let stats = {
    publishedPackages: 0,
    newInquiries: 0,
    pendingBookings: 0,
  };

  if (hasSupabaseEnv) {
    try {
      const supabase = await createClient();
      const [{ count: packageCount }, { count: inquiryCount }, { count: bookingCount }] =
        await Promise.all([
          supabase
            .from("packages")
            .select("id", { head: true, count: "exact" })
            .eq("is_published", true),
          supabase
            .from("inquiries")
            .select("id", { head: true, count: "exact" })
            .eq("status", "new"),
          supabase
            .from("bookings")
            .select("id", { head: true, count: "exact" })
            .eq("status", "pending"),
        ]);

      stats = {
        publishedPackages: packageCount ?? 0,
        newInquiries: inquiryCount ?? 0,
        pendingBookings: bookingCount ?? 0,
      };
    } catch {
      stats = {
        publishedPackages: 0,
        newInquiries: 0,
        pendingBookings: 0,
      };
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Admin dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Manage packages, destinations, and customer inquiries.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Published packages</p>
          <p className="mt-2 text-2xl font-semibold">{stats.publishedPackages}</p>
        </article>
        <article className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">New inquiries</p>
          <p className="mt-2 text-2xl font-semibold">{stats.newInquiries}</p>
        </article>
        <article className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Pending bookings</p>
          <p className="mt-2 text-2xl font-semibold">{stats.pendingBookings}</p>
        </article>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/packages/new" className={linkButton()}>
            Create package
          </Link>
          <Link href="/admin/destinations/new" className={linkButton("outline")}>
            Create destination
          </Link>
          <Link href="/admin/inquiries" className={linkButton("outline")}>
            View inquiries
          </Link>
          <Link href="/admin/bookings" className={linkButton("outline")}>
            View bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
