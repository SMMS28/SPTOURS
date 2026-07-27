import Link from "next/link";
import { BackTo } from "@/components/back-link";
import { productOfferings } from "@/lib/data/feature-catalog";
import { linkButton } from "@/lib/link-styles";

export const metadata = {
  title: "Services | SP TOURS AND TRAVELLS",
};

export default function ServicesPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <BackTo href="/" label="Back" className="mb-7" />
      <h1 className="font-display text-3xl font-semibold">Travel services</h1>
      <p className="mt-2 max-w-3xl text-mutedfg">
        Explore services mapped to your package catalog and quickly jump to the right tour category.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {productOfferings.map((item) => (
          <article key={item.title} className="flex h-full flex-col rounded-lg border bg-white p-5">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-mutedfg">{item.description}</p>
            <Link href={item.href} className="mt-4 inline-flex min-h-11 w-fit items-center rounded-md border px-3 py-2 text-sm font-medium">
              Explore
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/packages" className={linkButton("outline")}>
          Browse all packages
        </Link>
        <Link href="/contact" className={linkButton()}>
          Quick enquiry
        </Link>
      </div>
    </section>
  );
}
