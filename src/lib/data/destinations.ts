import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Destination } from "@/lib/types";

const fallbackDestinations: Destination[] = [
  { id: "dest-assam", name: "Assam", country: "India", slug: "assam", description: null, is_published: true },
  { id: "dest-meghalaya", name: "Meghalaya", country: "India", slug: "meghalaya", description: null, is_published: true },
  { id: "dest-sikkim", name: "Sikkim", country: "India", slug: "sikkim", description: null, is_published: true },
];

export const getDestinationsForAdmin = async (): Promise<Destination[]> => {
  if (!hasSupabaseEnv) {
    return fallbackDestinations;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("destinations")
      .select("id,name,country,slug,description,is_published")
      .order("name", { ascending: true });

    return (data ?? []) as Destination[];
  } catch {
    return fallbackDestinations;
  }
};

export const getPublishedDestinations = async (): Promise<Destination[]> => {
  if (!hasSupabaseEnv) {
    return fallbackDestinations.filter((row) => row.is_published);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("destinations")
      .select("id,name,country,slug,description,is_published")
      .eq("is_published", true)
      .order("name", { ascending: true });

    return (data ?? []) as Destination[];
  } catch {
    return fallbackDestinations.filter((row) => row.is_published);
  }
};

export const getDestinationByIdForAdmin = async (id: string) => {
  const destinations = await getDestinationsForAdmin();
  return destinations.find((row) => row.id === id) ?? null;
};