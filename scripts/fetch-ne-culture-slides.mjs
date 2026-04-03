import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "public/images/northeast");

const slideQueries = [
  ["Arunachal Pradesh mountain landscape", "Tawang monastery"],
  ["Meghalaya Umiam Lake panorama", "Shillong Meghalaya landscape"],
  ["Dzukou Valley landscape", "Nagaland hill landscape"],
  ["Kaziranga National Park landscape", "Assam landscape"],
  ["Mawlynnong Meghalaya", "Meghalaya living root bridge"],
  ["Sikkim mountain landscape", "Tsomgo Lake Sikkim"],
  ["Loktak Lake Manipur", "Manipur landscape"],
  ["Tripura landscape", "Unakoti Tripura"],
];

const fallbackTerms = [
  "Northeast India mountain landscape",
  "Northeast India viewpoint",
  "Northeast India culture and heritage",
];

const resolutionTiers = [
  { minWidth: 3500, minHeight: 2200 },
  { minWidth: 2800, minHeight: 1700 },
  { minWidth: 2200, minHeight: 1400 },
];

const makeApiUrl = (term) =>
  `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    term,
  )}&gsrlimit=40&prop=imageinfo&iiprop=url|mime|size`;

const getCandidateImageUrls = async (term, minWidth, minHeight) => {
  const response = await fetch(makeApiUrl(term));
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {});

  return pages
    .map((page) => page.imageinfo?.[0])
    .filter(
      (info) =>
        info?.mime === "image/jpeg" &&
        typeof info?.url === "string" &&
        Number(info.width) >= minWidth &&
        Number(info.height) >= minHeight,
    )
    .map((info) => info.url);
};

const saveImage = async (url, fileName) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

const ensureDir = () => {
  fs.mkdirSync(outputDir, { recursive: true });
};

const run = async () => {
  ensureDir();
  const usedUrls = new Set();

  for (let index = 0; index < slideQueries.length; index += 1) {
    const terms = [...slideQueries[index], ...fallbackTerms];
    let saved = false;

    for (const tier of resolutionTiers) {
      for (const term of terms) {
        const candidates = await getCandidateImageUrls(term, tier.minWidth, tier.minHeight);
        const prioritized = [...candidates].sort((first, second) => {
          const firstUsed = usedUrls.has(first) ? 1 : 0;
          const secondUsed = usedUrls.has(second) ? 1 : 0;
          return firstUsed - secondUsed;
        });

        for (const url of prioritized) {
          try {
            const fileName = `culture-slide-${index + 1}.jpg`;
            await saveImage(url, fileName);
            usedUrls.add(url);
            console.log(`Saved ${fileName} from ${term} (${tier.minWidth}w+)`);
            saved = true;
            break;
          } catch {
            continue;
          }
        }

        if (saved) {
          break;
        }
      }

      if (saved) {
        break;
      }
    }

    if (!saved) {
      const fileName = `culture-slide-${index + 1}.jpg`;
      const existingPath = path.join(outputDir, fileName);
      if (fs.existsSync(existingPath)) {
        console.log(`Kept existing ${fileName} (no higher-res replacement found)`);
        continue;
      }

      throw new Error(`No valid image found for slide ${index + 1}`);
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
