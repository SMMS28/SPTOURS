"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { WA_ENQUIRE } from "@/lib/site";

type Mode = "login" | "register" | "forgot";

const field =
  "h-[54px] rounded-xl border-[1.5px] border-[#E0D7C4] bg-white px-4 text-[15px] text-ink transition-colors focus:border-clay focus:outline-none";
const lbl = "text-[12.5px] font-semibold text-[#4c4839]";

export function AuthShell({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <div className="grid min-h-screen lg:grid-cols-[46%_54%]">
      {/* left: form */}
      <div className="relative flex flex-col px-[6vw] py-10">
        <Link href="/" className="self-start">
          <Image src="/images/logo-2026.png" alt="SP Tours and Travels" width={240} height={90} className="h-[52px] w-auto" priority />
        </Link>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          {mode !== "forgot" && (
            <div className="mb-[34px] inline-flex gap-1 self-start rounded-full bg-[#ece4d4] p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className="rounded-full px-[22px] py-2.5 text-sm font-bold transition-colors"
                  style={{ background: mode === m ? "#17130D" : "transparent", color: mode === m ? "#F5F0E6" : "#17130D" }}
                >
                  {m === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          {mode === "login" && (
            <div>
              <Eyebrow>Welcome back</Eyebrow>
              <Heading>Sign in to your trips.</Heading>
              <Sub>Pick up where you left off — saved journeys, bookings and quotes.</Sub>
              <div className="flex flex-col gap-4">
                <Field label="Email"><input type="email" placeholder="you@email.com" className={field} /></Field>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <label className={lbl}>Password</label>
                    <button type="button" onClick={() => setMode("forgot")} className="text-[12.5px] font-semibold text-clay">Forgot?</button>
                  </div>
                  <input type="password" placeholder="••••••••" className={field} />
                </div>
              </div>
              <Primary>Sign in →</Primary>
            </div>
          )}

          {mode === "register" && (
            <div>
              <Eyebrow>Join SP Tours</Eyebrow>
              <Heading>Create your account.</Heading>
              <Sub>Save journeys, track bookings and get faster quotes.</Sub>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full name"><input type="text" placeholder="Ananya Sharma" className={field} /></Field>
                  <Field label="Phone"><input type="tel" placeholder="+91 98xxx xxxxx" className={field} /></Field>
                </div>
                <Field label="Email"><input type="email" placeholder="you@email.com" className={field} /></Field>
                <Field label="Password"><input type="password" placeholder="Minimum 8 characters" className={field} /></Field>
              </div>
              <Primary>Create account →</Primary>
              <p className="mt-3.5 text-center text-xs text-[#8a8578]">By continuing you agree to our Terms &amp; Privacy Policy.</p>
            </div>
          )}

          {mode === "forgot" && (
            <div>
              <Eyebrow>Reset password</Eyebrow>
              <Heading>Forgot your password?</Heading>
              <Sub>Enter your email and we&apos;ll send a secure reset link.</Sub>
              <Field label="Email"><input type="email" placeholder="you@email.com" className={field} /></Field>
              <Primary>Send reset link →</Primary>
              <button type="button" onClick={() => setMode("login")} className="mt-3.5 h-12 w-full rounded-[14px] border-[1.5px] border-ink/15 text-[14.5px] font-semibold transition-colors hover:bg-[#ece4d4]">← Back to sign in</button>
            </div>
          )}

          {mode !== "forgot" && (
            <div>
              <div className="my-[26px] flex items-center gap-3.5">
                <span className="h-px flex-1 bg-ink/15" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#a49d8c]">or</span>
                <span className="h-px flex-1 bg-ink/15" />
              </div>
              <a href={WA_ENQUIRE} target="_blank" rel="noopener noreferrer" className="flex h-[54px] items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-ink/15 bg-white text-[14.5px] font-bold transition-colors hover:bg-[#f3ece0]">
                Book without an account · WhatsApp
              </a>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#8a8578]">© {new Date().getFullYear()} SP Tours &amp; Travels · Rajahmundry</p>
      </div>

      {/* right: image */}
      <div className="relative hidden overflow-hidden bg-inkdeep lg:block">
        <div className="animate-kb absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg/nilotpal-kalita-24vPDG707eM-unsplash.jpg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,11,0.35)_0%,rgba(20,17,11,0.25)_45%,rgba(20,17,11,0.8)_100%)]" />
        <div className="absolute inset-x-12 bottom-[52px] text-paper">
          <p className="mb-[18px] font-mono text-xs uppercase tracking-[0.24em] text-paper/75">SP Tours &amp; Travels · Since 1986</p>
          <p className="max-w-[560px] font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em]">Where the clouds come down to meet you.</p>
          <p className="mt-[18px] max-w-[460px] text-[15px] text-paper/85">Your account keeps every Northeast journey, quote and booking in one place.</p>
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-clay">{children}</p>;
}
function Heading({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-2.5 font-display text-[40px] font-bold leading-[1.02] tracking-[-0.02em]">{children}</h1>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mb-[30px] text-[15px] text-mutedfg">{children}</p>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><label className={lbl}>{label}</label>{children}</div>;
}
function Primary({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="mt-6 h-14 w-full rounded-[14px] bg-clay text-[15.5px] font-bold text-paper shadow-[0_16px_38px_-18px_rgba(155,106,76,0.9)] transition-[background,transform] duration-300 hover:-translate-y-0.5 hover:bg-clay-dark">
      {children}
    </button>
  );
}
