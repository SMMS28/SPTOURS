// Shared brand + contact constants and the real package catalogue.

export const PHONE_DISPLAY = "+91 92477 77996";
export const PHONE_TEL = "+919247777996";
export const EMAIL = "sptoursrjy@gmail.com";
export const WHATSAPP_NUMBER = "919247777996";

/** Build a WhatsApp deep link with a pre-filled message. */
export function wa(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_PLAN = wa("Hi SP Tours, I'd like to plan a trip to the Northeast.");
export const WA_ENQUIRE = wa("Hi SP Tours, I'd like to enquire about a Northeast trip.");

export type Pkg = {
  slug: string;
  title: string;
  state: string;        // filter key(s), space-separated
  region: string;       // display region label
  duration: string;
  price: number;
  image: string;
  blurb: string;
  tag?: string;
  span?: number;        // bento column span (12-col grid)
};

export const PACKAGES: Pkg[] = [
  {
    slug: "arunachal-meghalaya-grand-circuit-10d9n",
    title: "The Grand Circuit",
    state: "multi arunachal meghalaya",
    region: "Arunachal + Meghalaya",
    duration: "10D / 9N",
    price: 57999,
    image: "/images/northeast/arunachal-meghalaya-grand-circuit-10d9n-1.jpg",
    blurb: "Bomdila, Tawang, Dirang, a Kaziranga safari, Shillong and Cherrapunjee.",
    tag: "Grand tour",
    span: 12,
  },
  {
    slug: "north-sikkim-highlights-6d5n",
    title: "Highlights of North Sikkim",
    state: "sikkim",
    region: "Sikkim",
    duration: "6D / 5N",
    price: 22499,
    image: "/images/northeast/north-sikkim-highlights-6d5n-1.jpg",
    blurb: "Lachung, high-altitude lake drives and the alpine sweep of Yumthang Valley.",
    tag: "Most visited",
    span: 5,
  },
  {
    slug: "meghalaya-shillong-cherrapunjee-mawlynnong-5d4n",
    title: "Meghalaya Explorer",
    state: "meghalaya",
    region: "Meghalaya",
    duration: "5D / 4N",
    price: 19999,
    image: "/images/northeast/meghalaya-shillong-cherrapunjee-mawlynnong-5d4n-1.jpg",
    blurb: "Umiam Lake, Cherrapunjee falls, Mawlynnong and the living root bridges of Dawki.",
    span: 4,
  },
  {
    slug: "discovering-arunachal-pradesh-7d6n",
    title: "Discovering Arunachal",
    state: "arunachal",
    region: "Arunachal",
    duration: "7D / 6N",
    price: 28899,
    image: "/images/northeast/discovering-arunachal-pradesh-7d6n-1.jpg",
    blurb: "High mountain passes, cliff-side monasteries and India's wild eastern frontier.",
    tag: "Explorer",
    span: 3,
  },
  {
    slug: "gangtok-darjeeling-yak-ride-6d5n",
    title: "Gangtok & Darjeeling",
    state: "sikkim",
    region: "Sikkim",
    duration: "6D / 5N",
    price: 21399,
    image: "/images/northeast/gangtok-darjeeling-yak-ride-6d5n-1.jpg",
    blurb: "Gangtok, Tsomgo Lake, Baba Mandir and the hill charm of Darjeeling.",
    tag: "Free yak ride",
    span: 4,
  },
  {
    slug: "arunachal-tawang-bomdila-dirang-6d5n",
    title: "Arunachal Classic — Tawang",
    state: "arunachal",
    region: "Arunachal",
    duration: "6D / 5N",
    price: 25499,
    image: "/images/northeast/arunachal-tawang-bomdila-dirang-6d5n-1.jpg",
    blurb: "Bomdila to Tawang over Sela Pass, the war memorial and a Bumla Pass excursion.",
    span: 3,
  },
  {
    slug: "sikkim-getaway-yumthang-5d4n",
    title: "Sikkim Getaway · Yumthang",
    state: "sikkim",
    region: "Sikkim",
    duration: "5D / 4N",
    price: 20799,
    image: "/images/northeast/sikkim-getaway-yumthang-5d4n-1.jpg",
    blurb: "Gangtok, Lachung and Yumthang Valley with curated Himalayan stays.",
    tag: "Popular",
    span: 5,
  },
];

export const HERO_SLIDES = [
  { src: "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg", caption: "Misty highlands, Assam", anim: "animate-kb" },
  { src: "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg", caption: "Hill town at dusk", anim: "animate-kb2" },
  { src: "/images/hero-bg/pexels-xperimental-1043292.jpg", caption: "Cloud-wrapped valleys", anim: "animate-kb3" },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const getPackage = (slug: string) => PACKAGES.find((p) => p.slug === slug);

export const INCLUSIONS: Record<string, string[]> = {
  "arunachal-meghalaya-grand-circuit-10d9n": ["9 nights hotels", "Daily breakfast", "Kaziranga jeep safari", "Private Innova", "All permits", "Airport transfers"],
  "north-sikkim-highlights-6d5n": ["Hotel", "Daily breakfast", "Permits", "Transfers"],
  "meghalaya-shillong-cherrapunjee-mawlynnong-5d4n": ["Hotel", "Breakfast", "Transfers", "Sightseeing"],
  "discovering-arunachal-pradesh-7d6n": ["Hotel", "Breakfast", "Sightseeing transfers"],
  "gangtok-darjeeling-yak-ride-6d5n": ["Hotel", "Breakfast", "Permits", "SUV transfer"],
  "arunachal-tawang-bomdila-dirang-6d5n": ["Hotel", "Breakfast", "Private vehicle"],
  "sikkim-getaway-yumthang-5d4n": ["Hotel", "Breakfast", "Local transport"],
};

export type Day = { day: number; title: string; detail: string };

export const ITINERARIES: Record<string, Day[]> = {
  "arunachal-meghalaya-grand-circuit-10d9n": [
    { day: 1, title: "Arrive Guwahati", detail: "Airport transfer and hotel check-in. Evening free on the banks of the Brahmaputra." },
    { day: 2, title: "Guwahati to Bomdila", detail: "Drive into the Arunachal foothills via Nameri and the Tipi Orchidarium." },
    { day: 3, title: "Bomdila to Tawang", detail: "A spectacular drive across Sela Pass (13,700 ft) and Jaswantgarh into the Tawang valley." },
    { day: 4, title: "Bumla Pass excursion", detail: "Optional excursion to the Indo-China border at Bumla, with PTSO and Madhuri Lake." },
    { day: 5, title: "Tawang to Dirang", detail: "Return leg with orchid gardens and the hot springs of Dirang." },
    { day: 6, title: "Dirang to Kaziranga", detail: "Long, scenic transfer out of the mountains to the grasslands of Kaziranga." },
    { day: 7, title: "Kaziranga to Shillong", detail: "Early jeep safari for one-horned rhino, then transfer into Meghalaya." },
    { day: 8, title: "Shillong city", detail: "City landmarks, Ward's Lake and an evening at Police Bazaar." },
    { day: 9, title: "Shillong to Cherrapunjee", detail: "Nohkalikai and Mawsmai falls, caves and the green canyons of Sohra." },
    { day: 10, title: "Drop Guwahati", detail: "Kamakhya temple en route and a final transfer to the airport." },
  ],
  "meghalaya-shillong-cherrapunjee-mawlynnong-5d4n": [
    { day: 1, title: "Guwahati to Shillong", detail: "Arrive and visit Umiam Lake en route to Shillong." },
    { day: 2, title: "Shillong to Cherrapunjee", detail: "Nohkalikai, Mawsmai and Elephant Falls." },
    { day: 3, title: "Mawlynnong & Dawki", detail: "Cleanest village in Asia, a living root bridge and the Umngot river." },
    { day: 4, title: "Shillong city tour", detail: "Ward's Lake, Don Bosco Museum and city viewpoints." },
    { day: 5, title: "Guwahati drop", detail: "Kamakhya temple and departure transfer." },
  ],
  "arunachal-tawang-bomdila-dirang-6d5n": [
    { day: 1, title: "Guwahati to Bomdila", detail: "Drive via Nameri and the Tipi Orchidarium." },
    { day: 2, title: "Bomdila to Tawang", detail: "Cross Sela Pass and visit Jaswantgarh." },
    { day: 3, title: "Bumla Pass excursion", detail: "Visit Bumla, PTSO and Madhuri Lake." },
    { day: 4, title: "Tawang local", detail: "Monastery, war memorial and the local market." },
    { day: 5, title: "Tawang to Dirang", detail: "Return with scenic valley halts." },
    { day: 6, title: "Dirang to Guwahati", detail: "Dirang Dzong and onward transfer." },
  ],
};
