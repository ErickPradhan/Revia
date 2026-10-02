import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-surface-muted text-muted-foreground",
        primary: "border-primary/25 bg-primary-muted text-primary",
        success: "border-success/30 bg-success/15 text-success",
        warning: "border-warning/35 bg-warning/15 text-warning",
        danger: "border-danger/30 bg-danger/15 text-danger",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { badgeVariants };
