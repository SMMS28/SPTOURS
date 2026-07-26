import Link from "next/link";
import { deletePackage } from "@/lib/actions/packages";
import { getAllPackagesForAdmin } from "@/lib/data/packages";
import { linkButton } from "@/lib/link-styles";

export const metadata = {
  title: "Admin Packages | SP TOURS AND TRAVELLS",
};

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; q?: string; minDays?: string; maxDays?: string; month?: string }>;
}) {
  const params = await searchParams;
  const packages = await getAllPackagesForAdmin();
  const query = params.q?.toLowerCase().trim() ?? "";
  const minDays = Number(params.minDays || "");
  const maxDays = Number(params.maxDays || "");
  const month = params.month?.toLowerCase().trim() ?? "";

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const filtered = packages.filter((travelPackage) => {
    const inQuery =
      !query ||
      travelPackage.title.toLowerCase().includes(query) ||
      travelPackage.destination.toLowerCase().includes(query);
    const inMinDays = !Number.isFinite(minDays) || minDays <= 0 || travelPackage.duration_days >= minDays;
    const inMaxDays = !Number.isFinite(maxDays) || maxDays <= 0 || travelPackage.duration_days <= maxDays;
    const monthSource = `${travelPackage.title} ${travelPackage.raw_duration ?? ""} ${travelPackage.tags_type ?? ""}`.toLowerCase();
    const inMonth = !month || monthSource.includes(month);

    return inQuery && inMinDays && inMaxDays && inMonth;
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Manage packages</h1>
        <Link href="/admin/packages/new" className={linkButton()}>
          New package
        </Link>
      </div>

      <form className="mt-6 grid gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Search for Tours, City"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <input
          type="number"
          min={1}
          name="minDays"
          defaultValue={params.minDays}
          placeholder="No. of Days(Min)"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <input
          type="number"
          min={1}
          name="maxDays"
          defaultValue={params.maxDays}
          placeholder="No. of Days(Max)"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <select
          name="month"
          defaultValue={params.month ?? ""}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Month of Travel</option>
          {months.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
        <button className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground">
          Search
        </button>
      </form>

      <p className="mt-3 text-sm text-muted-foreground">Showing {filtered.length} packages</p>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Tags/Type</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((travelPackage) => (
              <tr key={travelPackage.id} className="border-t">
                <td className="px-4 py-3">{travelPackage.title}</td>
                <td className="px-4 py-3">{travelPackage.destination}</td>
                <td className="px-4 py-3">{travelPackage.source_category ?? "-"}</td>
                <td className="px-4 py-3">{travelPackage.tags_type ?? "-"}</td>
                <td className="px-4 py-3">{travelPackage.raw_duration ?? `${travelPackage.duration_days} days`}</td>
                <td className="px-4 py-3">₹{travelPackage.price_inr.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  {travelPackage.is_published ? "Published" : "Draft"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/packages/${travelPackage.id}/edit`} className="underline">
                      Edit
                    </Link>
                    <form action={deletePackage} data-confirm-message="Confirm deleting this package?">
                      <input type="hidden" name="packageId" value={travelPackage.id} />
                      <button
                        type="submit"
                        className="text-destructive underline"
                        formAction={deletePackage}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {params.message && (
        <p className="mt-4 text-sm text-muted-foreground">{params.message}</p>
      )}
    </div>
  );
}
