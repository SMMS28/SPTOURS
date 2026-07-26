"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentProfileRole } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { sendBookingNotifications } from "@/lib/notifications";
import { createClient } from "@/lib/supabase/server";
import { isMissingLocationColumn, parseLeadLocation } from "@/lib/location";

const bookingSchema = z.object({
  packageId: z.string().uuid(),
  packageSlug: z.string().min(2),
  packageTitle: z.string().min(2),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().trim().optional(),
  travelDate: z.string().date(),
  travelersCount: z.coerce.number().int().min(1).max(20),
  message: z.string().trim().max(2000).optional(),
  referralCode: z.string().trim().max(64).optional(),
});

const bookingStatusSchema = z.enum(["pending", "confirmed", "cancelled"]);

const buildRedirectBase = (packageSlug: string) => `/packages/${packageSlug}`;

export const createBookingFromPlanner = async (formData: FormData) => {
  const packageSlug = String(formData.get("packageSlug") ?? "").trim();
  const baseRedirect = buildRedirectBase(packageSlug || "packages");

  const parsed = bookingSchema.safeParse({
    packageId: formData.get("packageId"),
    packageSlug,
    packageTitle: formData.get("packageTitle"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    travelDate: formData.get("travelDate"),
    travelersCount: formData.get("travelersCount"),
    message: formData.get("message") || undefined,
    referralCode: formData.get("referralCode") || undefined,
  });

  if (!parsed.success) {
    redirect(`${baseRedirect}?booking=invalid`);
  }

  if (!hasSupabaseEnv) {
    redirect(`${baseRedirect}?booking=sent`);
  }

  const user = await getCurrentUser();
  if (!user) {
    const next = encodeURIComponent(`${baseRedirect}?travelDate=${parsed.data.travelDate}&travelers=${parsed.data.travelersCount}`);
    redirect(`/login?message=${encodeURIComponent("Please sign in to continue booking.")}&next=${next}`);
  }

  const supabase = await createClient();

  const { data: selectedPackage, error: packageError } = await supabase
    .from("packages")
    .select("id,title,slug,price_inr")
    .eq("id", parsed.data.packageId)
    .maybeSingle();

  if (packageError || !selectedPackage) {
    redirect(`${baseRedirect}?booking=invalid_package`);
  }

  const totalAmount = Number(selectedPackage.price_inr) * parsed.data.travelersCount;
  const bookingReference = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;

  const baseBooking = {
    user_id: user.id,
    package_id: parsed.data.packageId,
    travelers_count: parsed.data.travelersCount,
    travel_date: parsed.data.travelDate,
    total_amount: totalAmount,
    status: "pending",
    booking_reference: bookingReference,
    referral_code: parsed.data.referralCode || null,
  };

  // Optional, explicitly consented coordinates (migration 0008).
  const location = parseLeadLocation(formData);

  let { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({ ...baseBooking, ...(location ?? {}) })
    .select("id,booking_reference")
    .single();

  // Don't drop a booking because migration 0008 is still pending.
  if (isMissingLocationColumn(bookingError?.message)) {
    const retry = await supabase
      .from("bookings")
      .insert(baseBooking)
      .select("id,booking_reference")
      .single();
    booking = retry.data;
    bookingError = retry.error;
  }

  if (bookingError || !booking) {
    console.error("Booking insert failed", bookingError);
    redirect(`${baseRedirect}?booking=error`);
  }

  const inquiryMessage = [
    parsed.data.message?.trim() || "New booking request from package planner.",
    `Travel date: ${parsed.data.travelDate}`,
    `Travelers: ${parsed.data.travelersCount}`,
    `Booking ref: ${booking.booking_reference}`,
  ]
    .filter(Boolean)
    .join("\n");

  const { error: inquiryError } = await supabase.from("inquiries").insert({
    package_id: parsed.data.packageId,
    booking_id: booking.id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: inquiryMessage,
    travel_date: parsed.data.travelDate,
    travelers_count: parsed.data.travelersCount,
    source: "booking_planner",
    user_id: user.id,
    status: "new",
  });

  if (inquiryError) {
    console.error("Inquiry insert for booking failed", inquiryError);
  }

  await sendBookingNotifications({
    bookingId: booking.id,
    bookingReference: booking.booking_reference,
    packageId: parsed.data.packageId,
    packageTitle: selectedPackage.title,
    packageSlug: selectedPackage.slug,
    travelerName: parsed.data.fullName,
    travelerEmail: parsed.data.email,
    travelerPhone: parsed.data.phone,
    travelDate: parsed.data.travelDate,
    travelersCount: parsed.data.travelersCount,
    totalAmount,
    referralCode: parsed.data.referralCode || null,
  });

  revalidatePath("/profile");
  revalidatePath(`/packages/${selectedPackage.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");

  redirect(`${baseRedirect}?booking=success&ref=${encodeURIComponent(booking.booking_reference)}`);
};

export const updateBookingStatus = async (formData: FormData) => {
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const status = bookingStatusSchema.safeParse(String(formData.get("status") ?? "").trim());

  if (!bookingId || !status.success) {
    return;
  }

  const role = await getCurrentProfileRole();
  if (role !== "admin") {
    return;
  }

  if (!hasSupabaseEnv) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("bookings").update({ status: status.data }).eq("id", bookingId);

  revalidatePath("/admin");
  revalidatePath("/admin/bookings");
  revalidatePath("/profile");
};