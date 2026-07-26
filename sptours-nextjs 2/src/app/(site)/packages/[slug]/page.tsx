import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PACKAGES, getPackage } from "@/lib/site";
import { PackageDetail } from "@/components/package-detail";

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  return { title: pkg ? pkg.title : "Package" };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();
  return <PackageDetail slug={slug} />;
}
