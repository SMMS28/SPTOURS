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

export const HERO_SLIDES = [
  {
    src: "/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg",
    caption: "Misty highlands, Assam",
    anim: "animate-kb",
  },
  {
    src: "/images/hero-bg/pexels-vijit-bagh-3435480-5414576.jpg",
    caption: "Hill town at dusk",
    anim: "animate-kb2",
  },
  {
    src: "/images/hero-bg/pexels-xperimental-1043292.jpg",
    caption: "Cloud-wrapped valleys",
    anim: "animate-kb3",
  },
];

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
