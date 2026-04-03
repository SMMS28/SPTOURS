"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { submitInquiry } from "@/lib/actions/inquiries";

export function QuotePopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Initialise dismissed lazily from sessionStorage to avoid setState-in-effect
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!sessionStorage.getItem("quotePopupDismissed");
  });

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => {
      setOpen(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    sessionStorage.setItem("quotePopupDismissed", "1");
  };

  async function handleSubmit(formData: FormData) {
    await submitInquiry(formData);
    setSubmitted(true);
    setTimeout(() => {
      handleDismiss();
    }, 2500);
  }

  if (!open || dismissed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get a Free Quote"
        className="fixed left-1/2 top-1/2 z-101 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/75 bg-card shadow-[0_32px_64px_-24px_rgba(15,23,42,0.4)] backdrop-blur-xl"
      >
        {/* Header stripe with image */}
        <div className="relative h-28 overflow-hidden rounded-t-3xl">
          <Image
            src="/images/hero-bg/pexels-kosyginl-2888802.jpg"
            alt=""
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.45),rgba(2,6,23,0.75))]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f29a2e]">SP Tours & Travels</p>
            <h2 className="mt-1 text-xl font-bold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              Get a Free Quote 🏔️
            </h2>
            <p className="mt-0.5 text-xs text-white/80">Let us plan your perfect Northeast journey</p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="text-4xl">🎉</span>
              <p className="text-base font-semibold text-foreground">Thank you! We&apos;ll be in touch shortly.</p>
              <p className="text-sm text-muted-foreground">Our team will reach out within 24 hours.</p>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-3">
              <input type="hidden" name="packageId" value="" />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="popup-name" className="text-xs font-medium text-foreground">Full Name *</label>
                  <input
                    id="popup-name"
                    name="fullName"
                    required
                    minLength={2}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="popup-phone" className="text-xs font-medium text-foreground">Phone</label>
                  <input
                    id="popup-phone"
                    name="phone"
                    placeholder="+91 00000 00000"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="popup-email" className="text-xs font-medium text-foreground">Email *</label>
                <input
                  id="popup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="popup-message" className="text-xs font-medium text-foreground">Where would you like to go? *</label>
                <textarea
                  id="popup-message"
                  name="message"
                  required
                  minLength={10}
                  rows={3}
                  placeholder="E.g. 5-day Meghalaya trip for 2, budget ₹30,000..."
                  className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[#f29a2e] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e4891f]"
              >
                Send My Quote Request →
              </button>
              <p className="text-center text-xs text-muted-foreground">
                No spam. We&apos;ll reply within 24 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
