import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full border border-border bg-white px-3 py-2 text-base text-ink placeholder:text-muted outline-none focus-visible:border-ink/40 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
