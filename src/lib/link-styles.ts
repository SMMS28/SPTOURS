import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export const linkButton = (variant: "default" | "outline" | "ghost" = "default") => {
  const variantClass =
    variant === "outline"
      ? "border border-border bg-background px-3 py-2 hover:bg-muted"
      : variant === "ghost"
        ? "px-3 py-2 hover:bg-muted"
        : "bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90";

  return cn(base, variantClass);
};

export const linkButtonSm = (variant: "default" | "outline" = "default") => {
  const variantClass =
    variant === "outline"
      ? "border border-border bg-background px-2.5 py-1.5 text-xs hover:bg-muted"
      : "bg-primary px-2.5 py-1.5 text-xs text-primary-foreground hover:bg-primary/90";

  return cn(base, variantClass);
};
