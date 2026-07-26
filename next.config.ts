import type { NextConfig } from "next";

/**
 * Host allowed to serve optimised remote images, derived from the Supabase URL so
 * it follows the project rather than being hardcoded.
 */
const supabaseHostname = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    // northeast/page.tsx requests quality 95; Next 16 rejects any quality not
    // listed here and warns at request time.
    qualities: [75, 95, 100],

    // Previously `hostname: "**"` for both https and http, which turned
    // /_next/image into an open proxy: any caller could have this server fetch an
    // arbitrary URL on our bandwidth. Restricted to Supabase storage, which is the
    // only remote source package images legitimately come from. Anything else is
    // mapped to a local fallback by getSafePackageImageSrc before it reaches here.
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
