import { type NextRequest, NextResponse } from "next/server";

export const updateSession = (request: NextRequest) => {
  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return supabaseResponse;
};
