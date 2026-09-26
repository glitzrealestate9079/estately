"use client";

import { Controller, useFormContext } from "react-hook-form";
import { PROPERTY_TYPES_BY_TRANSACTION } from "@/schemas/site/postPropertySchema";
import { OptCard } from "@/components/site/post-property/opt-card";

const TYPE_ICONS = {
  Apartment: "bi-building",
  Villa: "bi-house-heart",
  "Independent House": "bi-house",
  Plot: "bi-bounding-box",
  Farmhouse: "bi-tree",
  Commercial: "bi-shop",
  "Office Space": "bi-building",
  "PG / Co-living": "bi-people",
};

export function TypeStep() {
  const { control, watch, formState: { errors } } = useFormContext();
  const listingType = watch("listingType");
  const options = PROPERTY_TYPES_BY_TRANSACTION[listingType] ?? PROPERTY_TYPES_BY_TRANSACTION.Sale;

  return (
    <div>
      <h1>What type of property?</h1>
      <p className="lead">We&apos;ll only show fields that apply to this type.</p>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <div className="opt-grid mt-24">
            {options.map((option) => (
              <OptCard
                key={option}
                icon={TYPE_ICONS[option] ?? "bi-building"}
                title={option}
                selected={field.value === option}
                onClick={() => field.onChange(option)}
              />
            ))}
          </div>
        )}
      />
      {errors.type && <span className="error-text"><i className="bi bi-exclamation-circle" />{errors.type.message}</span>}
    </div>
  );
}
