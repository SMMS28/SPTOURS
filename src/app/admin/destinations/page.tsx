import Link from "next/link";
import { deleteDestination } from "@/lib/actions/destinations";
import { getDestinationsForAdmin } from "@/lib/data/destinations";
import { linkButton } from "@/lib/link-styles";

export const metadata = {
  title: "Admin Destinations | SP TOURS AND TRAVELLS",
};

export default async function AdminDestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const destinations = await getDestinationsForAdmin();

  const filtered = destinations.filter((destination) => {
    if (!query) {
      return true;
    }

    return (
      destination.name.toLowerCase().includes(query) ||
      destination.country.toLowerCase().includes(query) ||
      destination.slug.toLowerCase().includes(query)
    );
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Manage destinations</h1>
        <Link href="/admin/destinations/new" className={linkButton()}>
          New destination
        </Link>
      </div>

      <form className="mt-6 grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Search destination, country, slug"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <button className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground">Search</button>
      </form>

      <p className="mt-3 text-sm text-muted-foreground">Showing {filtered.length} destinations</p>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No destinations found.
                </td>
              </tr>
            ) : (
              filtered.map((destination) => (
                <tr key={destination.id} className="border-t">
                  <td className="px-4 py-3">{destination.name}</td>
                  <td className="px-4 py-3">{destination.country}</td>
                  <td className="px-4 py-3">{destination.slug}</td>
                  <td className="px-4 py-3">{destination.is_published ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/destinations/${destination.id}/edit`} className="underline">
                        Edit
                      </Link>
                      <form action={deleteDestination} data-confirm-message="Confirm deleting this destination?">
                        <input type="hidden" name="id" value={destination.id} />
                        <button type="submit" className="text-destructive underline">
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

      {params.message && <p className="mt-4 text-sm text-muted-foreground">{params.message}</p>}
    </section>
  );
}