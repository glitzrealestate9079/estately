"use client";

import { Controller, useFormContext } from "react-hook-form";
import { transactionOptionsFor } from "@/schemas/site/postPropertySchema";
import { OptCard } from "@/components/site/post-property/opt-card";

export function TransactionStep() {
  const { control, setValue, watch, formState: { errors } } = useFormContext();
  const sellerType = watch("sellerType");
  const currentType = watch("type");
  const isBuilder = sellerType === "Builder/Developer";
  const options = transactionOptionsFor(sellerType);

  return (
    <div>
      <h1>What do you want to do?</h1>
      <p className="lead">
        {isBuilder ? "Developers list new projects with unit types and RERA details." : "Choose one — you can post another property later."}
      </p>
      <Controller
        control={control}
        name="listingType"
        render={({ field }) => (
          <div className="opt-grid mt-24">
            {options.map((option) => (
              <OptCard
                key={option.value}
                icon={option.icon}
                title={option.label}
                description={option.description}
                selected={field.value === option.value}
                large
                onClick={() => {
                  field.onChange(option.value);
                  if (option.value === "PG") setValue("type", "PG / Co-living");
                  else if (currentType === "PG / Co-living") setValue("type", "");
                }}
              />
            ))}
          </div>
        )}
      />
      {errors.listingType && <span className="error-text"><i className="bi bi-exclamation-circle" />{errors.listingType.message}</span>}
    </div>
  );
}
