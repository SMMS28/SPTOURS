export type ProfileRole = "user" | "admin";

export type Destination = {
  id: string;
  name: string;
  country: string;
  slug: string;
  description?: string | null;
  is_published: boolean;
};

export type TravelPackage = {
  id: string;
  title: string;
  slug: string;
  destination: string;
  location: string;
  tags_type?: string | null;
  external_link?: string | null;
  raw_duration?: string | null;
  source_category?: string | null;
  cover_image?: string | null;
  duration_days: number;
  price_inr: number;
  short_description: string;
  description?: string | null;
  inclusions: string[];
  is_published: boolean;
  package_images?: { storage_path: string; sort_order: number }[];
  package_itinerary_days?: {
    day_number: number;
    title: string;
    details: string;
  }[];
  created_at?: string;
};

export type InquiryInput = {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  packageId?: string;
};
