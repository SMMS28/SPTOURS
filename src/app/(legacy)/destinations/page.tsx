import Image from "next/image";
import { BackTo } from "@/components/back-link";
import { destinationCards } from "@/lib/data/media";
import { getPublishedDestinations } from "@/lib/data/destinations";

export const metadata = {
  title: "Destinations | SP TOURS AND TRAVELLS",
};

export default async function DestinationsPage() {
  const destinations = await getPublishedDestinations();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <BackTo href="/" label="Back" className="mb-7" />
      <h1 className="font-display text-3xl font-semibold">Destinations</h1>
      <p className="mt-2 text-mutedfg">Explore top places covered by our travel packages.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination, index) => {
          const mediaFallback = destinationCards[index % destinationCards.length];

          return (
            <article key={destination.id} className="overflow-hidden rounded-lg border bg-white">
              <div className="relative h-44">
                <Image src={mediaFallback.image} alt={destination.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{destination.name}</h2>
                <p className="text-sm text-mutedfg">{destination.country}</p>
                <p className="mt-3 text-sm">{destination.description || mediaFallback.summary}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
