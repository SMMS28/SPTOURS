// Brand + contact constants and WhatsApp helpers.
//
// This file also used to carry a hardcoded array of 7 packages with their
// itineraries and inclusions, which every redesigned page read from — meaning the
// admin CRUD edited rows the site never rendered. Package data now comes from
// Supabase via lib/data/packages.ts (which keeps its own static-catalogue
// fallback) and is adapted for the components in lib/packages-view.ts.

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

/**
 * Hero rotation. Captions describe what is actually in each frame — two photos in
 * the pool were left out rather than captioned loosely: a tea-picking shot whose
 * conical hats place it in Southeast Asia rather than Assam, and an arid
 * high-altitude road that reads as Ladakh. Where a location can't be verified the
 * caption stays on the subject instead of naming a place.
 */
export const HERO_SLIDES = [
  { src: "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg", caption: "Misty highlands, Assam" },
  { src: "/images/hero-bg/pexels-logalongwithme-6083324.jpg", caption: "The old Silk Route, Sikkim" },
  { src: "/images/hero-bg/pexels-debphotography-4938600.jpg", caption: "Umngot river at Dawki, Meghalaya" },
  { src: "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg", caption: "Hill town at dusk" },
  { src: "/images/hero-bg/pexels-suman-halder-1274029-2430446 (1).jpg", caption: "Thambi View Point, East Sikkim" },
  { src: "/images/hero-bg/pexels-xperimental-1043292.jpg", caption: "Cloud-wrapped valleys" },
  { src: "/images/hero-bg/pexels-janamthapa-5226886.jpg", caption: "A monastery under monsoon skies" },
  { src: "/images/hero-bg/pexels-sayan-samanta-1460859263-36611664.jpg", caption: "Tiger country in the reserves" },
];

/** Ken-burns drifts, cycled across the slides so neighbours never match. */
export const HERO_KEN_BURNS = ["animate-kb", "animate-kb2", "animate-kb3"];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
