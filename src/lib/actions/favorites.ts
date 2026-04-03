"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const favoriteSchema = z.object({
  packageId: z.string().uuid(),
  packageSlug: z.string().min(2),
  nextPath: z.string().min(1),
});

export const toggleFavoritePackage = async (formData: FormData) => {
  const parsed = favoriteSchema.safeParse({
    packageId: formData.get("packageId"),
    packageSlug: formData.get("packageSlug"),
    nextPath: formData.get("nextPath") || `/packages/${String(formData.get("packageSlug") ?? "").trim()}`,
  });

  if (!parsed.success) {
    redirect("/packages");
  }

  const fallbackRedirect = parsed.data.nextPath;

  if (!hasSupabaseEnv) {
    redirect(`${fallbackRedirect}?saved=disabled`);
  }

  const user = await getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(fallbackRedirect);
    redirect(`/login?message=${encodeURIComponent("Please sign in to save packages.")}&next=${next}`);
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("package_id", parsed.data.packageId)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    revalidatePath("/profile");
    redirect(`${fallbackRedirect}?saved=removed`);
  }

  await supabase.from("favorites").insert({
    user_id: user.id,
    package_id: parsed.data.packageId,
  });

  revalidatePath("/profile");
  redirect(`${fallbackRedirect}?saved=added`);
};