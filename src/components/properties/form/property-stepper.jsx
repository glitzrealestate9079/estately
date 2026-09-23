"use client";

import { Check } from "lucide-react";
import { PROPERTY_STEPS } from "@/schemas/propertySchema";
import { cn } from "@/lib/utils";

export function PropertyStepper({ currentIndex, furthestIndex, onStepClick }) {
  return (
    <div className="scrollbar-none -mx-1 mb-6 flex gap-1 overflow-x-auto px-1 pb-1">
      {PROPERTY_STEPS.map((step, index) => {
        const completed = index < furthestIndex;
        const active = index === currentIndex;
        const clickable = index <= furthestIndex;

        return (
          <button
            key={step.key}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onStepClick(index)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                : completed
                  ? "border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-500"
                  : "border-border-subtle bg-surface text-foreground-muted",
              !clickable && "cursor-not-allowed opacity-60"
            )}
          >
            <span
              className={cn(
                "flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold",
                active
                  ? "bg-primary-600 text-white"
                  : completed
                    ? "bg-success-600 text-white"
                    : "bg-surface-muted text-foreground-muted"
              )}
            >
              {completed ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            {step.label}
          </button>
        );
      })}
    </div>
  );
}
