"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentProfileRole } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const inquirySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  packageId: z.string().uuid().optional(),
});

const inquiryStatusSchema = z.enum(["new", "in_progress", "closed"]);

const isAdminUser = async () => {
  const role = await getCurrentProfileRole();
  return role === "admin";
};

export const submitInquiry = async (formData: FormData) => {
  const packageId = String(formData.get("packageId") ?? "").trim();

  const parsed = inquirySchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    packageId: packageId || undefined,
  });

  if (!parsed.success) {
    redirect("/contact?status=invalid");
  }

  if (!hasSupabaseEnv) {
    redirect("/contact?status=sent");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const basePayload = {
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.message,
    package_id: parsed.data.packageId || null,
    status: "new",
  };

  const dedupeClient = createServiceClient() ?? supabase;
  const dedupeWindow = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  let duplicateQuery = dedupeClient
    .from("inquiries")
    .select("id")
    .eq("email", parsed.data.email)
    .eq("message", parsed.data.message)
    .gte("created_at", dedupeWindow)
    .limit(1);

  duplicateQuery = parsed.data.packageId
    ? duplicateQuery.eq("package_id", parsed.data.packageId)
    : duplicateQuery.is("package_id", null);

  const { data: duplicateData } = await duplicateQuery;

  if ((duplicateData?.length ?? 0) > 0) {
    redirect("/contact?status=sent");
  }

  let { error } = await supabase.from("inquiries").insert({
    ...basePayload,
    user_id: user?.id ?? null,
  });

  if (error?.code === "23503" || /foreign key/i.test(error?.message ?? "")) {
    const retry = await supabase.from("inquiries").insert({
      ...basePayload,
      user_id: null,
    });
    error = retry.error;
  }

  if (error) {
    console.error("Inquiry insert failed", {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    redirect("/contact?status=error");
  }

  redirect("/contact?status=sent");
};

export const updateInquiryStatus = async (formData: FormData) => {
  if (!(await isAdminUser())) {
    return;
  }

  if (!hasSupabaseEnv) {
    return;
  }

  const inquiryId = String(formData.get("inquiryId") ?? "").trim();
  const nextStatus = inquiryStatusSchema.safeParse(String(formData.get("status") ?? "").trim());

  if (!inquiryId || !nextStatus.success) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status: nextStatus.data })
    .eq("id", inquiryId);

  if (error) {
    console.error("Inquiry status update failed", {
      code: error.code,
      message: error.message,
    });
  }

  revalidatePath("/admin/inquiries");
};

export const deleteInquiry = async (formData: FormData) => {
  if (!(await isAdminUser())) {
    return;
  }

  if (!hasSupabaseEnv) {
    return;
  }

  const inquiryId = String(formData.get("inquiryId") ?? "").trim();
  if (!inquiryId) {
    return;
  }

  const serviceSupabase = createServiceClient();
  if (serviceSupabase) {
    const { error } = await serviceSupabase.from("inquiries").delete().eq("id", inquiryId);

    if (error) {
      console.error("Inquiry delete failed (service)", {
        code: error.code,
        message: error.message,
      });
    }

    revalidatePath("/admin/inquiries");
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").delete().eq("id", inquiryId);

  if (error) {
    console.error("Inquiry delete failed", {
      code: error.code,
      message: error.message,
    });
  }

  revalidatePath("/admin/inquiries");
};
