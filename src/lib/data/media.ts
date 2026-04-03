const packageFallbackPool = [
  "/images/t1.jpg",
  "/images/t2.jpg",
  "/images/t3.jpg",
  "/images/t4.jpg",
  "/images/t5.jpg",
  "/images/t6.jpg",
  "/images/t7.jpg",
  "/images/t8.jpg",
];

export const getFallbackPackageImage = (key: string) => {
  const hash = Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return packageFallbackPool[hash % packageFallbackPool.length];
};

const imageExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "avif",
  "svg",
  "bmp",
]);

const getFileExtension = (pathname: string) => {
  const fileName = pathname.split("/").pop() ?? "";
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) {
    return "";
  }
  return fileName.slice(dotIndex + 1).toLowerCase();
};

export const getSafePackageImageSrc = (src: string | null | undefined, fallbackKey: string) => {
  if (!src) {
    return getFallbackPackageImage(fallbackKey);
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return getFallbackPackageImage(fallbackKey);
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return getFallbackPackageImage(fallbackKey);
    }

    const extension = getFileExtension(parsed.pathname);
    if (!imageExtensions.has(extension)) {
      return getFallbackPackageImage(fallbackKey);
    }

    return trimmed;
  } catch {
    return getFallbackPackageImage(fallbackKey);
  }
};

export const destinationCards = [
  {
    name: "Goa",
    country: "India",
    summary: "Beaches, nightlife, and watersports.",
    image: "/images/l1.jpg",
  },
  {
    name: "Srinagar",
    country: "India",
    summary: "Lakes, valleys, and mountain views.",
    image: "/images/l2.jpg",
  },
  {
    name: "Bali",
    country: "Indonesia",
    summary: "Culture, coastlines, and wellness stays.",
    image: "/images/l3.jpg",
  },
  {
    name: "Dubai",
    country: "UAE",
    summary: "City luxury, desert safari, and shopping.",
    image: "/images/l4.jpg",
  },
];
