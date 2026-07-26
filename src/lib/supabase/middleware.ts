import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Must be awaited. This was `void supabase.auth.getUser()`, which broke two
  // ways for signed-in visitors:
  //   1. setAll() reassigns supabaseResponse with the refreshed cookies, and the
  //      function returned before that ran — so a rotated session token was
  //      silently dropped and the session kept re-refreshing.
  //   2. A rejected promise became an unhandled rejection, which surfaced as an
  //      Internal Server Error on every request that had a session to resolve.
  // Anonymous visitors have no token to refresh, which is why it only bit after
  // signing in.
  try {
    await supabase.auth.getUser();
  } catch {
    // A Supabase failure must not take the site down — continue unauthenticated
    // and let the page-level guards redirect if they need to.
  }

  return supabaseResponse;
};
