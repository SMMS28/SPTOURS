import Link from "next/link";
import Image from "next/image";
import { WA_ENQUIRE } from "@/lib/site";
import {
  signIn,
  signUp,
  signInWithGoogle,
  signInWithMagicLink,
  sendPasswordReset,
} from "@/lib/actions/auth";

export type AuthMode = "login" | "register" | "forgot";

const field =
  "h-[54px] rounded-xl border-[1.5px] border-[#E0D7C4] bg-white px-4 text-[15px] text-ink transition-colors focus:border-clay focus:outline-none";
const lbl = "text-[12.5px] font-semibold text-[#4c4839]";

/**
 * Split sign-in / register / reset screen.
 *
 * The redesign shipped this as a client component with a useState mode toggle and
 * inert `type="button"` submits. It's a server component here because the mode is
 * driven by the route instead: the auth server actions report failures by
 * redirecting to /login?message=… or /register?message=…, so the visible mode has
 * to match the URL or an error would surface on the wrong panel. The pill toggle
 * is therefore <Link>s rather than state — same look, correct round-trip.
 */
export function AuthShell({
  mode = "login",
  message,
  next = "/",
}: {
  mode?: AuthMode;
  message?: string;
  next?: string;
}) {
  const withNext = (path: string) =>
    next && next !== "/" ? `${path}?next=${encodeURIComponent(next)}` : path;

  return (
    <div className="grid min-h-screen lg:grid-cols-[46%_54%]">
      {/* left: form */}
      <div className="relative flex flex-col px-[6vw] py-10">
        <Link href="/" className="self-start">
          <Image
            src="/images/logo-2026.png"
            alt="SP Tours and Travels"
            width={240}
            height={90}
            className="h-[52px] w-auto"
            priority
          />
        </Link>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          {mode !== "forgot" && (
            <div className="mb-[34px] inline-flex gap-1 self-start rounded-full bg-[#ece4d4] p-1">
              {(
                [
                  ["login", "Sign in", "/login"],
                  ["register", "Create account", "/register"],
                ] as const
              ).map(([m, label, href]) => (
                <Link
                  key={m}
                  href={withNext(href)}
                  className="rounded-full px-[22px] py-2.5 text-sm font-bold transition-colors"
                  style={{
                    background: mode === m ? "#17130D" : "transparent",
                    color: mode === m ? "#F5F0E6" : "#17130D",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {message ? (
            <p className="mb-6 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-[13.5px] leading-relaxed text-[#5b4636]">
              {message}
            </p>
          ) : null}

          {mode === "login" && (
            <div>
              <Eyebrow>Welcome back</Eyebrow>
              <Heading>Sign in to your trips.</Heading>
              <Sub>Pick up where you left off — saved journeys, bookings and quotes.</Sub>
              <form action={signIn} className="flex flex-col gap-4">
                <input type="hidden" name="next" value={next} />
                <Field label="Email">
                  <input name="email" type="email" required placeholder="you@email.com" className={field} />
                </Field>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <label className={lbl} htmlFor="password">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-[12.5px] font-semibold text-clay">
                      Forgot?
                    </Link>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    className={field}
                  />
                </div>
                <Primary>Sign in →</Primary>
              </form>
            </div>
          )}

          {mode === "register" && (
            <div>
              <Eyebrow>Join SP Tours</Eyebrow>
              <Heading>Create your account.</Heading>
              <Sub>Save journeys, track bookings and get faster quotes.</Sub>
              <form action={signUp} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full name">
                    <input name="full_name" type="text" placeholder="Ananya Sharma" className={field} />
                  </Field>
                  <Field label="Phone">
                    <input name="phone" type="tel" placeholder="+91 98xxx xxxxx" className={field} />
                  </Field>
                </div>
                <Field label="Email">
                  <input name="email" type="email" required placeholder="you@email.com" className={field} />
                </Field>
                <Field label="Password">
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className={field}
                  />
                </Field>
                <Primary>Create account →</Primary>
              </form>
              <p className="mt-3.5 text-center text-xs text-[#8a8578]">
                By continuing you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms
                </Link>{" "}
                &amp;{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          )}

          {mode === "forgot" && (
            <div>
              <Eyebrow>Reset password</Eyebrow>
              <Heading>Forgot your password?</Heading>
              <Sub>Enter your email and we&apos;ll send a secure reset link.</Sub>
              <form action={sendPasswordReset}>
                <Field label="Email">
                  <input name="email" type="email" required placeholder="you@email.com" className={field} />
                </Field>
                <Primary>Send reset link →</Primary>
              </form>
              <Link
                href="/login"
                className="mt-3.5 flex h-12 w-full items-center justify-center rounded-[14px] border-[1.5px] border-ink/15 text-[14.5px] font-semibold transition-colors hover:bg-[#ece4d4]"
              >
                ← Back to sign in
              </Link>
            </div>
          )}

          {mode !== "forgot" && (
            <div>
              <div className="my-[26px] flex items-center gap-3.5">
                <span className="h-px flex-1 bg-ink/15" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#a49d8c]">or</span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>

              {/* Google + magic link had no slot in the redesign; both are existing
                  sign-in methods, so they'd have been silently dropped. */}
              <form action={signInWithGoogle}>
                <input type="hidden" name="next" value={next} />
                <button
                  type="submit"
                  className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-ink/15 bg-white text-[14.5px] font-bold transition-colors hover:bg-[#f3ece0]"
                >
                  Continue with Google
                </button>
              </form>

              <form action={signInWithMagicLink} className="mt-3 flex gap-2.5">
                <input type="hidden" name="next" value={next} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email me a sign-in link"
                  className={`${field} min-w-0 flex-1`}
                />
                <button
                  type="submit"
                  className="h-[54px] shrink-0 rounded-[14px] border-[1.5px] border-ink/15 bg-white px-5 text-[14px] font-bold transition-colors hover:bg-[#f3ece0]"
                >
                  Send
                </button>
              </form>

              <a
                href={WA_ENQUIRE}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-ink/15 bg-white text-[14.5px] font-bold transition-colors hover:bg-[#f3ece0]"
              >
                Book without an account · WhatsApp
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#8a8578]">
          © {new Date().getFullYear()} SP Tours &amp; Travels · Rajahmundry
        </p>
      </div>

      {/* right: image */}
      <div className="relative hidden overflow-hidden bg-inkdeep lg:block">
        <div
          className="animate-kb absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.35)_0%,rgba(20,17,11,0.25)_45%,rgba(20,17,11,0.8)_100%)]" />
        <div className="absolute inset-x-12 bottom-[52px] text-paper">
          <p className="mb-[18px] font-mono text-xs uppercase tracking-[0.24em] text-paper/75">
            SP Tours &amp; Travels · Since 1986
          </p>
          <p className="max-w-[560px] font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em]">
            Where the clouds come down to meet you.
          </p>
          <p className="mt-[18px] max-w-[460px] text-[15px] text-paper/85">
            Your account keeps every Northeast journey, quote and booking in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-clay">{children}</p>;
}
function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-2.5 font-display text-[40px] font-bold leading-[1.02] tracking-[-0.02em]">
      {children}
    </h1>
  );
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mb-[30px] text-[15px] text-mutedfg">{children}</p>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={lbl}>{label}</label>
      {children}
    </div>
  );
}
function Primary({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="mt-6 h-14 w-full rounded-[14px] bg-clay text-[15.5px] font-bold text-paper shadow-[0_16px_38px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark"
    >
      {children}
    </button>
  );
}
