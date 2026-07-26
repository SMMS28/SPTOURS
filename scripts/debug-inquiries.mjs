import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Credentials come from the environment. They used to be hardcoded here, which
// published a working admin password to a public repository.
const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var ${name}. Set it before running this script.`);
    process.exit(1);
  }
  return value;
};


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
  console.error("❌ Missing Supabase env vars");
  process.exit(1);
}

const adminEmail = requireEnv("ADMIN_EMAIL");
const adminPassword = requireEnv("ADMIN_PASSWORD");

const logResult = (label, res) => {
  if (res.error) {
    console.log(`❌ ${label} error:`);
    console.log("   message:", res.error.message);
    console.log("   code:", res.error.code ?? "n/a");
    console.log("   details:", res.error.details ?? "n/a");
    return;
  }

  console.log(`✅ ${label} ok`);
  if (typeof res.count === "number") {
    console.log("   count:", res.count);
  }
  if (Array.isArray(res.data)) {
    console.log("   rows:", res.data.length);
  }
};

const run = async () => {
  const anonClient = createClient(url, key);

  console.log("\n--- Schema checks (anonymous) ---");
  const countAnon = await anonClient
    .from("inquiries")
    .select("id", { count: "exact", head: true });
  logResult("Anonymous inquiries count", countAnon);

  console.log("\n--- Insert check (anonymous) ---");
  const anonInsert = await anonClient.from("inquiries").insert({
    full_name: "Diag Anonymous",
    email: "diag-anon@example.com",
    phone: "9999999999",
    message: "Diagnostic anonymous inquiry insert check",
    package_id: null,
    user_id: null,
    status: "new",
  });
  logResult("Anonymous inquiry insert", anonInsert);

  console.log("\n--- Admin auth + insert check ---");
  const adminClient = createClient(url, key);
  const signInRes = await adminClient.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (signInRes.error) {
    console.log("❌ Admin sign-in failed:", signInRes.error.message);
    process.exit(1);
  }

  const adminInsert = await adminClient.from("inquiries").insert({
    full_name: "Diag Admin",
    email: "diag-admin@example.com",
    phone: "8888888888",
    message: "Diagnostic admin inquiry insert check",
    package_id: null,
    user_id: signInRes.data.user?.id ?? null,
    status: "new",
  });
  logResult("Admin inquiry insert", adminInsert);

  console.log("\n--- Admin read check ---");
  const adminRead = await adminClient
    .from("inquiries")
    .select("id, full_name, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  logResult("Admin inquiries read", adminRead);

  if (adminRead.data?.length) {
    console.log("   latest:", adminRead.data[0]);
  }
};

await run();
