import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "public/images/northeast");

const packageQueries = {
  "north-sikkim-highlights-6d5n": ["North Sikkim landscape", "Yumthang Valley Sikkim"],
  "sikkim-getaway-yumthang-5d4n": ["Gangtok Sikkim", "Lachung Sikkim"],
  "gangtok-darjeeling-yak-ride-6d5n": ["Tsomgo Lake Sikkim", "Darjeeling Himalaya"],
  "discovering-arunachal-pradesh-7d6n": ["Tawang Arunachal Pradesh", "Sela Pass Arunachal"],
  "arunachal-tawang-bomdila-dirang-6d5n": ["Bomdila monastery", "Dirang valley Arunachal Pradesh"],
  "arunachal-meghalaya-grand-circuit-10d9n": ["Kaziranga National Park", "Shillong Meghalaya"],
  "meghalaya-shillong-cherrapunjee-mawlynnong-5d4n": ["Nohkalikai Falls", "Mawlynnong village"],
};

const fallbackTerms = [
  "Northeast India mountains",
  "India Himalaya landscape",
  "Meghalaya nature",
];

const usedUrls = new Set();

const makeApiUrl = (term) =>
  `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
    term,
  )}&gsrlimit=20&prop=imageinfo&iiprop=url|mime`;

const getCandidateImageUrls = async (term) => {
  const response = await fetch(makeApiUrl(term));
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {});

  const imageInfos = pages
    .map((page) => page.imageinfo?.[0])
    .filter((info) => info?.mime === "image/jpeg" && typeof info?.url === "string");

  return imageInfos.map((info) => info.url);
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

  for (const [slug, terms] of Object.entries(packageQueries)) {
    const allTerms = [...terms, ...fallbackTerms];

    for (let index = 0; index < 2; index += 1) {
      let selectedUrl = null;

      for (const term of allTerms) {
        const candidateUrls = await getCandidateImageUrls(term);
        const prioritizedCandidates = [...candidateUrls].sort((first, second) => {
          const firstUsed = usedUrls.has(first) ? 1 : 0;
          const secondUsed = usedUrls.has(second) ? 1 : 0;
          return firstUsed - secondUsed;
        });

        for (const url of prioritizedCandidates) {
          try {
            const outputName = `${slug}-${index + 1}.jpg`;
            await saveImage(url, outputName);
            usedUrls.add(url);
            selectedUrl = url;
            console.log(`Saved ${outputName}`);
            break;
          } catch {
            continue;
          }
        }

        if (selectedUrl) {
          break;
        }
      }

      if (!selectedUrl) {
        throw new Error(`No image found for ${slug}`);
      }
    }
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
