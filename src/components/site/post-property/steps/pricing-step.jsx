"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { formatIndianCurrency } from "@/lib/site/format";

export function PricingStep() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const listingType = watch("listingType");
  const price = watch("price");
  const carpetArea = watch("carpetArea");
  const isSale = listingType === "Sale";

  const pricePerSqft = isSale && price && carpetArea ? Math.round(Number(price) / Number(carpetArea)) : null;

  return (
    <div className="space-y-5">
      <FormField
        label={isSale ? "Expected Price (₹)" : "Monthly Rent (₹)"}
        required
        error={errors.price?.message}
        htmlFor="price"
        hint={price ? formatIndianCurrency(Number(price)) : undefined}
      >
        <Input id="price" type="number" min={0} error={!!errors.price} {...register("price")} />
      </FormField>

      {pricePerSqft && <p className="-mt-3 text-xs text-foreground-muted">≈ ₹{new Intl.NumberFormat("en-IN").format(pricePerSqft)}/sq.ft</p>}

      <div className="grid grid-cols-2 gap-5">
        <FormField label="Maintenance (₹/month)" error={errors.maintenance?.message} htmlFor="maintenance">
          <Input id="maintenance" type="number" min={0} error={!!errors.maintenance} {...register("maintenance")} />
        </FormField>
        {!isSale && (
          <FormField label="Security Deposit (₹)" error={errors.securityDeposit?.message} htmlFor="securityDeposit">
            <Input id="securityDeposit" type="number" min={0} error={!!errors.securityDeposit} {...register("securityDeposit")} />
          </FormField>
        )}
      </div>

      {isSale && (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <Controller control={control} name="negotiable" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />} />
          Price is negotiable
        </label>
      )}
    </div>
  );
}
