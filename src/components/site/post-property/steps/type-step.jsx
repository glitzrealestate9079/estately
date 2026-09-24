"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Briefcase, Building, Home, TreePine, Trees, Users, Warehouse } from "lucide-react";
import { PROPERTY_TYPES_BY_TRANSACTION } from "@/schemas/site/postPropertySchema";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  Apartment: Building,
  Villa: Home,
  "Independent House": Home,
  Plot: Trees,
  Farmhouse: TreePine,
  Commercial: Briefcase,
  "Office Space": Warehouse,
  "PG / Co-living": Users,
};

export function TypeStep() {
  const { control, watch, formState: { errors } } = useFormContext();
  const listingType = watch("listingType");
  const options = PROPERTY_TYPES_BY_TRANSACTION[listingType] ?? PROPERTY_TYPES_BY_TRANSACTION.Sale;

  return (
    <div>
      <p className="mb-4 text-sm text-foreground-muted">Select the property type that best describes your listing.</p>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {options.map((option) => {
              const Icon = TYPE_ICONS[option] ?? Building;
              const active = field.value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => field.onChange(option)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                    active ? "border-primary-600 bg-primary-50 dark:bg-primary-500/10" : "border-border-subtle bg-surface hover:border-primary-300"
                  )}
                >
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", active ? "bg-primary-600 text-white" : "bg-surface-muted text-foreground-muted")}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">{option}</span>
                </button>
              );
            })}
          </div>
        )}
      />
      {errors.type && <p className="mt-2 text-xs font-medium text-error-600">{errors.type.message}</p>}
    </div>
  );
}
