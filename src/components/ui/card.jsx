import { cn } from "@/lib/utils";

export function Card({ className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface shadow-card",
        hover && "transition-shadow duration-200 hover:shadow-card-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex items-start justify-between gap-3 p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("font-display text-base font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-foreground-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center gap-3 border-t border-border-subtle p-5", className)}
      {...props}
    />
  );
}
