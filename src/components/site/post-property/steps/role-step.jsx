"use client";

import { Controller, useFormContext } from "react-hook-form";
import { SELLER_ROLE_OPTIONS } from "@/schemas/site/postPropertySchema";
import { OptCard } from "@/components/site/post-property/opt-card";
import { Field } from "@/components/site/post-property/form-controls";

const ICONS = { Owner: "bi-person", Agent: "bi-briefcase", "Builder/Developer": "bi-buildings" };

export function RoleStep() {
  const { control, register, watch, formState: { errors } } = useFormContext();
  const sellerType = watch("sellerType");

  return (
    <div>
      <h1>Who are you?</h1>
      <p className="lead">This decides which details we ask for next.</p>
      <Controller
        control={control}
        name="sellerType"
        render={({ field }) => (
          <div className="opt-grid mt-24">
            {SELLER_ROLE_OPTIONS.map((option) => (
              <OptCard
                key={option.value}
                icon={ICONS[option.value]}
                title={option.label}
                description={option.description}
                selected={field.value === option.value}
                onClick={() => field.onChange(option.value)}
                large
              />
            ))}
          </div>
        )}
      />
      {errors.sellerType && <span className="error-text"><i className="bi bi-exclamation-circle" />{errors.sellerType.message}</span>}

      {sellerType === "Agent" && (
        <div className="form-grid mt-24">
          <Field label="Agency name" optional error={errors.agencyName?.message}>
            <input className="input" placeholder="e.g. Sharma Realty" {...register("agencyName")} />
          </Field>
        </div>
      )}
    </div>
  );
}
