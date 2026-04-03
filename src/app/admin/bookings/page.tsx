import { Badge } from "@/components/ui/badge";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Bookings | SP TOURS AND TRAVELLS",
};

type BookingRow = {
  id: string;
  booking_reference: string | null;
  status: "pending" | "confirmed" | "cancelled";
  travel_date: string | null;
  travelers_count: number;
  total_amount: number;
  created_at: string;
  package_id: string;
  packages: { title: string; slug: string }[] | null;
};

export default async function AdminBookingsPage() {
  let bookings: BookingRow[] = [];

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("id,booking_reference,status,travel_date,travelers_count,total_amount,created_at,package_id,packages(title,slug)")
      .order("created_at", { ascending: false })
      .limit(200);

    bookings = (data ?? []) as BookingRow[];

    if ((!bookings.length || error) && hasSupabaseEnv) {
      const serviceSupabase = createServiceClient();
      if (serviceSupabase) {
        const { data: serviceData } = await serviceSupabase
          .from("bookings")
          .select("id,booking_reference,status,travel_date,travelers_count,total_amount,created_at,package_id,packages(title,slug)")
          .order("created_at", { ascending: false })
          .limit(200);

        bookings = (serviceData ?? []) as BookingRow[];
      }
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold">Bookings</h1>
      <p className="mt-2 text-muted-foreground">Operational queue for package bookings and confirmations.</p>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-245 text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Travel date</th>
              <th className="px-4 py-3">Travelers</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No bookings found yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="px-4 py-3">{booking.booking_reference ?? "-"}</td>
                  <td className="px-4 py-3">{booking.packages?.[0]?.title ?? booking.package_id}</td>
                  <td className="px-4 py-3">{booking.travel_date ? new Date(booking.travel_date).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3">{booking.travelers_count}</td>
                  <td className="px-4 py-3">₹{Number(booking.total_amount).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{new Date(booking.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <form action={updateBookingStatus} className="flex items-center gap-2">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <select
                        name="status"
                        defaultValue={booking.status}
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                      >
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                      <button type="submit" className="h-8 rounded-md border px-2 text-xs hover:bg-muted" data-confirm-message="Confirm booking status update?">
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}