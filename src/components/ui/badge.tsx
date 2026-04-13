// Badge Component - "The Ethereal Stage" Design System
// Features: Soft pastel backgrounds with violet-tinted palette

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 label-md",
  {
    variants: {
      variant: {
        // Published / Active / Approved - Green with violet tint
        success: "bg-success-container/80 text-success dark:bg-success/20 dark:text-success",

        // Pending / Draft - Yellow/Orange
        warning: "bg-warning-container/80 text-warning dark:bg-warning/20 dark:text-warning",

        // Cancelled / Rejected / Banned - Red
        danger: "bg-danger-container/80 text-danger dark:bg-danger/20 dark:text-danger",

        // Info / Default - Blue with violet tint
        info: "bg-info-container/80 text-info dark:bg-info/20 dark:text-info",

        // Primary - Violet
        primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light",

        // Neutral - Gray
        neutral: "bg-surface-high text-on-surface-variant",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", {
            "bg-success": variant === "success",
            "bg-warning": variant === "warning",
            "bg-danger": variant === "danger",
            "bg-info": variant === "info",
            "bg-primary": variant === "primary",
            "bg-on-surface-variant": variant === "neutral" || !variant,
          })}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
