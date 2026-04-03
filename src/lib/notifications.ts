import { getSiteUrl } from "@/lib/env";

type BookingNotificationPayload = {
  bookingId: string;
  bookingReference: string;
  packageId: string;
  packageTitle: string;
  packageSlug: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone?: string | null;
  travelDate: string;
  travelersCount: number;
  totalAmount: number;
  referralCode?: string | null;
};

const postJson = async (url: string | undefined, body: Record<string, unknown>) => {
  if (!url) {
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Notification webhook failed", {
        url,
        status: response.status,
      });
    }
  } catch (error) {
    console.error("Notification webhook error", {
      url,
      error,
    });
  }
};

export const sendBookingNotifications = async (payload: BookingNotificationPayload) => {
  const packageUrl = `${getSiteUrl()}/packages/${payload.packageSlug}`;

  await Promise.all([
    postJson(process.env.BOOKING_EMAIL_WEBHOOK_URL, {
      channel: "booking-email",
      template: "booking_confirmation",
      to: payload.travelerEmail,
      booking: payload,
      packageUrl,
      subject: `Booking Confirmation ${payload.bookingReference}`,
    }),
    postJson(process.env.BOOKING_SMS_WEBHOOK_URL, {
      channel: "booking-sms",
      to: payload.travelerPhone,
      bookingReference: payload.bookingReference,
      travelerName: payload.travelerName,
      packageTitle: payload.packageTitle,
      travelDate: payload.travelDate,
      travelersCount: payload.travelersCount,
    }),
    postJson(process.env.ADMIN_SLACK_WEBHOOK_URL, {
      text: `New booking ${payload.bookingReference} for ${payload.packageTitle}`,
      booking: payload,
      packageUrl,
    }),
    postJson(process.env.ADMIN_EMAIL_WEBHOOK_URL, {
      channel: "admin-email",
      template: "new_booking_alert",
      booking: payload,
      packageUrl,
      subject: `New booking received: ${payload.bookingReference}`,
    }),
  ]);
};