import { fixedDepartures } from "@/lib/data/feature-catalog";

export const metadata = {
  title: "Fixed Departures | SP TOURS AND TRAVELLS",
};

export default function FixedDeparturesPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Fixed departure tours</h1>
      <p className="mt-2 text-mutedfg">
        Browse curated departures grouped by origin city.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {fixedDepartures.map((group) => (
          <article key={group.city} className="rounded-lg border bg-white p-5">
            <h2 className="text-lg font-semibold">Tours from {group.city}</h2>
            <ul className="mt-4 space-y-2 text-sm text-mutedfg">
              {group.tours.map((tour) => (
                <li key={tour}>• {tour}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
