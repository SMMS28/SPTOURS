export const metadata = {
  title: "Special Tours | SP TOURS AND TRAVELLS",
};

export default function SpecialToursPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold">Special Tours</h1>
      <p className="mt-2 text-mutedfg">
        Premium and special-interest modules such as luxury rail, LTC/LFC, and themed circuits.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Luxury rail journeys</h2>
          <p className="mt-2 text-sm text-mutedfg">High-comfort itineraries with curated experiences.</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">LTC/LFC style tours</h2>
          <p className="mt-2 text-sm text-mutedfg">Policy-friendly fixed plans for organized groups.</p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Pilgrimage circuits</h2>
          <p className="mt-2 text-sm text-mutedfg">Temple and spiritual routes with guided logistics.</p>
        </article>
      </div>
    </section>
  );
}
