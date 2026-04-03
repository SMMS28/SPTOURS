"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const sanitizeNextPath = (value: string) => (value.startsWith("/") ? value : "/");

/**
 * Always returns the canonical site URL from NEXT_PUBLIC_SITE_URL.
 * This is the only source of truth for building callback URLs.
 * On Vercel this is "https://sptours.vercel.app"; locally "http://localhost:3000".
 */
const getSiteBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
};

export const signUp = async (formData: FormData) => {
  if (!hasSupabaseEnv) {
    redirect("/register?message=Add%20Supabase%20env%20variables%20to%20enable%20authentication.");
  }

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/register?message=Enter%20a%20valid%20email%20and%20a%20password%20with%20at%20least%208%20characters.");
  }

  const supabase = await createClient();
  const siteUrl = getSiteBaseUrl();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/register?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/register?message=Check%20your%20email%20to%20verify%20your%20account.");
};

export const signIn = async (formData: FormData) => {
  if (!hasSupabaseEnv) {
    redirect("/login?message=Add%20Supabase%20env%20variables%20to%20enable%20authentication.");
  }

  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?message=Enter%20a%20valid%20email%20and%20password.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  const nextPath = String(formData.get("next") ?? "/").trim() || "/";

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath.startsWith("/") ? nextPath : "/");
};

export const signInWithMagicLink = async (formData: FormData) => {
  if (!hasSupabaseEnv) {
    redirect("/login?message=Add%20Supabase%20env%20variables%20to%20enable%20authentication.");
  }

  const email = z.string().email().safeParse(formData.get("email"));
  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/").trim() || "/");

  if (!email.success) {
    redirect("/login?message=Enter%20a%20valid%20email%20for%20magic%20link.");
  }

  const supabase = await createClient();
  const siteUrl = getSiteBaseUrl();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Magic%20link%20sent.%20Check%20your%20email.");
};

export const signInWithGoogle = async (formData: FormData) => {
  if (!hasSupabaseEnv) {
    redirect("/login?message=Add%20Supabase%20env%20variables%20to%20enable%20authentication.");
  }

  const nextPath = sanitizeNextPath(String(formData.get("next") ?? "/").trim() || "/");
  const supabase = await createClient();

  // Build an absolute callback URL using the canonical site URL.
  // This must match what is registered in Supabase → Auth → URL Configuration.
  const siteUrl = getSiteBaseUrl();
  const redirectTo = `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        // Always show account-chooser so users can pick a Google account
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    redirect(
      `/login?message=${encodeURIComponent(error?.message || "Could not start Google sign in.")}`
    );
  }

  redirect(data.url);
};

export const signOut = async () => {
  if (!hasSupabaseEnv) {
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};

export const sendPasswordReset = async (formData: FormData) => {
  if (!hasSupabaseEnv) {
    redirect(
      "/forgot-password?message=Add%20Supabase%20env%20variables%20to%20enable%20password%20reset."
    );
  }

  const email = z.string().email().safeParse(formData.get("email"));

  if (!email.success) {
    redirect("/forgot-password?message=Enter%20a%20valid%20email%20address.");
  }

  const supabase = await createClient();
  const siteUrl = getSiteBaseUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${siteUrl}/auth/callback?next=/profile`,
  });

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=Password%20reset%20link%20sent.%20Check%20your%20email.");
};
