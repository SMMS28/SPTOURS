import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Details an OAuth provider gives us about the person.
 *
 * Google returns these under user_metadata, but the key names vary by provider
 * and by how the token was minted — `name` vs `full_name`, `picture` vs
 * `avatar_url` — so read all the plausible spellings.
 */
export type ProviderIdentity = {
  fullName: string | null;
  avatarUrl: string | null;
};

const firstString = (meta: Record<string, unknown>, keys: string[]): string | null => {
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

export const readProviderIdentity = (user: User): ProviderIdentity => {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;

  const given = firstString(meta, ["given_name", "first_name"]);
  const family = firstString(meta, ["family_name", "last_name"]);
  const composed = [given, family].filter(Boolean).join(" ").trim() || null;

  return {
    fullName: firstString(meta, ["full_name", "name", "preferred_username"]) ?? composed,
    avatarUrl: firstString(meta, ["avatar_url", "picture", "photoURL"]),
  };
};

/**
 * Copies the provider's name/avatar onto the profile row after sign-in.
 *
 * The handle_new_user trigger only runs on INSERT into auth.users, so it covers a
 * first-ever sign-up and nothing else — a user who registered by email and later
 * linked Google, or whose profile row predates the trigger, would never get their
 * name. Running this on every callback fixes both.
 *
 * Existing values win: if someone has edited their name on /profile we don't
 * overwrite it with Google's version on the next sign-in.
 */
export const syncProfileFromProvider = async (
  supabase: SupabaseClient,
  user: User,
): Promise<void> => {
  const identity = readProviderIdentity(user);

  if (!identity.fullName && !identity.avatarUrl) {
    return;
  }

  try {
    const { data: existing } = await supabase
      .from("profiles")
      .select("full_name,avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const patch: Record<string, string> = { id: user.id };

    if (identity.fullName && !existing?.full_name?.trim()) {
      patch.full_name = identity.fullName;
    }
    if (identity.avatarUrl && !existing?.avatar_url?.trim()) {
      patch.avatar_url = identity.avatarUrl;
    }

    // Nothing to fill in beyond the id.
    if (Object.keys(patch).length === 1 && existing) {
      return;
    }

    await supabase.from("profiles").upsert(patch, { onConflict: "id" });
  } catch {
    // Never block sign-in on profile enrichment.
  }
};
