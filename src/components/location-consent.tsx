"use client";

import { useState } from "react";

type State = "idle" | "asking" | "granted" | "denied" | "unsupported";

/**
 * Opt-in precise-location control.
 *
 * Renders a button that asks the browser for coordinates and, once granted, puts
 * them into hidden inputs so the surrounding form posts them. Nothing happens
 * without a click — the Geolocation API requires a user gesture, and coordinates
 * at this precision are personal data, so it stays explicit rather than silent.
 * Declining leaves the fields empty and the form submits normally.
 */
export function LocationConsent({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, setState] = useState<State>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number; acc: number } | null>(null);

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState("unsupported");
      return;
    }

    setState("asking");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          acc: Math.round(position.coords.accuracy),
        });
        setState("granted");
      },
      () => setState("denied"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const muted = tone === "dark" ? "text-paper/60" : "text-[#8a8578]";
  const border = tone === "dark" ? "border-paper/25" : "border-ink/15";
  const hover = tone === "dark" ? "hover:bg-paper/10" : "hover:bg-[#f3ece0]";

  return (
    <div className="flex flex-col gap-1.5">
      {coords ? (
        <>
          <input type="hidden" name="latitude" value={coords.lat} />
          <input type="hidden" name="longitude" value={coords.lng} />
          <input type="hidden" name="locationAccuracyM" value={coords.acc} />
          <input type="hidden" name="locationConsent" value="1" />
        </>
      ) : null}

      {state === "granted" && coords ? (
        <p className={`text-[12.5px] ${muted}`}>
          ✓ Location shared — accurate to about {coords.acc}m. This helps us suggest the nearest
          departure point.
        </p>
      ) : (
        <button
          type="button"
          onClick={request}
          disabled={state === "asking"}
          className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border-[1.5px] ${border} px-4 text-[13px] font-semibold transition-colors ${hover} disabled:opacity-60`}
        >
          {state === "asking" ? "Waiting for permission…" : "Share my location (optional)"}
        </button>
      )}

      {state === "denied" ? (
        <p className={`text-[12px] ${muted}`}>
          No problem — we&apos;ll just ask where you&apos;re travelling from.
        </p>
      ) : null}
      {state === "unsupported" ? (
        <p className={`text-[12px] ${muted}`}>This browser doesn&apos;t support location sharing.</p>
      ) : null}
      {state === "idle" ? (
        <p className={`text-[12px] ${muted}`}>
          Helps us recommend the nearest pickup and departure. Never shared onward.
        </p>
      ) : null}
    </div>
  );
}
