"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Route-level error boundary. Without this a server exception rendered the
 * runtime's bare "Internal Server Error", which told the visitor nothing and gave
 * us no handle for diagnosis. The digest below is the same id Vercel logs against
 * the failing invocation.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in `vercel logs` for the failing deployment.
    console.error("Unhandled route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="w-full max-w-[560px] rounded-[22px] border border-ink/10 bg-white p-10 text-center">
        <p className="mb-3 eyebrow">
          Something went wrong
        </p>
        <h1 className="mb-3 font-display text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.02em]">
          We couldn&apos;t load this page
        </h1>
        <p className="mb-8 text-[15px] leading-relaxed text-mutedfg">
          This is on us, not you. Try again in a moment — or reach us on WhatsApp and
          we&apos;ll sort your trip out directly.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center rounded-full bg-clay px-6 text-[14.5px] font-bold text-paper transition-colors hover:bg-clay-dark"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full border-[1.5px] border-ink/15 px-6 text-[14.5px] font-semibold transition-colors hover:bg-[#f3ece0]"
          >
            Back to home
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-7 font-mono text-[12px] sm:text-[11.5px] text-[#a49d8c]">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
