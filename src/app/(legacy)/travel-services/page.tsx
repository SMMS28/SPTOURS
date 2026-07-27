import { BackTo } from "@/components/back-link";
export const metadata = {
  title: "Hotels & Rentals | SP TOURS AND TRAVELLS",
};

export default function TravelServicesPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <BackTo href="/" label="Back" className="mb-7" />
      <h1 className="font-display text-3xl font-semibold">Hotels & Car/Coach Rentals</h1>
      <p className="mt-2 text-mutedfg">
        Stay and transport solutions for leisure, pilgrim, and corporate travel.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Hotel stays</h2>
          <p className="mt-2 text-sm text-mutedfg">
            Assisted booking across budget, premium, and group-friendly properties.
          </p>
        </article>
        <article className="rounded-lg border bg-white p-5">
          <h2 className="font-semibold">Car & coach rentals</h2>
          <p className="mt-2 text-sm text-mutedfg">
            Fleet options from local city cars to 25–53 seater coaches.
          </p>
        </article>
      </div>
    </section>
  );
}
