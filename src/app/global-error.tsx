"use client";

import { useEffect } from "react";

/**
 * Catches failures in the root layout itself, where error.tsx cannot render
 * because it relies on that layout. Must supply its own <html>/<body>, and can't
 * use the theme tokens for the same reason — so the styling here is inline.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("Unhandled root layout error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F5F0E6",
          color: "#17130D",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 .75rem",
              fontSize: 12,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#9B6A4C",
            }}
          >
            SP Tours &amp; Travels
          </p>
          <h1 style={{ margin: "0 0 .75rem", fontSize: 30, lineHeight: 1.15 }}>
            The site hit an unexpected error
          </h1>
          <p style={{ margin: "0 0 1.75rem", fontSize: 15, lineHeight: 1.6, color: "#6B6252" }}>
            Please try again shortly. If it keeps happening, message us on WhatsApp and
            we&apos;ll help directly.
          </p>
          {/* A hard navigation is intended: the root layout failed, so client-side
              routing would re-enter the same broken tree. next/link is wrong here. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "0.85rem 1.5rem",
              borderRadius: 999,
              background: "#9B6A4C",
              color: "#F5F0E6",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Back to home
          </a>
          {error.digest ? (
            <p style={{ marginTop: "1.75rem", fontSize: 11.5, color: "#a49d8c" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
