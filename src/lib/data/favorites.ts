import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/**
 * Package ids the signed-in user has saved, used to render the filled/outline
 * state of the heart control. Returns [] for anonymous visitors and whenever
 * Supabase isn't configured, so callers never need to branch.
 */
export const getFavoritePackageIds = async (): Promise<string[]> => {
  if (!hasSupabaseEnv) {
    return [];
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("favorites")
      .select("package_id")
      .eq("user_id", user.id);

    if (error || !data) {
      return [];
    }

    return data.map((row) => String(row.package_id));
  } catch {
    return [];
  }
};
