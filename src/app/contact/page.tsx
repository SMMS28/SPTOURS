import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/actions/inquiries";
import { HeroSlideshow } from "@/components/hero-slideshow";
import Image from "next/image";

export const metadata = {
  title: "Contact | SP TOURS & TRAVELS",
};

const statusMessage: Record<string, string> = {
  sent: "Inquiry sent successfully. We will be in touch shortly.",
  invalid: "Please fill all fields correctly.",
  error: "Unable to send inquiry. Please try again.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; package?: string }>;
}) {
  const params = await searchParams;
  const message = params.status ? statusMessage[params.status] : undefined;
  const isComplete = params.status === "sent";

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center -mt-28 px-4 pb-12 pt-26 sm:-mt-32 lg:-mt-36">
      <HeroSlideshow
        images={[
          "/images/hero-bg/pexels-xperimental-1043292.jpg",
          "/images/hero-bg/pexels-janamthapa-5226886.jpg",
          "/images/hero-bg/pexels-logalongwithme-6083324.jpg"
        ]}
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.85)_0%,rgba(2,6,23,0.70)_100%)]" />

      {/* Glass card container */}
      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-5">

        {/* Left Side: Contact Info */}
        <div className="col-span-1 flex flex-col justify-center rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:col-span-2">
          <div className="mb-4">
            <Image
              src="/images/logo-2026.png"
              alt="SP Tours and Travels logo"
              width={438}
              height={173}
              className="h-16 w-auto origin-top-left object-contain brightness-110 contrast-110 drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] sm:h-20"
              priority
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f29a2e]">Get in touch</p>
          <h1 className="mt-2 text-3xl font-bold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
            Contact Us
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            &quot;Your Journey, Our Responsibility&quot;
          </p>

          <div className="mt-8 space-y-6 text-sm text-white/90">
            <div>
              <p className="font-semibold text-white">SP Tours & Travels</p>
              <p className="text-white/70">Managing Partner: S S Rao</p>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="mt-1 text-lg">📍</span>
              <div>
                <p className="font-semibold text-white">Location</p>
                <p className="mt-0.5 text-white/70">
                  T1, S. R. Residency Sri Lakshmi nagar, Namavaram Road,<br />
                  Morampudi<br />
                  RAJAHMUNDRY, ANDHRA PRADESH 533107<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 text-lg">📞</span>
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p className="mt-0.5 text-white/70">+91 92477 77996</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 text-lg">✉️</span>
              <div>
                <p className="font-semibold text-white">Email</p>
                <p className="mt-0.5 text-white/70">sptoursrjy@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="col-span-1 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:col-span-3">
          {isComplete ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="text-6xl">🎉</span>
              <h2 className="mt-6 text-2xl font-bold text-white">Thank You!</h2>
              <p className="mt-2 text-white/80">{message}</p>
            </div>
          ) : (
            <form
              action={submitInquiry}
              data-confirm-message="Confirm sending this inquiry?"
              className="space-y-5"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">Send an Inquiry</h2>
                <p className="mt-1 text-sm text-white/70">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
              </div>

              <input type="hidden" name="packageId" value={params.package ?? ""} />
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm font-medium text-white/90">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    minLength={2}
                    required
                    placeholder="John Doe"
                    className="border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium text-white/90">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 00000 00000"
                    className="border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-white/90">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-sm font-medium text-white/90">Your Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  minLength={10}
                  required
                  placeholder="How can we help you plan your journey?"
                  className="resize-none border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
                />
              </div>

              {message && !isComplete && (
                <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-300">{message}</p>
              )}

              <Button type="submit" className="w-full rounded-xl bg-[#f29a2e] py-3 font-semibold text-white transition hover:bg-[#e4891f]">
                Send Inquiry →
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
