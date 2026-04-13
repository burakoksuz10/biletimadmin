// Button Component - "The Ethereal Stage" Design System
// Features: Gradient primary, glass secondary, full rounded, shadow glow

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles - full rounded, smooth transitions
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Signature gradient with shadow glow
        primary: "bg-gradient-primary text-white shadow-glow hover:shadow-glow-lg hover:bg-gradient-primary-hover active:scale-[0.98]",

        // Secondary Glass - Glassmorphism effect
        secondary: "bg-white/30 dark:bg-white/10 text-primary backdrop-blur-glass border border-white/20 hover:bg-white/40 dark:hover:bg-white/15 active:scale-[0.98]",

        // Outline - Ghost border (no solid border)
        outline: "bg-transparent text-on-surface dark:text-on-surface border border-outline/20 hover:border-outline/40 hover:bg-surface/50 active:scale-[0.98]",

        // Ghost - Minimal, no border
        ghost: "text-on-surface dark:text-on-surface hover:bg-surface-low/50 active:scale-[0.98]",

        // Success - Green for success actions
        success: "bg-success text-on-success shadow-glow hover:shadow-glow-sm active:scale-[0.98]",

        // Danger - Red for destructive actions
        danger: "bg-danger text-on-danger shadow-glow hover:shadow-glow-sm active:scale-[0.98]",

        // Link - Text only
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Large - Hero buttons, CTAs
        default: "h-14 px-8 text-base",

        // Medium - Form actions, card buttons
        medium: "h-11 px-6 text-sm",

        // Small - Compact buttons
        small: "h-9 px-4 text-xs",

        // Icon - Square icon buttons
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
