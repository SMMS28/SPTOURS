import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendPasswordReset } from "@/lib/actions/auth";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold">Forgot password</h1>
      <p className="mt-2 text-sm text-muted-foreground">We will send a reset link to your email.</p>

      <form
        action={sendPasswordReset}
        data-confirm-message="Confirm sending password reset link?"
        className="mt-6 space-y-4 rounded-lg border p-6"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>

      {params.message && <p className="mt-4 text-sm text-muted-foreground">{params.message}</p>}
    </section>
  );
}
