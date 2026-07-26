import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

// Next.js 16 renamed Middleware to Proxy: the file must be proxy.ts and the
// export must be `proxy` (or a default export). A leftover middleware.ts with a
// `middleware` export is silently ignored — which is why the Supabase session
// refresh here was never actually running.

export async function proxy(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  /**
   * Complete an OAuth sign-in that landed somewhere other than /auth/callback.
   *
   * Supabase only redirects to the `redirect_to` we ask for if that exact URL is
   * in its Redirect URLs allow-list. When it isn't, it silently falls back to the
   * project's Site URL and appends the code to the *root* — producing
   * `https://<site>/?code=…`, which no page handled, so the visitor bounced back
   * to the homepage still signed out.
   *
   * Forwarding any stray `?code=` to /auth/callback makes the flow work off the
   * Site URL alone, without depending on the allow-list. The PKCE verifier cookie
   * is on this domain, so the exchange succeeds normally.
   */
  const code = searchParams.get("code");
  if (code && !pathname.startsWith("/auth/callback")) {
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    callback.search = "";
    callback.searchParams.set("code", code);
    // Return the visitor to wherever they landed once the session exists.
    if (pathname && pathname !== "/") {
      callback.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(callback);
  }

  // Awaited so the refreshed session cookies are on the response we return.
  return await createClient(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
