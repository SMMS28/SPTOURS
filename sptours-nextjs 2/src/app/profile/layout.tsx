import type { Metadata } from "next";

export const metadata: Metadata = { title: "My account" };

// Account area supplies its own header; skips the marketing SiteHeader.
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
