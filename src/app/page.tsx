import { getPublishedPackages } from "@/lib/data/packages";
import { groupPackagesByCategory } from "@/lib/data/package-categories";
import { HomeExperience } from "@/components/home-experience";

export const revalidate = 300;

export default async function HomePage() {
  const packages = await getPublishedPackages();
  const grouped = groupPackagesByCategory(packages);

  return <HomeExperience packages={packages} grouped={grouped} />;
}
