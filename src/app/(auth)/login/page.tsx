import Link from "next/link";
import { HeroSlideshow } from "@/components/hero-slideshow";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle, signInWithMagicLink } from "@/lib/actions/auth";

export const metadata = { title: "Login | SP Tours & Travels" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/";

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center -mt-28 px-4 sm:-mt-32 lg:-mt-36">
      {/* Background Slideshow */}
      <HeroSlideshow
        images={[
          "/images/hero-bg/pexels-parijb-3678501.jpg",
          "/images/hero-bg/pexels-quang-nguyen-vinh-222549-6877977.jpg",
          "/images/hero-bg/pexels-rahulp9800-3275010.jpg"
        ]}
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.85)_0%,rgba(2,6,23,0.65)_100%)]" />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo-2026.png"
            alt="SP Tours and Travels"
            width={438}
            height={173}
            className="h-20 w-auto object-contain brightness-110 contrast-110 drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)] sm:h-24"
          />
        </div>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">Welcome back</h1>
          <p className="mt-1 text-sm text-white/70">Sign in to your account to continue.</p>

          <form action={signInWithGoogle}>
            <input type="hidden" name="next" value={nextPath} />
            <Button type="submit" variant="outline" className="mt-4 w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
              Continue with Google
            </Button>
          </form>

          <form action={signInWithMagicLink} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input type="hidden" name="next" value={nextPath} />
            <Input
              name="email"
              type="email"
              required
              placeholder="Send magic link to your email"
              className="border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
            />
            <Button type="submit" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              Magic Link
            </Button>
          </form>

          <form action={signIn} data-confirm-message="Confirm login?" className="mt-6 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-white/90">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                className="border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-white/90">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="border-white/25 bg-white/10 text-white placeholder:text-white/40 focus:border-[#f29a2e] focus:ring-[#f29a2e]/20"
              />
            </div>

            {params.message && (
              <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-300">{params.message}</p>
            )}

            <Button type="submit" className="w-full rounded-xl bg-[#f29a2e] py-2.5 font-semibold text-white hover:bg-[#e4891f]">
              Sign In
            </Button>
          </form>

          <div className="mt-5 space-y-2 text-center text-sm text-white/60">
            <p>
              Forgot password?{" "}
              <Link href="/forgot-password" className="font-medium text-[#f29a2e] hover:underline">Reset it</Link>
            </p>
            <p>
              New here?{" "}
              <Link href="/register" className="font-medium text-[#f29a2e] hover:underline">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
