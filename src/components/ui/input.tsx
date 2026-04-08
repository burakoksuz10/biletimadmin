// Input Component - Figma Design Tokens
// Based on Figma Login page input fields (52px height, 10px radius)

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
          // Base styles from Figma
          "flex h-[52px] w-full rounded-xl bg-[#f7f7f7] dark:bg-[#374151] border border-[#e5e7eb] dark:border-[#374151] text-[#0d0d12] dark:text-[#f9fafb] text-base",
          "placeholder:text-[#818898] dark:placeholder:text-[#6b7280]",
          "focus:outline-none focus:ring-2 focus:ring-[#09724a] focus:ring-offset-2 dark:focus:ring-offset-[#111827]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error state
          error && "ring-2 ring-[#df1c41]",
          // File input specific
          type === "file" && "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#f7f7f7] file:text-[#0d0d12]",
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
