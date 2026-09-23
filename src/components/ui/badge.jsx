import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { STATUS_STYLES, DEFAULT_STATUS_STYLE } from "@/lib/constants";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-400",
        primary: "bg-primary-50 text-primary-700 ring-primary-600/20 dark:bg-primary-500/10 dark:text-primary-400",
        success: "bg-success-50 text-success-700 ring-success-600/20 dark:bg-success-500/10 dark:text-success-500",
        warning: "bg-warning-50 text-warning-700 ring-warning-600/20 dark:bg-warning-500/10 dark:text-warning-500",
        error: "bg-error-50 text-error-700 ring-error-600/20 dark:bg-error-500/10 dark:text-error-500",
        featured: "bg-featured-50 text-featured-600 ring-featured-500/20 dark:bg-featured-500/10 dark:text-featured-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status?.toLowerCase()] ?? DEFAULT_STATUS_STYLE;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        style,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
