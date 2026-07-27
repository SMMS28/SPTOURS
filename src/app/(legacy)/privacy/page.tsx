import { BackTo } from "@/components/back-link";
export const metadata = {
  title: "Privacy Policy | SP TOURS AND TRAVELLS",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <BackTo href="/" label="Back" className="mb-7" />
      <h1 className="font-display text-3xl font-semibold">Privacy policy</h1>
      <p className="mt-2 text-mutedfg">
        We collect only travel-planning details required to process inquiries and bookings.
      </p>
      <div className="mt-6 space-y-4 text-sm text-mutedfg">
        <p>• Contact details are used for communication about your requested trip.</p>
        <p>• Booking and inquiry data is stored securely with role-based access controls.</p>
        <p>• You can request profile updates or deletion by contacting support.</p>
      </div>
    </section>
  );
}
