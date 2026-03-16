// Textarea Component - Multi-line text input
// Based on Figma design tokens

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
          "flex min-h-[80px] w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#0d0d12] placeholder:text-[#666d80] focus:outline-none focus:ring-2 focus:ring-[#09724a] focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-[#df1c41] ring-[#df1c41]",
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
