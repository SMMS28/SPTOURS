import { faqItems } from "@/lib/data/feature-catalog";

export const metadata = {
  title: "FAQs | SP TOURS AND TRAVELLS",
};

export default function FaqPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">FAQs</h1>
      <p className="mt-2 text-muted-foreground">Quick answers to frequent travel and booking questions.</p>

      <div className="mt-8 space-y-3">
        {faqItems.map((item) => (
          <details key={item.question} className="rounded-lg border bg-card p-4">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
