import type { TravelPackage } from "@/lib/types";

export const northeastStatePatterns: RegExp[] = [
  /\bassam\b|\bguwahati\b|\bkaziranga\b|\bmajuli\b|\bmanas\b/i,
  /\bmeghalaya\b|\bshillong\b|\bcherrapunji\b|\bsohra\b|\bdawki\b|\bmawlynnong\b/i,
  /\barunachal\b|\btawang\b|\bziro\b|\bbomdila\b|\bdirang\b/i,
  /\bnagaland\b|\bkohima\b|\bdz[uü]kou\b|\bmokokchung\b/i,
  /\bsikkim\b|\bgangtok\b|\blachung\b|\bpelling\b|\btsomgo\b/i,
  /\bmanipur\b|\bimphal\b|\bloktak\b/i,
  /\bmizoram\b|\baizawl\b/i,
  /\btripura\b|\bagartala\b|\bujjayanta\b/i,
];

export const isNortheastPackage = (travelPackage: TravelPackage) => {
  const searchable = `${travelPackage.title} ${travelPackage.destination} ${travelPackage.location} ${travelPackage.short_description}`;
  return northeastStatePatterns.some((pattern) => pattern.test(searchable));
};
