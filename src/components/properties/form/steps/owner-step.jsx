"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SELLER_TYPES = ["Owner", "Agent", "Builder/Developer"];

export function OwnerStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <FormField label="Owner Name" required error={errors.ownerName?.message} htmlFor="ownerName">
        <Input id="ownerName" placeholder="e.g. Ramesh Agarwal" error={!!errors.ownerName} {...register("ownerName")} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone" required error={errors.ownerPhone?.message} htmlFor="ownerPhone">
          <Input id="ownerPhone" placeholder="+91 98765 43210" error={!!errors.ownerPhone} {...register("ownerPhone")} />
        </FormField>
        <FormField label="Email" required error={errors.ownerEmail?.message} htmlFor="ownerEmail">
          <Input id="ownerEmail" type="email" placeholder="owner@example.com" error={!!errors.ownerEmail} {...register("ownerEmail")} />
        </FormField>
      </div>
      <FormField label="Seller Type" required error={errors.sellerType?.message}>
        <Controller
          control={control}
          name="sellerType"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger error={!!errors.sellerType}>
                <SelectValue placeholder="Select seller type" />
              </SelectTrigger>
              <SelectContent>
                {SELLER_TYPES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    </div>
  );
}
