import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRole } from "@/lib/types";

export const getCurrentUser = async () => {
  if (!hasSupabaseEnv) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
};

export const getProfileRoleByUserId = async (userId: string): Promise<ProfileRole> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    return (data?.role as ProfileRole | undefined) ?? "user";
  } catch {
    return "user";
  }
};

export const getCurrentProfileRole = async (): Promise<ProfileRole | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return getProfileRoleByUserId(user.id);
};
