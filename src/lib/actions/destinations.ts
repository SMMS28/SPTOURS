"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const destinationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2),
  country: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().max(3000).optional(),
  isPublished: z.boolean(),
});

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const requireAdmin = async () => {
  if (!hasSupabaseEnv) {
    redirect("/admin/destinations?message=Add%20Supabase%20env%20variables%20to%20enable%20destination%20CRUD.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return supabase;
};

const parseInput = (formData: FormData) =>
  destinationSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    country: formData.get("country"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });

export const createDestination = async (formData: FormData) => {
  const parsed = parseInput(formData);

  if (!parsed.success) {
    const message = encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid destination payload.");
    redirect(`/admin/destinations/new?message=${message}`);
  }

  const supabase = await requireAdmin();
  const slug = toSlug(parsed.data.slug || parsed.data.name);

  const { error } = await supabase.from("destinations").insert({
    name: parsed.data.name,
    country: parsed.data.country,
    slug,
    description: parsed.data.description || null,
    is_published: parsed.data.isPublished,
  });

  if (error) {
    redirect(`/admin/destinations/new?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations?message=Destination%20created%20successfully.");
};

export const updateDestination = async (formData: FormData) => {
  const parsed = parseInput(formData);

  if (!parsed.success || !parsed.data.id) {
    redirect("/admin/destinations?message=Invalid%20destination%20payload.");
  }

  const supabase = await requireAdmin();
  const slug = toSlug(parsed.data.slug || parsed.data.name);

  const { error } = await supabase
    .from("destinations")
    .update({
      name: parsed.data.name,
      country: parsed.data.country,
      slug,
      description: parsed.data.description || null,
      is_published: parsed.data.isPublished,
    })
    .eq("id", parsed.data.id);

  if (error) {
    redirect(`/admin/destinations/${parsed.data.id}/edit?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations?message=Destination%20updated%20successfully.");
};

export const deleteDestination = async (formData: FormData) => {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin/destinations?message=Invalid%20destination%20id.");
  }

  const supabase = await requireAdmin();
  const { error } = await supabase.from("destinations").delete().eq("id", id);

  if (error) {
    redirect(`/admin/destinations?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/destinations");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations?message=Destination%20deleted%20successfully.");
};