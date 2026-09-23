import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef(({ className, error, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "flex w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-error-500 focus-visible:ring-error-500/30" : "border-border-subtle focus:border-primary-500",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
