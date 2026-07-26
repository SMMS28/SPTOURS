import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";
import { SiteHeaderClient } from "@/components/site-header-client";

/**
 * Async wrapper that resolves the session server-side, so the client header can
 * show Sign in / Logout and the Admin link. The redesign shipped a bare client
 * header with no auth awareness — this keeps that entry point.
 */
export const SiteHeader = async ({ solid = false }: { solid?: boolean }) => {
  const user = await getCurrentUser();
  const role = user ? await getProfileRoleByUserId(user.id) : null;

  return (
    <SiteHeaderClient
      isAuthenticated={Boolean(user)}
      isAdmin={role === "admin"}
      solid={solid}
    />
  );
};
