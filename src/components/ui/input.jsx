import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, type = "text", icon: Icon, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-error-500 focus-visible:ring-error-500/30" : "border-border-subtle focus:border-primary-500",
          Icon && "pl-9",
          className
        )}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";
