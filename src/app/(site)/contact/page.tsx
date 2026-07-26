import type { Metadata } from "next";
import { getPublishedPackages } from "@/lib/data/packages";
import { toPackageViews } from "@/lib/packages-view";
import { ContactExperience, type ContactPackageOption } from "@/components/contact-experience";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Plan a North East India trip with SP Tours & Travels — honest advice from a team that has run these routes since 1986.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [params, rows] = await Promise.all([searchParams, getPublishedPackages()]);

  const packages: ContactPackageOption[] = toPackageViews(rows).map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    duration: pkg.duration,
    bookable: pkg.bookable,
  }));

  return <ContactExperience packages={packages} status={params.status} />;
}
