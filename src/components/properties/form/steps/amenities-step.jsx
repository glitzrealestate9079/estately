"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Check } from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AmenitiesStep() {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="amenities"
      render={({ field }) => {
        function toggle(amenity) {
          const set = new Set(field.value ?? []);
          if (set.has(amenity)) set.delete(amenity);
          else set.add(amenity);
          field.onChange(Array.from(set));
        }

        return (
          <div>
            <p className="mb-4 text-sm text-foreground-muted">
              Select all amenities available at this property.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AMENITIES.map((amenity) => {
                const selected = field.value?.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggle(amenity)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                      selected
                        ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                        : "border-border-subtle text-foreground hover:border-navy-300"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border",
                        selected ? "border-primary-600 bg-primary-600 text-white" : "border-border-subtle"
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
