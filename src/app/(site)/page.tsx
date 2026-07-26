import { getPublishedPackages } from "@/lib/data/packages";
import { getCurrentUser } from "@/lib/auth";
import { toPackageViews } from "@/lib/packages-view";
import { HomeExperience } from "@/components/home-experience";

export default async function HomePage() {
  // getPublishedPackages carries its own static-catalogue fallback, so this
  // renders whether or not Supabase is reachable.
  const [packages, user] = await Promise.all([getPublishedPackages(), getCurrentUser()]);

  return <HomeExperience packages={toPackageViews(packages)} signedIn={Boolean(user)} />;
}
