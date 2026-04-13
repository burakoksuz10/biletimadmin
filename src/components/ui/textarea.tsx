// Textarea Component - "The Ethereal Stage" Design System
// Features: Clean, readable, matches Input

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex w-full rounded-lg bg-white dark:bg-surface-higher text-on-surface dark:text-on-surface placeholder:text-on-surface-variant/30 px-4 py-2.5 body-md resize-y",
          "transition-all duration-200",
          "border border-outline/40 dark:border-outline/30",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-white dark:focus:bg-surface-highest",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "focus:ring-danger/30 focus:border-danger/50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
