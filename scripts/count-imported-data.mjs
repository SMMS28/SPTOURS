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

const supabase = createClient(url, key);

const [{ count: packageCount, error: packageErr }, { count: itineraryCount, error: itineraryErr }] =
  await Promise.all([
    supabase.from("packages").select("id", { head: true, count: "exact" }),
    supabase.from("package_itinerary_days").select("id", { head: true, count: "exact" }),
  ]);

if (packageErr) {
  console.error("Package count failed:", packageErr.message);
  process.exit(1);
}

if (itineraryErr) {
  console.error("Itinerary count failed:", itineraryErr.message);
  process.exit(1);
}

console.log(JSON.stringify({ packageCount, itineraryCount }, null, 2));
