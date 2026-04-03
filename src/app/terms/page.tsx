export const metadata = {
  title: "Terms & Conditions | SP TOURS AND TRAVELLS",
};

export default function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold">Terms & conditions</h1>
      <p className="mt-2 text-muted-foreground">
        Standard booking, cancellation, and travel responsibility terms apply to all packages.
      </p>
      <div className="mt-6 space-y-4 text-sm text-muted-foreground">
        <p>• Package confirmation is subject to payment and availability.</p>
        <p>• Cancellation terms vary by destination, season, and supplier policy.</p>
        <p>• Travelers are responsible for visas, IDs, and destination-specific compliance.</p>
      </div>
    </section>
  );
}
