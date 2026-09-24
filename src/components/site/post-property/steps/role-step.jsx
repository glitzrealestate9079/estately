"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Building2, UserRound, UserRoundCog } from "lucide-react";
import { SELLER_ROLE_OPTIONS } from "@/schemas/site/postPropertySchema";
import { cn } from "@/lib/utils";

const ICONS = { Owner: UserRound, Agent: UserRoundCog, "Builder/Developer": Building2 };

export function RoleStep() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div>
      <p className="mb-4 text-sm text-foreground-muted">This helps us show you the right fields and verification steps.</p>
      <Controller
        control={control}
        name="sellerType"
        render={({ field }) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SELLER_ROLE_OPTIONS.map((option) => {
              const Icon = ICONS[option.value];
              const active = field.value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-2.5 rounded-2xl border-2 p-5 text-left transition-all",
                    active ? "border-primary-600 bg-primary-50 dark:bg-primary-500/10" : "border-border-subtle bg-surface hover:border-primary-300"
                  )}
                >
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", active ? "bg-primary-600 text-white" : "bg-surface-muted text-foreground-muted")}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground">{option.label}</span>
                  <span className="text-xs text-foreground-muted">{option.description}</span>
                </button>
              );
            })}
          </div>
        )}
      />
      {errors.sellerType && <p className="mt-2 text-xs font-medium text-error-600">{errors.sellerType.message}</p>}
    </div>
  );
}
