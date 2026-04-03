const SUPABASE_REQUEST_TIMEOUT_MS = 12000;

export const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(input, {
      ...init,
      signal: init?.signal ?? controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return new Response(
        JSON.stringify({
          message: "Supabase request timed out",
        }),
        {
          status: 504,
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
