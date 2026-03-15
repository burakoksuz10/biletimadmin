// Badge Component - Status badges from Figma
// Published (green), Pending (yellow), Cancelled (red)

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        // Published / Active / Approved - Green
        success: "bg-[#effefa] text-[#09724a]",
        
        // Pending / Draft - Yellow/Orange
        warning: "bg-[#fff8f0] text-[#d39c3d]",
        
        // Cancelled / Rejected / Banned - Red
        danger: "bg-[#fff0f3] text-[#df1c41]",
        
        // Info / Default - Blue
        info: "bg-[#f0fbff] text-[#0f71d4]",
        
        // Neutral - Gray
        neutral: "bg-[#f7f7f7] text-[#666d80]",
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
            "bg-[#09724a]": variant === "success",
            "bg-[#d39c3d]": variant === "warning",
            "bg-[#df1c41]": variant === "danger",
            "bg-[#0f71d4]": variant === "info",
            "bg-[#666d80]": variant === "neutral" || !variant,
          })}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
