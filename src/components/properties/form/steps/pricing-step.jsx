"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

export function PricingStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const price = Number(watch("price")) || 0;

  return (
    <div className="space-y-5">
      <FormField
        label="Price"
        required
        error={errors.price?.message}
        htmlFor="price"
        hint={price > 0 ? `≈ ${formatCurrency(price)}` : undefined}
      >
        <Input id="price" type="number" min="0" placeholder="12500000" error={!!errors.price} {...register("price")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Price per Sq.Ft" error={errors.pricePerSqft?.message} htmlFor="pricePerSqft">
          <Input id="pricePerSqft" type="number" min="0" placeholder="6750" {...register("pricePerSqft")} />
        </FormField>
        <FormField label="Maintenance (monthly)" error={errors.maintenance?.message} htmlFor="maintenance">
          <Input id="maintenance" type="number" min="0" placeholder="3500" {...register("maintenance")} />
        </FormField>
        <FormField label="Security Deposit" error={errors.securityDeposit?.message} htmlFor="securityDeposit">
          <Input id="securityDeposit" type="number" min="0" placeholder="100000" {...register("securityDeposit")} />
        </FormField>
      </div>
    </div>
  );
}
