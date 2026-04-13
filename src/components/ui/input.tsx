// Input Component - "The Ethereal Stage" Design System
// Features: Clean, readable with proper padding

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-lg bg-white dark:bg-surface-higher text-on-surface dark:text-on-surface placeholder:text-on-surface-variant/30 px-4 py-2.5 body-md",
          "transition-all duration-200",
          "border border-outline/40 dark:border-outline/30",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-white dark:focus:bg-surface-highest",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "focus:ring-danger/30 focus:border-danger/50",
          type === "file" && "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gradient-primary file:text-on-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
