import Link from "next/link";
import Image from "next/image";

export const SiteFooter = () => {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/60 bg-white/72 p-5 text-sm shadow-[0_20px_45px_-30px_rgba(15,23,42,0.26)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-2026.png"
              alt="SP Tours and Travels logo"
              width={438}
              height={173}
              className="h-12 w-auto object-contain sm:h-14"
            />
            <div>
              <p className="text-base font-semibold text-foreground">SP Tours & Travels</p>
              <p className="text-xs text-muted-foreground">Trusted since 1986</p>
            </div>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Managing Partner: S S Rao</p>
          <p className="mt-1 text-muted-foreground">&quot;Your Journey, Our Responsibility&quot;</p>
          <div className="mt-3 grid gap-1.5 text-foreground sm:grid-cols-2">
            <p>Phone: +91 92477 77996</p>
            <p>Email: sptoursrjy@gmail.com</p>
            <p>Website: www.sptours.com</p>
            <p>Location: T1, S. R. Residency Sri Lakshmi nagar, Namavaram Road, Morampudi, RAJAHMUNDRY, ANDHRA PRADESH 533107, India</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 pb-6 md:grid-cols-3">
          <div>
            <p className="font-medium text-foreground">Products</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/packages?category=holiday_packages" className="hover:text-foreground">Holiday packages</Link>
              <Link href="/packages?category=india_tour_packages" className="hover:text-foreground">India tour packages</Link>
              <Link href="/packages?category=international_customized_tours" className="hover:text-foreground">International customized tours</Link>
              <Link href="/packages?category=international_tour_packages" className="hover:text-foreground">International tour packages</Link>
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground">Support</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
              <Link href="/faqs" className="hover:text-foreground">FAQs</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy policy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms & conditions</Link>
            </div>
          </div>
          <div>
            <p className="font-medium text-foreground">Explore</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/services" className="hover:text-foreground">All services</Link>
              <Link href="/travel-services" className="hover:text-foreground">Hotels & rentals</Link>
              <Link href="/mice" className="hover:text-foreground">MICE</Link>
              <Link href="/special-tours" className="hover:text-foreground">Special tours</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6">
          © {new Date().getFullYear()} SP TOURS & TRAVELS. Built with Next.js + Supabase.
        </div>
      </div>
    </footer>
  );
};
