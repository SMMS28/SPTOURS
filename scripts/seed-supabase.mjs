import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...rest] = trimmed.split("=");
    process.env[key] = rest.join("=");
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || (!serviceRoleKey && !publishableKey)) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and usable Supabase key (service role or publishable)",
  );
  process.exit(1);
}

const datasetPath = path.join(__dirname, "..", "..", "north_east_packages_full_data.json");
if (!fs.existsSync(datasetPath)) {
  console.error(`Dataset file not found at ${datasetPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(datasetPath, "utf8");
const parsed = JSON.parse(raw);
const rows = Array.isArray(parsed) ? parsed : parsed.packages;

if (!Array.isArray(rows) || rows.length === 0) {
  console.error("No package rows found in dataset");
  process.exit(1);
}

const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const normalizeInclusions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
  return String(value)
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
};

const supabase = createClient(supabaseUrl, serviceRoleKey || publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

if (!serviceRoleKey) {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "Sptoursrjy@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Sptours@2026";
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (signInError || !signInData.user) {
    console.error(
      "Service role key missing, and admin sign-in fallback failed:",
      signInError?.message || "Unknown auth error",
    );
    process.exit(1);
  }
}

const payload = rows
  .map((row, index) => {
    const title = String(row.title || row.package_title || "").trim();
    const slug = toSlug(row.slug || title || `package-${index + 1}`);
    const destination = String(row.destination || row.state || "North East").trim();
    const location = String(row.location || row.country || "India").trim();
    const durationDays = Number(row.duration_days || row.days || 5);
    const price = Number(row.price_inr || row.price || 0);

    if (!title || !slug || !destination || !location || !Number.isFinite(durationDays)) {
      return null;
    }

    return {
      title,
      slug,
      destination,
      location,
      tags_type: row.tags_type ? String(row.tags_type).trim() : null,
      external_link: row.external_link ? String(row.external_link).trim() : null,
      raw_duration: row.raw_duration ? String(row.raw_duration).trim() : null,
      source_category: row.source_category ? String(row.source_category).trim() : "Northeast Packages",
      cover_image: row.cover_image ? String(row.cover_image).trim() : null,
      duration_days: Math.max(1, Math.round(durationDays)),
      price_inr: Number.isFinite(price) ? Math.max(0, price) : 0,
      short_description: String(row.short_description || row.description || title).trim().slice(0, 400),
      description: row.description ? String(row.description).trim() : null,
      inclusions: normalizeInclusions(row.inclusions),
      is_published: true,
    };
  })
  .filter(Boolean);

const chunkSize = 200;
let inserted = 0;

for (let offset = 0; offset < payload.length; offset += chunkSize) {
  const chunk = payload.slice(offset, offset + chunkSize);
  const { error } = await supabase.from("packages").upsert(chunk, { onConflict: "slug" });

  if (error) {
    console.error("Upsert failed", { offset, message: error.message });
    process.exit(1);
  }

  inserted += chunk.length;
}

console.log(`Seed complete. Upserted ${inserted} packages.`);