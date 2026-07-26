import type { Metadata } from "next";
import { PackagesDiscovery } from "@/components/packages-discovery";

export const metadata: Metadata = {
  title: "All journeys",
  description: "Seven signature routes across North East India — fixed departures or fully custom.",
};

export default function PackagesPage() {
  return <PackagesDiscovery />;
}
