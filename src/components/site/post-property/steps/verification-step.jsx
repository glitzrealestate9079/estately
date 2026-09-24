"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function VerificationStep() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const listingType = watch("listingType");

  return (
    <div className="space-y-5">
      {listingType === "Sale" && (
        <FormField label="RERA Registration Number" error={errors.reraNumber?.message} htmlFor="reraNumber" hint="Optional — add it if this project/property is RERA registered.">
          <Input id="reraNumber" placeholder="e.g. RJ/2024/1234" {...register("reraNumber")} />
        </FormField>
      )}

      <div className="rounded-xl border border-border-subtle bg-surface-muted p-4 text-sm text-foreground-muted">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary-600" /> What happens next
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your listing goes live immediately after publishing.</li>
          <li>Your mobile number is verified via OTP — never shown publicly.</li>
          <li>Our team may review flagged listings for accuracy.</li>
        </ul>
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground">
        <Controller
          control={control}
          name="authorized"
          render={({ field }) => <Checkbox className="mt-0.5" checked={field.value} onCheckedChange={field.onChange} />}
        />
        I confirm the information provided is accurate and I&apos;m authorised to list this property.
      </label>
      {errors.authorized && <p className="text-xs font-medium text-error-600">{errors.authorized.message}</p>}
    </div>
  );
}
