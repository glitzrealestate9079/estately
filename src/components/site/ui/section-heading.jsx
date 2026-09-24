import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/ui/reveal";

export function SectionHeading({ eyebrow, title, description, action, align = "left", className }) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:text-center sm:items-center sm:justify-center sm:flex-col",
        className
      )}
    >
      <div className={cn(align === "center" && "max-w-xl")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-foreground-muted sm:text-base">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </Reveal>
  );
}
