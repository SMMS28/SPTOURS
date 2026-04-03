"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const storageBucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "package-media";

const packageSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().optional(),
  destination: z.string().trim().min(2),
  location: z.string().trim().min(2),
  tagsType: z.string().trim().optional(),
  externalLink: z.string().trim().optional(),
  rawDuration: z.string().trim().optional(),
  sourceCategory: z.string().trim().optional(),
  durationDays: z.coerce.number().int().positive(),
  priceInr: z.coerce.number().nonnegative(),
  shortDescription: z.string().trim().min(3),
  description: z.string().trim().optional(),
  coverImage: z.string().trim().optional(),
  inclusions: z.array(z.string().trim().min(1)).default([]),
  isPublished: z.boolean().default(true),
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
    redirect("/admin/packages?message=Add%20Supabase%20env%20variables%20to%20enable%20admin%20CRUD.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (data?.role !== "admin") {
    redirect("/");
  }

  return { supabase, userId: user.id };
};

const parseInclusions = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parsePhotoUrls = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== "string") {
    return [] as string[];
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);
};

const parseItineraryJsonRows = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== "string") {
    return [] as { day_number: number; title: string; details: string }[];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((row) => ({
        day_number: Number((row as { day_number?: number }).day_number),
        title: String((row as { title?: string }).title ?? "").trim(),
        details: String((row as { details?: string }).details ?? "").trim(),
      }))
      .filter((row) => Number.isInteger(row.day_number) && row.day_number > 0 && row.title && row.details)
      .sort((a, b) => a.day_number - b.day_number);
  } catch {
    return [];
  }
};

const parseItineraryRows = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== "string") {
    return [] as { day_number: number; title: string; details: string }[];
  }

  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [dayPart, titlePart, detailsPart] = line.split("|").map((part) => part?.trim() ?? "");
      const day_number = Number(dayPart);
      return {
        day_number,
        title: titlePart,
        details: detailsPart,
      };
    })
    .filter((row) => Number.isInteger(row.day_number) && row.day_number > 0 && row.title && row.details)
    .sort((a, b) => a.day_number - b.day_number);
};

const parsePackageInput = (formData: FormData) => {
  return packageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    destination: formData.get("destination"),
    location: formData.get("location"),
    tagsType: formData.get("tagsType") || undefined,
    externalLink: formData.get("externalLink") || undefined,
    rawDuration: formData.get("rawDuration") || undefined,
    sourceCategory: formData.get("sourceCategory") || undefined,
    durationDays: formData.get("durationDays"),
    priceInr: formData.get("priceInr"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description") || undefined,
    coverImage: formData.get("coverImage") || undefined,
    inclusions: parseInclusions(formData.get("inclusions")),
    isPublished: formData.get("isPublished") === "on",
  });
};

const getFiles = (values: FormDataEntryValue[]) => {
  return values
    .filter((value): value is File => value instanceof File)
    .filter((file) => file.size > 0);
};

const sanitizeFileName = (fileName: string) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

const uploadFileToStorage = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  folder: string,
) => {
  const fileName = sanitizeFileName(file.name || "image.jpg") || "image.jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}-${fileName}`;

  const { error } = await supabase.storage.from(storageBucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) {
    return { error };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(storageBucket).getPublicUrl(path);

  return { publicUrl };
};

const uploadManyFiles = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  files: File[],
  folder: string,
) => {
  const uploaded: string[] = [];

  for (const file of files) {
    const result = await uploadFileToStorage(supabase, file, folder);
    if ("error" in result && result.error) {
      return { error: result.error, uploaded };
    }
    uploaded.push(result.publicUrl);
  }

  return { uploaded };
};

const resolveUniqueSlug = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string,
  currentPackageId?: string,
) => {
  let candidate = baseSlug;

  for (let index = 0; index < 50; index += 1) {
    const { data } = await supabase
      .from("packages")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data || data.id === currentPackageId) {
      return candidate;
    }

    candidate = `${baseSlug}-${index + 2}`;
  }

  return `${baseSlug}-${Date.now()}`;
};

export const createPackage = async (formData: FormData) => {
  const parsed = parsePackageInput(formData);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please fill all required fields correctly.";
    redirect(`/admin/packages/new?message=${encodeURIComponent(message)}`);
  }

  const normalizedSlugBase = toSlug(parsed.data.slug || parsed.data.title);

  if (!normalizedSlugBase || normalizedSlugBase.length < 3) {
    redirect("/admin/packages/new?message=Please%20enter%20a%20valid%20title%20or%20slug.");
  }

  const { supabase, userId } = await requireAdmin();
  const normalizedSlug = await resolveUniqueSlug(supabase, normalizedSlugBase);
  const manualPhotoUrls = parsePhotoUrls(formData.get("photoUrls"));
  const photoFiles = getFiles(formData.getAll("photoFiles"));
  const coverPhotoFile = getFiles([formData.get("coverPhotoFile") ?? ""])[0];
  const warnings: string[] = [];

  const itineraryRows = [
    ...parseItineraryJsonRows(formData.get("itineraryJson")),
    ...parseItineraryRows(formData.get("itinerary")),
  ]
    .filter((row, index, list) => list.findIndex((item) => item.day_number === row.day_number) === index)
    .sort((a, b) => a.day_number - b.day_number);

  let uploadedCoverImage = parsed.data.coverImage || null;
  if (coverPhotoFile) {
    const uploadCoverResult = await uploadFileToStorage(supabase, coverPhotoFile, "cover");
    if ("error" in uploadCoverResult && uploadCoverResult.error) {
      warnings.push(`Cover upload skipped: ${uploadCoverResult.error.message}`);
    } else {
      uploadedCoverImage = uploadCoverResult.publicUrl;
    }
  }

  const uploadedGalleryResult = await uploadManyFiles(supabase, photoFiles, "gallery");
  if ("error" in uploadedGalleryResult && uploadedGalleryResult.error) {
    warnings.push(`Some gallery uploads were skipped: ${uploadedGalleryResult.error.message}`);
  }

  const photoUrls = [...manualPhotoUrls, ...uploadedGalleryResult.uploaded].slice(0, 10);

  const { data: insertedPackage, error } = await supabase
    .from("packages")
    .insert({
    title: parsed.data.title,
    slug: normalizedSlug,
    destination: parsed.data.destination,
    location: parsed.data.location,
    tags_type: parsed.data.tagsType || null,
    external_link: parsed.data.externalLink || null,
    raw_duration: parsed.data.rawDuration || null,
    source_category: parsed.data.sourceCategory || null,
    duration_days: parsed.data.durationDays,
    price_inr: parsed.data.priceInr,
    short_description: parsed.data.shortDescription,
    description: parsed.data.description ?? null,
    cover_image: uploadedCoverImage,
    inclusions: parsed.data.inclusions,
    is_published: parsed.data.isPublished,
    created_by: userId,
    })
    .select("id")
    .single();

  if (error && /column|schema cache/i.test(error.message)) {
    const retry = await supabase
      .from("packages")
      .insert({
        title: parsed.data.title,
        slug: normalizedSlug,
        destination: parsed.data.destination,
        location: parsed.data.location,
        duration_days: parsed.data.durationDays,
        price_inr: parsed.data.priceInr,
        short_description: parsed.data.shortDescription,
        description: parsed.data.description ?? null,
        cover_image: uploadedCoverImage,
        inclusions: parsed.data.inclusions,
        is_published: parsed.data.isPublished,
        created_by: userId,
      })
      .select("id")
      .single();

    if (retry.error) {
      redirect(`/admin/packages/new?message=${encodeURIComponent(retry.error.message)}`);
    }

    if (!retry.data?.id) {
      redirect("/admin/packages/new?message=Package%20create%20failed.%20Please%20try%20again.");
    }

    const insertedPackageId = retry.data.id;

    if (photoUrls.length > 0) {
      const { error: photoError } = await supabase.from("package_images").insert(
        photoUrls.map((url, index) => ({
          package_id: insertedPackageId,
          storage_path: url,
          sort_order: index,
        })),
      );

      if (photoError) {
        redirect(`/admin/packages/new?message=${encodeURIComponent(photoError.message)}`);
      }
    }

    if (itineraryRows.length > 0) {
      const { error: itineraryError } = await supabase.from("package_itinerary_days").insert(
        itineraryRows.map((row) => ({
          package_id: insertedPackageId,
          day_number: row.day_number,
          title: row.title,
          details: row.details,
        })),
      );

      if (itineraryError) {
        redirect(`/admin/packages/new?message=${encodeURIComponent(itineraryError.message)}`);
      }
    }

    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath("/admin/packages");
    const successMessage = warnings.length
      ? `Package created with warnings. ${warnings.join(" ")}`
      : "Package created successfully.";
    redirect(`/admin/packages?message=${encodeURIComponent(successMessage)}`);
  }

  if (error) {
    redirect(`/admin/packages/new?message=${encodeURIComponent(error.message)}`);
  }

  if (photoUrls.length > 0 && insertedPackage?.id) {
    const { error: photoError } = await supabase.from("package_images").insert(
      photoUrls.map((url, index) => ({
        package_id: insertedPackage.id,
        storage_path: url,
        sort_order: index,
      })),
    );

    if (photoError) {
      redirect(`/admin/packages/new?message=${encodeURIComponent(photoError.message)}`);
    }
  }

  if (itineraryRows.length > 0 && insertedPackage?.id) {
    const { error: itineraryError } = await supabase.from("package_itinerary_days").insert(
      itineraryRows.map((row) => ({
        package_id: insertedPackage.id,
        day_number: row.day_number,
        title: row.title,
        details: row.details,
      })),
    );

    if (itineraryError) {
      redirect(`/admin/packages/new?message=${encodeURIComponent(itineraryError.message)}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/admin/packages");
  const successMessage = warnings.length
    ? `Package created with warnings. ${warnings.join(" ")}`
    : "Package created successfully.";
  redirect(`/admin/packages?message=${encodeURIComponent(successMessage)}`);
};

export const updatePackage = async (formData: FormData) => {
  const packageId = formData.get("packageId");

  if (!packageId || typeof packageId !== "string") {
    redirect("/admin/packages?message=Invalid%20package%20id.");
  }

  const parsed = parsePackageInput(formData);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please fill all required fields correctly.";
    redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(message)}`);
  }

  const normalizedSlugBase = toSlug(parsed.data.slug || parsed.data.title);

  if (!normalizedSlugBase || normalizedSlugBase.length < 3) {
    redirect(`/admin/packages/${packageId}/edit?message=Please%20enter%20a%20valid%20title%20or%20slug.`);
  }

  const { supabase } = await requireAdmin();
  const normalizedSlug = await resolveUniqueSlug(supabase, normalizedSlugBase, packageId);
  const manualPhotoUrls = parsePhotoUrls(formData.get("photoUrls"));
  const photoFiles = getFiles(formData.getAll("photoFiles"));
  const coverPhotoFile = getFiles([formData.get("coverPhotoFile") ?? ""])[0];
  const warnings: string[] = [];

  const itineraryRows = [
    ...parseItineraryJsonRows(formData.get("itineraryJson")),
    ...parseItineraryRows(formData.get("itinerary")),
  ]
    .filter((row, index, list) => list.findIndex((item) => item.day_number === row.day_number) === index)
    .sort((a, b) => a.day_number - b.day_number);

  let uploadedCoverImage = parsed.data.coverImage || null;
  if (coverPhotoFile) {
    const uploadCoverResult = await uploadFileToStorage(supabase, coverPhotoFile, "cover");
    if ("error" in uploadCoverResult && uploadCoverResult.error) {
      warnings.push(`Cover upload skipped: ${uploadCoverResult.error.message}`);
    } else {
      uploadedCoverImage = uploadCoverResult.publicUrl;
    }
  }

  const uploadedGalleryResult = await uploadManyFiles(supabase, photoFiles, "gallery");
  if ("error" in uploadedGalleryResult && uploadedGalleryResult.error) {
    warnings.push(`Some gallery uploads were skipped: ${uploadedGalleryResult.error.message}`);
  }

  const photoUrls = [...manualPhotoUrls, ...uploadedGalleryResult.uploaded].slice(0, 10);

  const { error } = await supabase
    .from("packages")
    .update({
      title: parsed.data.title,
      slug: normalizedSlug,
      destination: parsed.data.destination,
      location: parsed.data.location,
      tags_type: parsed.data.tagsType || null,
      external_link: parsed.data.externalLink || null,
      raw_duration: parsed.data.rawDuration || null,
      source_category: parsed.data.sourceCategory || null,
      duration_days: parsed.data.durationDays,
      price_inr: parsed.data.priceInr,
      short_description: parsed.data.shortDescription,
      description: parsed.data.description ?? null,
      cover_image: uploadedCoverImage,
      inclusions: parsed.data.inclusions,
      is_published: parsed.data.isPublished,
    })
    .eq("id", packageId);

  if (error && /column|schema cache/i.test(error.message)) {
    const retry = await supabase
      .from("packages")
      .update({
        title: parsed.data.title,
        slug: normalizedSlug,
        destination: parsed.data.destination,
        location: parsed.data.location,
        duration_days: parsed.data.durationDays,
        price_inr: parsed.data.priceInr,
        short_description: parsed.data.shortDescription,
        description: parsed.data.description ?? null,
        cover_image: uploadedCoverImage,
        inclusions: parsed.data.inclusions,
        is_published: parsed.data.isPublished,
      })
      .eq("id", packageId);

    if (retry.error) {
      redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(retry.error.message)}`);
    }
  } else if (error) {
    redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(error.message)}`);
  }

  const { error: deletePhotosError } = await supabase
    .from("package_images")
    .delete()
    .eq("package_id", packageId);

  if (deletePhotosError) {
    redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(deletePhotosError.message)}`);
  }

  const { error: deleteItineraryError } = await supabase
    .from("package_itinerary_days")
    .delete()
    .eq("package_id", packageId);

  if (deleteItineraryError) {
    redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(deleteItineraryError.message)}`);
  }

  if (photoUrls.length > 0) {
    const { error: photoError } = await supabase.from("package_images").insert(
      photoUrls.map((url, index) => ({
        package_id: packageId,
        storage_path: url,
        sort_order: index,
      })),
    );

    if (photoError) {
      redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(photoError.message)}`);
    }
  }

  if (itineraryRows.length > 0) {
    const { error: itineraryError } = await supabase.from("package_itinerary_days").insert(
      itineraryRows.map((row) => ({
        package_id: packageId,
        day_number: row.day_number,
        title: row.title,
        details: row.details,
      })),
    );

    if (itineraryError) {
      redirect(`/admin/packages/${packageId}/edit?message=${encodeURIComponent(itineraryError.message)}`);
    }
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/admin/packages");
  revalidatePath(`/packages/${normalizedSlug}`);
  const successMessage = warnings.length
    ? `Package updated with warnings. ${warnings.join(" ")}`
    : "Package updated successfully.";
  redirect(`/admin/packages?message=${encodeURIComponent(successMessage)}`);
};

export const deletePackage = async (formData: FormData) => {
  const packageId = formData.get("packageId");

  if (!packageId || typeof packageId !== "string") {
    redirect("/admin/packages?message=Invalid%20package%20id.");
  }

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("packages").delete().eq("id", packageId);

  if (error) {
    redirect(`/admin/packages?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/admin/packages");
  redirect("/admin/packages?message=Package%20deleted%20successfully.");
};
