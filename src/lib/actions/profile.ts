"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(32),
  city: z.string().trim().max(80),
});

const detailsPath = (message: string) =>
  `/profile?tab=details&message=${encodeURIComponent(message)}`;

/** Backs the "Profile details" tab. Phone + city arrived in migration 0007. */
export const updateProfile = async (formData: FormData) => {
  if (!hasSupabaseEnv) {
    redirect(detailsPath("Add Supabase env variables to save profile changes."));
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=%2Fprofile");
  }

  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name") ?? "",
    phone: formData.get("phone") ?? "",
    city: formData.get("city") ?? "",
  });

  if (!parsed.success) {
    redirect(detailsPath("Enter your name — phone and city are optional."));
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      city: parsed.data.city || null,
    })
    .eq("id", user.id);

  if (error) {
    // phone/city arrive in migration 0007. Until that has been applied to the
    // project, Postgres rejects the whole statement for the unknown columns —
    // so save the name (which has always existed) rather than losing the edit,
    // and say plainly which fields didn't persist.
    if (/column|schema cache/i.test(error.message)) {
      const { error: nameOnlyError } = await supabase
        .from("profiles")
        .update({ full_name: parsed.data.full_name })
        .eq("id", user.id);

      if (nameOnlyError) {
        redirect(detailsPath(nameOnlyError.message));
      }

      revalidatePath("/profile");
      redirect(
        detailsPath(
          "Name saved. Phone and city need database migration 0007 to be applied first.",
        ),
      );
    }

    redirect(detailsPath(error.message));
  }

  revalidatePath("/profile");
  redirect(detailsPath("Profile updated."));
};
