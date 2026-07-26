import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentUser, getProfileRoleByUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
};

/**
 * Bare layout — the redesigned dashboard is full-screen and supplies its own
 * chrome, so it skips the marketing SiteHeader / SiteFooter.
 *
 * The role gate below is carried over from the previous admin layout. The
 * redesign shipped this file without it, which would have made /admin publicly
 * reachable. Sub-route nav lives in (crud)/layout.tsx.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const role = user ? await getProfileRoleByUserId(user.id) : null;

  if (hasSupabaseEnv && !user) {
    redirect("/login");
  }

  if (hasSupabaseEnv && role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
