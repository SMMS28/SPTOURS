import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncProfileFromProvider } from "@/lib/identity";

const getSiteBaseUrl = (request: Request): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  // Fall back to the request origin rather than hardcoding localhost, so a
  // preview deployment without NEXT_PUBLIC_SITE_URL still returns to itself.
  try {
    return new URL(request.url).origin;
  } catch {
    return "http://localhost:3000";
  }
};

const backToLogin = (base: string, message: string, next?: string) => {
  const loginUrl = new URL("/login", base);
  loginUrl.searchParams.set("message", message);
  if (next && next !== "/") loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl.toString());
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/";
  const next = requestedNext.startsWith("/") ? requestedNext : "/";

  const base = getSiteBaseUrl(request);

  // Supabase reports provider/config failures by redirecting here with error
  // params and no code. These were previously collapsed into "Missing auth
  // code", which hid the actual cause — most often the redirect URL not being
  // allow-listed under Auth → URL Configuration.
  const error = searchParams.get("error") ?? searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const detail = (errorDescription ?? error).replace(/\+/g, " ");
    return backToLogin(base, `Sign in failed: ${detail}`, next);
  }

  if (!code) {
    return backToLogin(
      base,
      "Sign in did not complete — no authorisation code was returned.",
      next,
    );
  }

  const supabase = await createClient();

  let exchanged;
  try {
    exchanged = await supabase.auth.exchangeCodeForSession(code);
  } catch (thrown) {
    // exchangeCodeForSession can reject outright (network/PKCE issues) rather
    // than returning an error — unwrapped, that surfaced as a 500.
    const detail = thrown instanceof Error ? thrown.message : "unexpected error";
    return backToLogin(base, `Sign in failed: ${detail}`, next);
  }

  if (exchanged.error) {
    return backToLogin(base, `Sign in failed: ${exchanged.error.message}`, next);
  }

  // Copy the provider's name/avatar onto the profile. The handle_new_user trigger
  // only fires on first sign-up, so without this a Google sign-in left the
  // account details empty.
  const user = exchanged.data.user ?? (await supabase.auth.getUser()).data.user;
  if (user) {
    await syncProfileFromProvider(supabase, user);
  }

  return NextResponse.redirect(`${base}${next}`);
}
