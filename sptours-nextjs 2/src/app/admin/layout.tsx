import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

// Bare layout: the admin tool is full-screen and supplies its own chrome,
// so it deliberately skips the marketing SiteHeader / SiteFooter.
// Re-add your Supabase auth gate here (redirect if !admin) when wiring to the backend.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
