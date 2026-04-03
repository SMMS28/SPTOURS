import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const envPath = path.join(projectRoot, ".env.local");

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

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const parseCsv = (content) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field);
      field = "";
      if (row.some((item) => item.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((item) => item.trim() !== "")) {
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = (values[idx] ?? "").trim();
    });
    return record;
  });
};

const parsePrice = (value) => {
  if (!value) {
    return 0;
  }

  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) {
    return 0;
  }

  const price = Number(cleaned);
  return Number.isFinite(price) ? price : 0;
};

const parseDurationDays = (durationText, itineraryText) => {
  const durationMatch = durationText.match(/(\d+)\s*D/i);
  if (durationMatch) {
    const value = Number(durationMatch[1]);
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
  }

  let maxDay = 0;
  for (const match of itineraryText.matchAll(/Day\s*0*(\d+)/gi)) {
    maxDay = Math.max(maxDay, Number(match[1]));
  }

  return maxDay > 0 ? maxDay : 1;
};

const parseItineraryRows = (itineraryText) => {
  if (!itineraryText) {
    return [];
  }

  const rows = itineraryText
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/Day\s*0*(\d+)\s*[-: ]\s*(.*)$/i) || line.match(/Day\s*0*(\d+)(.*)$/i);
      if (!match) {
        return null;
      }

      const day_number = Number(match[1]);
      const details = (match[2] || "").trim().replace(/\s+/g, " ");
      if (!Number.isInteger(day_number) || day_number <= 0 || !details) {
        return null;
      }

      const title = (details.split("-")[0] || details).trim().slice(0, 120);
      return {
        day_number,
        title,
        details,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.day_number - b.day_number);

  const uniqueByDay = [];
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.day_number)) continue;
    seen.add(row.day_number);
    uniqueByDay.push(row);
  }

  return uniqueByDay;
};

const inferDestination = (title, description, category) => {
  const coveredMatch = description.match(/Places\s*covered\s*:\s*([^.,]+)/i);
  if (coveredMatch?.[1]) {
    return coveredMatch[1].split("-")[0].trim().slice(0, 80);
  }

  if (title.includes("-")) {
    return title.split("-")[0].trim().slice(0, 80);
  }

  return category.replace(" Packages", "").slice(0, 80);
};

const fileMap = [
  { file: "holiday_packages.csv", category: "Holiday Packages", location: "India" },
  { file: "India_Tour_Packages.csv", category: "India Tour Packages", location: "India" },
  {
    file: "International_Customized_Tours.csv",
    category: "International Customized Tours",
    location: "International",
  },
  {
    file: "International_Tour_Packages.csv",
    category: "International Tour Packages",
    location: "International",
  },
];

const dataDir = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(projectRoot, "..", "untitled folder");

if (!fs.existsSync(dataDir)) {
  console.error(`CSV folder not found: ${dataDir}`);
  process.exit(1);
}

const main = async () => {
  const { data: signedIn, error: authError } = await supabase.auth.signInWithPassword({
    email: "Sptoursrjy@gmail.com",
    password: "Sptours@2026",
  });

  if (authError || !signedIn.user) {
    console.error("Admin sign-in failed:", authError?.message || "Unknown error");
    process.exit(1);
  }

  const { data: existingPackages, error: existingError } = await supabase
    .from("packages")
    .select("id,slug");

  if (existingError) {
    console.error("Unable to read existing packages:", existingError.message);
    process.exit(1);
  }

  const existingSlugs = new Set((existingPackages ?? []).map((row) => row.slug));
  let supportsLegacyColumns = true;
  const legacyProbe = await supabase.from("packages").select("external_link").limit(1);
  if (legacyProbe.error && /column|schema cache/i.test(legacyProbe.error.message)) {
    supportsLegacyColumns = false;
    console.warn(
      "Legacy columns are not present in DB yet. Import will continue with base fields. Run migration 0004 for full field support.",
    );
  }
  let imported = 0;
  let updated = 0;

  for (const source of fileMap) {
    const filePath = path.join(dataDir, source.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${source.file}`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const records = parseCsv(content);

    for (const record of records) {
      const title = (record.Title || "").trim();
      if (!title) continue;

      const description = (record.Description || "").trim();
      const itineraryText = (record["Day-wise Itinerary"] || "").trim();
      const tagsType = (record["Tags/Type"] || "").trim();
      const externalLink = (record.Link || "").trim() || null;
      const rawDuration = (record.Duration || "").trim() || null;
      const coverImage = (record["Image URL"] || "").trim() || null;
      const priceInr = parsePrice(record["Price (INR)"] || "");
      const durationDays = parseDurationDays(rawDuration || "", itineraryText);
      const inclusions = tagsType
        ? tagsType.split("|").map((item) => item.trim()).filter(Boolean)
        : [];

      const shortDescription =
        (description || `Imported from ${source.category}`).slice(0, 260) || `Imported from ${source.category}`;

      let slugBase = toSlug(title) || `legacy-package-${Date.now()}`;
      let slug = slugBase;
      let suffix = 2;
      while (existingSlugs.has(slug)) {
        slug = `${slugBase}-${suffix}`;
        suffix += 1;
      }

      const destination = inferDestination(title, description, source.category);

      const payload = {
        title,
        slug,
        destination,
        location: source.location,
        cover_image: coverImage,
        duration_days: durationDays,
        price_inr: priceInr,
        short_description: shortDescription,
        description: description || null,
        inclusions,
        is_published: true,
        created_by: signedIn.user.id,
      };

      if (supportsLegacyColumns) {
        payload.tags_type = tagsType || null;
        payload.external_link = externalLink;
        payload.raw_duration = rawDuration;
        payload.source_category = source.category;
      }

      const { data: packageRow, error: packageError } = await supabase
        .from("packages")
        .insert(payload)
        .select("id")
        .single();

      if (packageError) {
        if (/duplicate key/i.test(packageError.message)) {
          const { data: existingByTitle } = await supabase
            .from("packages")
            .select("id,slug")
            .eq("title", title)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!existingByTitle?.id) {
            console.error(`Package insert failed for ${title}: ${packageError.message}`);
            continue;
          }

          const { error: updateError } = await supabase
            .from("packages")
            .update({
              destination,
              location: source.location,
              cover_image: coverImage,
              duration_days: durationDays,
              price_inr: priceInr,
              short_description: shortDescription,
              description: description || null,
              inclusions,
              is_published: true,
              ...(supportsLegacyColumns
                ? {
                    tags_type: tagsType || null,
                    external_link: externalLink,
                    raw_duration: rawDuration,
                    source_category: source.category,
                  }
                : {}),
            })
            .eq("id", existingByTitle.id);

          if (updateError) {
            console.error(`Package update failed for ${title}: ${updateError.message}`);
            continue;
          }

          const itineraryRows = parseItineraryRows(itineraryText);
          await supabase.from("package_itinerary_days").delete().eq("package_id", existingByTitle.id);
          if (itineraryRows.length > 0) {
            await supabase.from("package_itinerary_days").insert(
              itineraryRows.map((row) => ({
                package_id: existingByTitle.id,
                ...row,
              })),
            );
          }

          await supabase.from("package_images").delete().eq("package_id", existingByTitle.id);
          if (coverImage) {
            await supabase.from("package_images").insert({
              package_id: existingByTitle.id,
              storage_path: coverImage,
              sort_order: 0,
            });
          }

          updated += 1;
          continue;
        }

        console.error(`Package insert failed for ${title}: ${packageError.message}`);
        continue;
      }

      existingSlugs.add(slug);

      const itineraryRows = parseItineraryRows(itineraryText);
      if (itineraryRows.length > 0) {
        const { error: itineraryError } = await supabase.from("package_itinerary_days").insert(
          itineraryRows.map((row) => ({
            package_id: packageRow.id,
            ...row,
          })),
        );

        if (itineraryError) {
          console.warn(`Itinerary insert warning for ${title}: ${itineraryError.message}`);
        }
      }

      if (coverImage) {
        const { error: imageError } = await supabase.from("package_images").insert({
          package_id: packageRow.id,
          storage_path: coverImage,
          sort_order: 0,
        });

        if (imageError) {
          console.warn(`Image insert warning for ${title}: ${imageError.message}`);
        }
      }

      imported += 1;
    }
  }

  console.log(`Import complete. Inserted: ${imported}, Updated: ${updated}`);
};

await main();
