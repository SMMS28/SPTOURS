import { blogHighlights } from "@/lib/data/feature-catalog";

export const metadata = {
  title: "Blog | SP TOURS AND TRAVELLS",
};

export default function BlogPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold">Travel blog</h1>
      <p className="mt-2 text-muted-foreground">Guides, destination comparisons, and itinerary ideas.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {blogHighlights.map((post) => (
          <article key={post.title} className="rounded-lg border bg-card p-5">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
            <p className="mt-4 text-sm underline">Read more</p>
          </article>
        ))}
      </div>
    </section>
  );
}
