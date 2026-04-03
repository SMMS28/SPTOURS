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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const adminEmail = "Sptoursrjy@gmail.com";
const adminPassword = "Sptours@2026";

const run = async () => {
  const admin = createClient(url, key);

  const signIn = await admin.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (signIn.error) {
    console.error("Admin sign-in failed:", signIn.error.message);
    process.exit(1);
  }

  const createdBy = signIn.data.user?.id;
  if (!createdBy) {
    console.error("No user id from admin sign-in");
    process.exit(1);
  }

  const slug = `smoke-test-${Date.now()}`;

  const insertRes = await admin.from("packages").insert({
    title: "Smoke Test Package",
    slug,
    destination: "Goa",
    location: "India",
    cover_image: "/images/p1.jpg",
    short_description: "Smoke test package created by automated verification.",
    description: "Temporary test record for CRUD validation.",
    duration_days: 3,
    price_inr: 12345,
    inclusions: ["Hotel", "Breakfast"],
    is_published: true,
    created_by: createdBy,
  });

  if (insertRes.error) {
    console.error("Create failed:", insertRes.error.message);
    process.exit(1);
  }

  const publicClient = createClient(url, key);

  const publicRead = await publicClient
    .from("packages")
    .select("id,title,slug,is_published")
    .eq("slug", slug)
    .maybeSingle();

  if (publicRead.error) {
    console.error("Public read failed:", publicRead.error.message);
    process.exit(1);
  }

  if (!publicRead.data) {
    console.error("Public read failed: record not visible");
    process.exit(1);
  }

  const packageId = publicRead.data.id;

  const imageInsert = await admin.from("package_images").insert([
    {
      package_id: packageId,
      storage_path: "/images/p1.jpg",
      sort_order: 1,
    },
    {
      package_id: packageId,
      storage_path: "/images/p2.jpg",
      sort_order: 2,
    },
  ]);

  if (imageInsert.error) {
    console.error("Package images insert failed:", imageInsert.error.message);
    process.exit(1);
  }

  const itineraryInsert = await admin.from("package_itinerary_days").insert([
    {
      package_id: packageId,
      day_number: 1,
      title: "Arrival",
      details: "Arrive and transfer to hotel.",
    },
    {
      package_id: packageId,
      day_number: 2,
      title: "Sightseeing",
      details: "Full-day local sightseeing tour.",
    },
  ]);

  if (itineraryInsert.error) {
    console.error("Itinerary insert failed:", itineraryInsert.error.message);
    process.exit(1);
  }

  const extrasRead = await admin
    .from("packages")
    .select(
      "id,package_images(id,storage_path,sort_order),package_itinerary_days(id,day_number,title,details)",
    )
    .eq("id", packageId)
    .maybeSingle();

  if (extrasRead.error) {
    console.error("Extras read failed:", extrasRead.error.message);
    process.exit(1);
  }

  if (!extrasRead.data) {
    console.error("Extras read failed: package not found");
    process.exit(1);
  }

  if (
    !extrasRead.data.package_images ||
    extrasRead.data.package_images.length !== 2
  ) {
    console.error("Extras read failed: package images not saved correctly");
    process.exit(1);
  }

  if (
    !extrasRead.data.package_itinerary_days ||
    extrasRead.data.package_itinerary_days.length !== 2
  ) {
    console.error("Extras read failed: itinerary days not saved correctly");
    process.exit(1);
  }

  const updateRes = await admin
    .from("packages")
    .update({ title: "Smoke Test Package Updated" })
    .eq("slug", slug);

  if (updateRes.error) {
    console.error("Update failed:", updateRes.error.message);
    process.exit(1);
  }

  const deleteRes = await admin.from("packages").delete().eq("slug", slug);

  if (deleteRes.error) {
    console.error("Delete failed:", deleteRes.error.message);
    process.exit(1);
  }

  const postDeleteRead = await admin
    .from("packages")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (postDeleteRead.error && !/Results contain 0 rows/i.test(postDeleteRead.error.message)) {
    console.error("Post-delete check failed:", postDeleteRead.error.message);
    process.exit(1);
  }

  if (postDeleteRead.data) {
    console.error("Delete failed: record still exists");
    process.exit(1);
  }

  const extrasAfterDelete = await admin
    .from("package_images")
    .select("id")
    .eq("package_id", packageId)
    .limit(1);

  if (extrasAfterDelete.error) {
    console.error(
      "Post-delete image check failed:",
      extrasAfterDelete.error.message,
    );
    process.exit(1);
  }

  if ((extrasAfterDelete.data ?? []).length > 0) {
    console.error("Delete failed: package images still exist");
    process.exit(1);
  }

  const itineraryAfterDelete = await admin
    .from("package_itinerary_days")
    .select("id")
    .eq("package_id", packageId)
    .limit(1);

  if (itineraryAfterDelete.error) {
    console.error(
      "Post-delete itinerary check failed:",
      itineraryAfterDelete.error.message,
    );
    process.exit(1);
  }

  if ((itineraryAfterDelete.data ?? []).length > 0) {
    console.error("Delete failed: itinerary days still exist");
    process.exit(1);
  }

  console.log(
    "Smoke test passed: admin sign-in, package CRUD, images CRUD, itinerary CRUD",
  );
};

await run();
