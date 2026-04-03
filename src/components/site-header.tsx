import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";
import { SiteHeaderClient } from "@/components/site-header-client";

export const SiteHeader = async () => {
  const user = await getCurrentUser();
  const role = user ? await getProfileRoleByUserId(user.id) : null;

  return <SiteHeaderClient isAuthenticated={Boolean(user)} isAdmin={role === "admin"} />;
};
