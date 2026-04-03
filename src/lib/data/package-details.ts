export type PackageDayPlan = {
  day: string;
  title: string;
  details: string;
};

export type PackageDetailInfo = {
  packageCode: string;
  durationLabel: string;
  departureType: string;
  idealFor: string;
  destinationsCovered: string[];
  highlights: string[];
  itinerary: PackageDayPlan[];
  inclusions: string[];
  exclusions: string[];
  notes: string[];
};

const detailBySlug: Record<string, PackageDetailInfo> = {
  "bali-cultural-journey": {
    packageCode: "INT-BALI-05",
    durationLabel: "5 Days / 4 Nights",
    departureType: "Fixed & custom departures",
    idealFor: "Couples, families, first-time Bali travelers",
    destinationsCovered: ["Ubud", "Kuta", "Tanah Lot", "Nusa Dua"],
    highlights: [
      "Balinese temple and cultural circuit",
      "Private transfers and guided sightseeing",
      "Leisure beach evening and optional water activities",
      "Curated local market and cuisine experience",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival and resort check-in",
        details: "Airport pickup, hotel check-in, and evening leisure for acclimatization.",
      },
      {
        day: "Day 2",
        title: "Ubud and cultural trail",
        details: "Visit Ubud highlights with traditional art, viewpoints, and temple stops.",
      },
      {
        day: "Day 3",
        title: "South Bali experience",
        details: "Explore beach belts, sunset points, and optional adventure add-ons.",
      },
      {
        day: "Day 4",
        title: "Leisure and shopping",
        details: "Flexible day for relaxation, spa, local shopping, or add-on excursion.",
      },
      {
        day: "Day 5",
        title: "Departure",
        details: "Breakfast, checkout, and transfer to airport.",
      },
    ],
    inclusions: ["Hotel stay", "Breakfast", "Airport transfers", "Guided city tour"],
    exclusions: ["Flights", "Visa", "Personal expenses", "Optional activities"],
    notes: [
      "Rate varies by season and hotel category.",
      "Passport validity and visa rules apply as per destination policy.",
    ],
  },
  "goa-beach-escape": {
    packageCode: "IND-GOA-04",
    durationLabel: "4 Days / 3 Nights",
    departureType: "Daily departures",
    idealFor: "Leisure travelers and short beach breaks",
    destinationsCovered: ["North Goa", "South Goa", "Dona Paula", "Panaji"],
    highlights: [
      "Beach circuit with flexible leisure time",
      "Comfort hotel with local transfers",
      "Optional cruise and watersport add-ons",
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival and check-in", details: "Arrival transfer and hotel check-in." },
      {
        day: "Day 2",
        title: "North Goa tour",
        details: "Popular beach visits with free evening for shopping and food trails.",
      },
      {
        day: "Day 3",
        title: "South Goa tour",
        details: "Scenic drive, church/heritage points, and optional river cruise.",
      },
      { day: "Day 4", title: "Departure", details: "Checkout and drop transfer." },
    ],
    inclusions: ["Hotel", "Breakfast", "Airport/rail transfers"],
    exclusions: ["Airfare", "Lunch/dinner", "Personal spends"],
    notes: ["Watersports are weather dependent.", "Peak season rates may vary."],
  },
  "kashmir-valley-retreat": {
    packageCode: "IND-KAS-06",
    durationLabel: "6 Days / 5 Nights",
    departureType: "Fixed departures",
    idealFor: "Nature and family travelers",
    destinationsCovered: ["Srinagar", "Gulmarg", "Pahalgam", "Sonmarg"],
    highlights: [
      "Valley landscape circuit with guided sightseeing",
      "Shikara ride and scenic day trips",
      "Mountain-view stays with transfers",
    ],
    itinerary: [
      { day: "Day 1", title: "Srinagar arrival", details: "Hotel/houseboat check-in and local orientation." },
      { day: "Day 2", title: "Gulmarg excursion", details: "Full day excursion with optional gondola ride." },
      { day: "Day 3", title: "Pahalgam excursion", details: "Scenic valley route and local sightseeing." },
      { day: "Day 4", title: "Sonmarg excursion", details: "Mountain viewpoints and leisure stops." },
      { day: "Day 5", title: "Srinagar local", details: "Gardens, market, and evening relaxation." },
      { day: "Day 6", title: "Departure", details: "Checkout and onward transfer." },
    ],
    inclusions: ["Hotel stay", "Breakfast", "Local transfers", "Sightseeing support"],
    exclusions: ["Flights", "Pony/gondola tickets", "Personal expenses"],
    notes: ["Mountain routes depend on weather conditions.", "Carry valid ID and warm clothing in season."],
  },
};

export const getPackageDetailInfo = (slug: string, durationDays: number, inclusions: string[]) => {
  const info = detailBySlug[slug];

  if (info) {
    return info;
  }

  return {
    packageCode: "STD-PKG",
    durationLabel: `${durationDays} Days`,
    departureType: "On request",
    idealFor: "Leisure travelers",
    destinationsCovered: [],
    highlights: ["Curated destination itinerary", "Flexible add-ons", "Assisted planning"],
    itinerary: [
      { day: "Day 1", title: "Arrival", details: "Arrival, transfer, and check-in." },
      { day: "Day 2", title: "Sightseeing", details: "Guided destination exploration." },
      { day: "Day 3", title: "Departure", details: "Checkout and onward transfer." },
    ],
    inclusions,
    exclusions: ["Airfare/train fare", "Personal expenses", "Optional activities"],
    notes: ["Final quote depends on date and availability."],
  };
};
