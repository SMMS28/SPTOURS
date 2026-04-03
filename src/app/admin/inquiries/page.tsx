import { Badge } from "@/components/ui/badge";
import { deleteInquiry, updateInquiryStatus } from "@/lib/actions/inquiries";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin inquiries | SP TOURS AND TRAVELLS",
};

type InquiryRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "in_progress" | "closed";
  created_at: string;
};

export default async function AdminInquiriesPage() {
  let inquiries: InquiryRow[] = [];

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inquiries")
      .select("id, full_name, email, phone, message, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    inquiries = (data ?? []) as InquiryRow[];

    if ((!inquiries.length || error) && hasSupabaseEnv) {
      const serviceSupabase = createServiceClient();

      if (serviceSupabase) {
        const { data: serviceData } = await serviceSupabase
          .from("inquiries")
          .select("id, full_name, email, phone, message, status, created_at")
          .order("created_at", { ascending: false })
          .limit(200);

        inquiries = (serviceData ?? []) as InquiryRow[];
      }
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-semibold">Customer inquiries</h1>
      <p className="mt-2 text-muted-foreground">
        All enquiries submitted from the contact form appear here.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-215 border-collapse text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No inquiries found yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-t align-top">
                  <td className="px-4 py-3 font-medium">{inquiry.full_name}</td>
                  <td className="px-4 py-3">{inquiry.email}</td>
                  <td className="px-4 py-3">{inquiry.phone || "—"}</td>
                  <td className="max-w-95 px-4 py-3 text-muted-foreground">{inquiry.message}</td>
                  <td className="px-4 py-3">
                    <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
                      {inquiry.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <form action={updateInquiryStatus} className="flex items-center gap-2">
                        <input type="hidden" name="inquiryId" value={inquiry.id} />
                        <select
                          name="status"
                          defaultValue={inquiry.status}
                          className="h-8 rounded-md border bg-background px-2 text-xs"
                        >
                          <option value="new">new</option>
                          <option value="in_progress">in progress</option>
                          <option value="closed">closed</option>
                        </select>
                        <button
                          type="submit"
                          className="h-8 rounded-md border px-2 text-xs font-medium hover:bg-muted"
                          data-confirm-message="Confirm updating inquiry status?"
                        >
                          Update
                        </button>
                      </form>

                      <form action={deleteInquiry}>
                        <input type="hidden" name="inquiryId" value={inquiry.id} />
                        <button
                          type="submit"
                          data-confirm-message="Confirm deleting this inquiry?"
                          className="h-8 rounded-md border border-red-200 px-2 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
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
