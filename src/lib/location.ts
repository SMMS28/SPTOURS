import { z } from "zod";

const locationSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  locationAccuracyM: z.coerce.number().min(0).max(1_000_000).optional(),
});

export type LeadLocation = {
  latitude: number;
  longitude: number;
  location_accuracy_m: number | null;
  location_consent_at: string;
};

/**
 * Reads the optional coordinates posted by <LocationConsent />.
 *
 * Returns null unless the visitor explicitly consented, so a client that sends
 * coordinates without the consent flag is ignored rather than trusted.
 */
export const parseLeadLocation = (formData: FormData): LeadLocation | null => {
  if (String(formData.get("locationConsent") ?? "") !== "1") {
    return null;
  }

  const parsed = locationSchema.safeParse({
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    locationAccuracyM: formData.get("locationAccuracyM") ?? undefined,
  });

  if (!parsed.success) {
    return null;
  }

  return {
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    location_accuracy_m: parsed.data.locationAccuracyM ?? null,
    location_consent_at: new Date().toISOString(),
  };
};

/**
 * True when Postgres rejected a write because migration 0008 hasn't been applied.
 * Callers retry without the location fields so a lead is never lost to a pending
 * migration.
 */
export const isMissingLocationColumn = (message: string | undefined | null) =>
  Boolean(message && /(column|schema cache).*(latitude|longitude|location_)/i.test(message));

/**
 * True when Postgres rejected a statement because a column doesn't exist at all
 * (42703) — i.e. a migration this code expects hasn't been applied. Used to retry
 * with a reduced payload rather than failing the user's action.
 */
export const isMissingColumn = (
  error: { code?: string | null; message?: string | null } | null | undefined,
) =>
  Boolean(
    error &&
      (error.code === "42703" ||
        (error.message && /(column .* does not exist|schema cache)/i.test(error.message))),
  );
