import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Real figures for the admin dashboard.
 *
 * The redesigned dashboard shipped with hardcoded sample rows — 12 invented
 * inquirers with phone numbers, a fixed ₹8.4L revenue and a static bar chart —
 * which an operator would read as real. Everything here comes from the database,
 * and degrades to zeros/empties rather than inventing anything.
 */

export type AdminStatus = "new" | "in_progress" | "closed";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type AdminInquiryRow = {
  id: string;
  fullName: string;
  contact: string;
  packageTitle: string | null;
  createdAt: string | null;
  status: string;
  /** Present only when the visitor opted in and migration 0008 has been applied. */
  latitude: number | null;
  longitude: number | null;
  locationAccuracyM: number | null;
};

export type AdminBookingRow = {
  id: string;
  reference: string | null;
  packageTitle: string | null;
  travellers: number | null;
  amount: number;
  status: string;
};

export type AdminStats = {
  available: boolean;
  publishedPackages: number;
  totalPackages: number;
  totalInquiries: number;
  newInquiries: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedRevenue30d: number;
  inquiriesByDay: { label: string; count: number }[];
  topPackages: { title: string; count: number; pct: number }[];
  recentInquiries: AdminInquiryRow[];
  recentBookings: AdminBookingRow[];
};

const EMPTY: AdminStats = {
  available: false,
  publishedPackages: 0,
  totalPackages: 0,
  totalInquiries: 0,
  newInquiries: 0,
  totalBookings: 0,
  pendingBookings: 0,
  confirmedRevenue30d: 0,
  inquiriesByDay: [],
  topPackages: [],
  recentInquiries: [],
  recentBookings: [],
};

const firstOf = (value: unknown): { title?: string } | null => {
  if (!value) return null;
  return (Array.isArray(value) ? value[0] : value) as { title?: string } | null;
};

const dayBuckets = (days: number) => {
  const out: { key: string; label: string; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", { weekday: "short" }),
      count: 0,
    });
  }
  return out;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  if (!hasSupabaseEnv) {
    return EMPTY;
  }

  try {
    const supabase = await createClient();
    const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
    const since7 = new Date(Date.now() - 7 * 86400000).toISOString();

    const [pkgAll, pkgPublished, inqAll, inqNew, bkAll, bkPending, revenue, inq7, inqTop, recentInq, recentBk] =
      await Promise.all([
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("packages").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase
          .from("bookings")
          .select("total_amount")
          .eq("status", "confirmed")
          .gte("created_at", since30),
        supabase.from("inquiries").select("created_at").gte("created_at", since7),
        supabase
          .from("inquiries")
          .select("package_id,packages(title)")
          .gte("created_at", since30)
          .not("package_id", "is", null),
        // Location columns arrive in migration 0008. Ask for them, and fall back
        // to the base columns if they aren't there yet, so the panel keeps
        // working either way.
        supabase
          .from("inquiries")
          .select(
            "id,full_name,email,phone,status,created_at,latitude,longitude,location_accuracy_m,packages(title)",
          )
          .order("created_at", { ascending: false })
          .limit(8)
          .then(async (result) => {
            if (!result.error) return result;
            return supabase
              .from("inquiries")
              .select("id,full_name,email,phone,status,created_at,packages(title)")
              .order("created_at", { ascending: false })
              .limit(8);
          }),
        // booking_reference comes from migration 0006, absent on some
        // environments — fall back so the panel still lists bookings.
        supabase
          .from("bookings")
          .select("id,booking_reference,status,travelers_count,total_amount,packages(title)")
          .order("created_at", { ascending: false })
          .limit(6)
          .then(async (result) => {
            if (!result.error) return result;
            return supabase
              .from("bookings")
              .select("id,status,travelers_count,total_amount,packages(title)")
              .order("created_at", { ascending: false })
              .limit(6);
          }),
      ]);

    // Bar chart: bucket the last 7 days in JS rather than needing an RPC.
    const buckets = dayBuckets(7);
    const byKey = new Map(buckets.map((b) => [b.key, b]));
    for (const row of inq7.data ?? []) {
      const key = String(row.created_at ?? "").slice(0, 10);
      const bucket = byKey.get(key);
      if (bucket) bucket.count += 1;
    }

    // Top packages by inquiry volume over 30 days.
    const topCounts = new Map<string, number>();
    for (const row of inqTop.data ?? []) {
      const title = firstOf(row.packages)?.title;
      if (!title) continue;
      topCounts.set(title, (topCounts.get(title) ?? 0) + 1);
    }
    const topTotal = Array.from(topCounts.values()).reduce((a, b) => a + b, 0);
    const topPackages = Array.from(topCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([title, count]) => ({
        title,
        count,
        pct: topTotal > 0 ? Math.round((count / topTotal) * 100) : 0,
      }));

    return {
      available: true,
      publishedPackages: pkgPublished.count ?? 0,
      totalPackages: pkgAll.count ?? 0,
      totalInquiries: inqAll.count ?? 0,
      newInquiries: inqNew.count ?? 0,
      totalBookings: bkAll.count ?? 0,
      pendingBookings: bkPending.count ?? 0,
      confirmedRevenue30d: (revenue.data ?? []).reduce(
        (sum, row) => sum + Number(row.total_amount ?? 0),
        0,
      ),
      inquiriesByDay: buckets.map(({ label, count }) => ({ label, count })),
      topPackages,
      recentInquiries: (recentInq.data ?? []).map((row) => {
        const r = row as Record<string, unknown>;
        const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));
        return {
          id: String(r.id),
          fullName: String(r.full_name ?? "—"),
          contact: String(r.phone || r.email || "—"),
          packageTitle: firstOf(r.packages)?.title ?? null,
          createdAt: r.created_at ? String(r.created_at) : null,
          status: String(r.status ?? "new"),
          latitude: num(r.latitude),
          longitude: num(r.longitude),
          locationAccuracyM: num(r.location_accuracy_m),
        };
      }),
      recentBookings: (recentBk.data ?? []).map((row) => ({
        id: String((row as Record<string, unknown>).id),
        reference: (row as Record<string, unknown>).booking_reference
          ? String((row as Record<string, unknown>).booking_reference)
          : null,
        packageTitle: firstOf(row.packages)?.title ?? null,
        travellers: row.travelers_count ? Number(row.travelers_count) : null,
        amount: Number(row.total_amount ?? 0),
        status: String(row.status ?? "pending"),
      })),
    };
  } catch {
    return EMPTY;
  }
};
