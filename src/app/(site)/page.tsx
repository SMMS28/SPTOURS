import { getPublishedPackages } from "@/lib/data/packages";
import { toPackageViews } from "@/lib/packages-view";
import { HomeExperience } from "@/components/home-experience";

export const revalidate = 300;

export default async function HomePage() {
  // getPublishedPackages carries its own static-catalogue fallback, so this
  // renders whether or not Supabase is reachable.
  const packages = await getPublishedPackages();

  return <HomeExperience packages={toPackageViews(packages)} />;
}
