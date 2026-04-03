"use client";

import { useEffect, useState } from "react";

export function FlightLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("sp-flight-loader-seen")) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);

    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem("sp-flight-loader-seen", "1");
      setVisible(false);
    }, 2200);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <p className="text-center text-sm font-semibold tracking-wide text-white/90">
            Mapping your route...
          </p>

          <div className="flight-loader-orbit mt-6">
            <div className="flight-loader-path" />
            <div className="flight-loader-plane">✈️</div>
            <div className="flight-loader-pulse" />
          </div>

          <p className="mt-4 text-center text-xs text-white/70">
            Securing seats & syncing your session
          </p>
        </div>
      </div>
    </div>
  );
}
