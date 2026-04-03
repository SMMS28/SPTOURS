import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";
import { linkButton } from "@/lib/link-styles";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile | SP TOURS AND TRAVELLS",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user && hasSupabaseEnv) {
    redirect("/login");
  }

  const role = user ? await getProfileRoleByUserId(user.id) : null;
  let favorites: {
    id: string;
    package_id: string;
    packages: { slug: string; title: string; destination: string }[] | null;
  }[] = [];
  let bookings: {
    id: string;
    booking_reference: string | null;
    status: "pending" | "confirmed" | "cancelled";
    travel_date: string | null;
    travelers_count: number;
    total_amount: number;
    packages: { slug: string; title: string; destination: string }[] | null;
  }[] = [];

  if (user && hasSupabaseEnv) {
    const supabase = await createClient();

    const [{ data: favoriteData }, { data: bookingData }] = await Promise.all([
      supabase
        .from("favorites")
        .select("id,package_id,packages(slug,title,destination)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("bookings")
        .select("id,booking_reference,status,travel_date,travelers_count,total_amount,packages(slug,title,destination)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    favorites = (favoriteData ?? []) as typeof favorites;
    bookings = (bookingData ?? []) as typeof bookings;
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <p className="mt-2 text-muted-foreground">Manage your account and recent travel activity.</p>

      <div className="mt-8 rounded-lg border p-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-medium">{user?.email ?? "demo.user@example.com"}</p>
          <Badge variant="secondary">{role ?? "user"}</Badge>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Your saved packages and booking history are synced from Supabase.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/packages" className={linkButton("outline")}>
            Browse packages
          </Link>
          <Link href="/contact" className={linkButton()}>
            Send inquiry
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Saved packages</h2>
        {favorites.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No saved packages yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {favorites.map((favorite) => (
              <li key={favorite.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <p className="font-medium">{favorite.packages?.[0]?.title ?? "Package"}</p>
                  <p className="text-muted-foreground">{favorite.packages?.[0]?.destination ?? ""}</p>
                </div>
                <Link href={`/packages/${favorite.packages?.[0]?.slug ?? ""}`} className={linkButton("outline")}>
                  Open package
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">Booking history</h2>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No bookings yet. Start from any package planner.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {bookings.map((booking) => (
              <li key={booking.id} className="rounded-md border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{booking.packages?.[0]?.title ?? "Package"}</p>
                  <Badge variant="secondary">{booking.status}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{booking.packages?.[0]?.destination ?? ""}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {booking.booking_reference ? `Ref: ${booking.booking_reference} · ` : ""}
                  {booking.travel_date ? `Travel: ${new Date(booking.travel_date).toLocaleDateString()} · ` : ""}
                  Travelers: {booking.travelers_count} · ₹{Number(booking.total_amount).toLocaleString("en-IN")}
                </p>
                {booking.packages?.[0]?.slug && (
                  <div className="mt-3">
                    <Link
                      href={`/packages/${booking.packages[0].slug}?travelDate=${encodeURIComponent(booking.travel_date ?? "")}&travelers=${booking.travelers_count}`}
                      className={linkButton("outline")}
                    >
                      Resume booking
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
