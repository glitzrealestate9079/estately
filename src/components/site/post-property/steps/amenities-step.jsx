"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Check } from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AmenitiesStep() {
  const { control } = useFormContext();

  return (
    <div>
      <p className="mb-4 text-sm text-foreground-muted">Select everything that applies — this helps your listing rank higher for relevant searches.</p>
      <Controller
        control={control}
        name="amenities"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {AMENITIES.map((amenity) => {
              const active = field.value.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => {
                    field.onChange(active ? field.value.filter((a) => a !== amenity) : [...field.value, amenity]);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" : "border-border-subtle text-foreground-muted hover:border-primary-300"
                  )}
                >
                  <span className={cn("flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border", active ? "border-primary-600 bg-primary-600 text-white" : "border-border-subtle")}>
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  {amenity}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
