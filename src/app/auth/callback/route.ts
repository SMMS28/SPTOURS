import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const getSiteBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  // Fallback: use the request origin (set in caller)
  return "http://localhost:3000";
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/";
  const next = requestedNext.startsWith("/") ? requestedNext : "/";

  const base = getSiteBaseUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Exchange failed — send user back to login with an error message
      const loginUrl = new URL("/login", base);
      loginUrl.searchParams.set(
        "message",
        "Google sign in failed. Please try again."
      );
      return NextResponse.redirect(loginUrl.toString());
    }
  } else {
    // No code present — redirect to login
    const loginUrl = new URL("/login", base);
    loginUrl.searchParams.set("message", "Missing auth code. Please try again.");
    return NextResponse.redirect(loginUrl.toString());
  }

  return NextResponse.redirect(`${base}${next}`);
}
