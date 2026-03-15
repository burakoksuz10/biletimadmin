// Button Component - Figma Design Tokens
// Based on Figma frames: Login button, Create Event button, etc.

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[52px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary - Green button (#09724a) - Login button style
        primary: "bg-[#09724a] text-white hover:bg-[#066d41] focus-visible:ring-[#09724a]",
        
        // Secondary - White with border
        secondary: "bg-white text-[#0d0d12] border border-[#e5e7eb] hover:bg-[#f7f7f7] hover:text-[#0d0d12]",
        
        // Outline - No background, border only
        outline: "border border-[#e5e7eb] bg-transparent text-[#0d0d12] hover:bg-[#f7f7f7]",
        
        // Ghost - No background, no border
        ghost: "text-[#0d0d12] hover:bg-[#f7f7f7]",
        
        // Success - Green background for success actions
        success: "bg-[#09724a] text-white hover:bg-[#066d41]",
        
        // Danger - Red background for delete actions
        danger: "bg-[#df1c41] text-white hover:bg-[#c4183a]",
        
        // Link - Text only, no background
        link: "text-[#09724a] underline-offset-4 hover:underline",
      },
      size: {
        // Large - Login button (52px height)
        default: "h-[52px] px-8 py-3 text-base",
        
        // Medium - Create Event button (40px height, 8px radius)
        medium: "h-10 px-4 py-2 text-sm rounded-lg",
        
        // Small - Icon buttons, pagination
        small: "h-8 px-3 py-1 text-xs rounded-md",
        
        // Icon - Square icon buttons
        icon: "h-10 w-10 rounded-lg",
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
