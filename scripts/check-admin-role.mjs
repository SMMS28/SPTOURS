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
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const email = requireEnv("ADMIN_EMAIL");
const password = requireEnv("ADMIN_PASSWORD");

if (!url || !key) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(url, key);

const signInRes = await supabase.auth.signInWithPassword({ email, password });
if (signInRes.error) {
  console.error("Sign-in failed:", signInRes.error.message);
  process.exit(1);
}

const userId = signInRes.data.user?.id;
if (!userId) {
  console.error("No user id from sign-in");
  process.exit(1);
}

const { data, error } = await supabase
  .from("profiles")
  .select("id, role")
  .eq("id", userId)
  .maybeSingle();

if (error) {
  console.error("Profile query failed:", error.message);
  process.exit(1);
}

console.log("Signed in user:", signInRes.data.user.email);
console.log("Profile:", data);
