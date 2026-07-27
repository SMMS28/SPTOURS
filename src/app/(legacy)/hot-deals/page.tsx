import { hotDeals } from "@/lib/data/feature-catalog";
import { BackTo } from "@/components/back-link";

export const metadata = {
  title: "Hot Deals | SP TOURS AND TRAVELLS",
};

export default function HotDealsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <BackTo href="/" label="Back" className="mb-7" />
      <h1 className="font-display text-3xl font-semibold">Hot deals</h1>
      <p className="mt-2 text-mutedfg">Limited-period travel offers and featured package pricing.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotDeals.map((deal) => (
          <article key={deal.title} className="rounded-lg border bg-white p-5">
            <h2 className="font-semibold">{deal.title}</h2>
            <p className="mt-2 text-sm text-mutedfg">{deal.subtitle}</p>
            <p className="mt-4 font-medium">{deal.priceLabel}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
