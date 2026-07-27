import type { TravelPackage } from "@/lib/types";

export const mostVisitedNortheastSlugs = [
  "north-sikkim-highlights-6d5n",
  "sikkim-getaway-yumthang-5d4n",
  "gangtok-darjeeling-yak-ride-6d5n",
  "discovering-arunachal-pradesh-7d6n",
  "arunachal-tawang-bomdila-dirang-6d5n",
  "arunachal-meghalaya-grand-circuit-10d9n",
  "meghalaya-shillong-cherrapunjee-mawlynnong-5d4n",
] as const;

export const northeastCatalogPackages: TravelPackage[] = [
  {
    id: "ne-pkg-001",
    title: "Highlights of North Sikkim | Bhim Nala Falls",
    slug: "north-sikkim-highlights-6d5n",
    destination: "Gangtok",
    location: "Sikkim",
    tags_type: "Most Visited",
    raw_duration: "6 D / 5 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/north-sikkim-highlights-6d5n-1.jpg",
    duration_days: 6,
    price_inr: 22499,
    short_description: "Lachung, high-altitude lake drives, and alpine valleys in North Sikkim.",
    inclusions: ["Hotel", "Daily breakfast", "Permits", "Transfers"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/north-sikkim-highlights-6d5n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/north-sikkim-highlights-6d5n-2.jpg", sort_order: 2 },
      { storage_path: "/images/pkg/north-sikkim.jpg", sort_order: 3 },
    ],
    package_itinerary_days: [
      { day_number: 1, title: "Arrival at Gangtok", details: "Transfer and acclimatization in Gangtok." },
      { day_number: 2, title: "Gangtok to Lachung", details: "Scenic mountain drive to Lachung village." },
      { day_number: 3, title: "Yumthang Valley", details: "Excursion to Yumthang and return." },
    ],
  },
  {
    id: "ne-pkg-002",
    title: "Sikkim Getaway with Yumthang Valley Tour",
    slug: "sikkim-getaway-yumthang-5d4n",
    destination: "Gangtok",
    location: "Sikkim",
    tags_type: "Popular",
    raw_duration: "5 D / 4 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/sikkim-getaway-yumthang-5d4n-1.jpg",
    duration_days: 5,
    price_inr: 20799,
    short_description: "Gangtok, Lachung, and Yumthang Valley with curated Himalayan stays.",
    inclusions: ["Hotel", "Breakfast", "Local transport"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/sikkim-getaway-yumthang-5d4n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/sikkim-getaway-yumthang-5d4n-2.jpg", sort_order: 2 },
      { storage_path: "/images/pkg/sikkim-yumthang.jpg", sort_order: 3 },
    ],
  },
  {
    id: "ne-pkg-003",
    title: "Getaway to Sikkim with FREE Yak Ride",
    slug: "gangtok-darjeeling-yak-ride-6d5n",
    destination: "Gangtok",
    location: "Sikkim",
    tags_type: "Top Rated",
    raw_duration: "6 D / 5 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-1.jpg",
    duration_days: 6,
    price_inr: 21399,
    short_description: "Gangtok, Tsomgo Lake, Baba Mandir and Darjeeling in one easy circuit.",
    inclusions: ["Hotel", "Breakfast", "Permits", "SUV transfer"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-2.jpg", sort_order: 2 },
      { storage_path: "/images/pkg/gangtok-darjeeling.jpg", sort_order: 3 },
    ],
  },
  {
    id: "ne-pkg-004",
    title: "Discovering Arunachal Pradesh",
    slug: "discovering-arunachal-pradesh-7d6n",
    destination: "Tawang",
    location: "Arunachal Pradesh",
    tags_type: "Explorer",
    raw_duration: "7 D / 6 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/discovering-arunachal-pradesh-7d6n-1.jpg",
    duration_days: 7,
    price_inr: 28899,
    short_description: "High mountain passes, monasteries, and frontier landscapes across Arunachal.",
    inclusions: ["Hotel", "Breakfast", "Sightseeing transfers"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/discovering-arunachal-pradesh-7d6n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/discovering-arunachal-pradesh-7d6n-2.jpg", sort_order: 2 },
    ],
  },
  {
    id: "ne-pkg-005",
    title: "Arunachal Classic: Bomdila – Tawang – Dirang",
    slug: "arunachal-tawang-bomdila-dirang-6d5n",
    destination: "Bomdila",
    location: "Arunachal Pradesh",
    tags_type: "Featured",
    raw_duration: "6 D / 5 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/arunachal-tawang-bomdila-dirang-6d5n-1.jpg",
    duration_days: 6,
    price_inr: 25499,
    short_description: "Guwahati to Bomdila, Tawang and Dirang with Sela Pass and war memorial visits.",
    inclusions: ["Hotel", "Breakfast", "Private vehicle"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/arunachal-tawang-bomdila-dirang-6d5n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/arunachal-tawang-bomdila-dirang-6d5n-2.jpg", sort_order: 2 },
      { storage_path: "/images/pkg/arunachal-classic.jpg", sort_order: 3 },
    ],
    package_itinerary_days: [
      { day_number: 1, title: "Guwahati to Bomdila", details: "Drive via Nameri and Tipi Orchidarium." },
      { day_number: 2, title: "Bomdila to Tawang", details: "Cross Sela Pass and visit Jaswantgarh." },
      { day_number: 3, title: "Bumla Pass Excursion", details: "Visit Bumla, PTSO and Madhuri Lake." },
      { day_number: 4, title: "Tawang Local", details: "Monastery, war memorial and local market." },
      { day_number: 5, title: "Tawang to Dirang", details: "Return with scenic valley halts." },
      { day_number: 6, title: "Dirang to Guwahati", details: "Dirang Dzong and onward transfer." },
    ],
  },
  {
    id: "ne-pkg-006",
    title: "Arunachal + Meghalaya Grand Circuit",
    slug: "arunachal-meghalaya-grand-circuit-10d9n",
    destination: "Guwahati",
    location: "Assam",
    tags_type: "Most Visited",
    raw_duration: "10 D / 9 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/arunachal-meghalaya-grand-circuit-10d9n-1.jpg",
    duration_days: 10,
    price_inr: 57999,
    short_description: "Bomdila, Tawang, Dirang, Kaziranga, Shillong and Cherrapunjee in one long expedition.",
    inclusions: ["Hotel", "Breakfast", "1 jeep safari", "Innova"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/arunachal-meghalaya-grand-circuit-10d9n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/arunachal-meghalaya-grand-circuit-10d9n-2.jpg", sort_order: 2 },
      { storage_path: "/images/pkg/grand-circuit.jpg", sort_order: 3 },
    ],
    package_itinerary_days: [
      { day_number: 1, title: "Arrive Guwahati", details: "Airport transfer and hotel check-in." },
      { day_number: 2, title: "Guwahati to Bomdila", details: "Drive to Arunachal foothills." },
      { day_number: 3, title: "Bomdila to Tawang", details: "Mountain drive via Sela Pass." },
      { day_number: 4, title: "Bumla Pass", details: "Optional Indo-China border excursion." },
      { day_number: 5, title: "Tawang to Dirang", details: "Return leg with orchid garden stop." },
      { day_number: 6, title: "Dirang to Kaziranga", details: "Transfer to wildlife reserve." },
      { day_number: 7, title: "Kaziranga to Shillong", details: "Safari and transfer to Meghalaya." },
      { day_number: 8, title: "Shillong City", details: "City landmarks and Police Bazaar." },
      { day_number: 9, title: "Shillong to Cherrapunjee", details: "Waterfalls and cave circuit." },
      { day_number: 10, title: "Drop Guwahati", details: "Final transfer for departure." },
    ],
  },
  {
    id: "ne-pkg-007",
    title: "Meghalaya Explorer: Shillong – Cherrapunjee – Mawlynnong",
    slug: "meghalaya-shillong-cherrapunjee-mawlynnong-5d4n",
    destination: "Shillong",
    location: "Meghalaya",
    tags_type: "Featured",
    raw_duration: "5 D / 4 N",
    source_category: "India Tour Packages",
    cover_image: "/images/northeast/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n-1.jpg",
    duration_days: 5,
    price_inr: 19999,
    short_description: "Umiam lake, Cherrapunjee waterfalls, Mawlynnong village, Dawki and Shillong city tour.",
    inclusions: ["Hotel", "Breakfast", "Transfers", "Sightseeing"],
    is_published: true,
    package_images: [
      { storage_path: "/images/northeast/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n-1.jpg", sort_order: 1 },
      { storage_path: "/images/northeast/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n-2.jpg", sort_order: 2 },
      { storage_path: "/images/pkg/meghalaya-explorer.jpg", sort_order: 3 },
    ],
    package_itinerary_days: [
      { day_number: 1, title: "Guwahati to Shillong", details: "Arrive and visit Umiam Lake en route." },
      { day_number: 2, title: "Shillong to Cherrapunjee", details: "Nohkalikai, Mawsmai and Elephant Falls." },
      { day_number: 3, title: "Mawlynnong & Dawki", details: "Cleanest village, living root bridge and Umngot river." },
      { day_number: 4, title: "Shillong City Tour", details: "Ward's Lake, Don Bosco Museum and city points." },
      { day_number: 5, title: "Guwahati Drop", details: "Kamakhya temple and departure transfer." },
    ],
  },
];

export const prioritizeMostVisitedNortheast = (packages: TravelPackage[]) => {
  const rank: Record<string, number> = Object.fromEntries(
    mostVisitedNortheastSlugs.map((slug, index) => [slug, index]),
  );

  return [...packages].sort((first, second) => {
    const firstRank = rank[first.slug];
    const secondRank = rank[second.slug];

    if (firstRank === undefined && secondRank === undefined) {
      return 0;
    }
    if (firstRank === undefined) {
      return 1;
    }
    if (secondRank === undefined) {
      return -1;
    }
    return firstRank - secondRank;
  });
};
