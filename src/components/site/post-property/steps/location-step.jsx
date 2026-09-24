"use client";

import { Controller, useFormContext } from "react-hook-form";
import { MapPin } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PUBLIC_CITIES } from "@/lib/site/site-data";

export function LocationStep() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-5">
      <FormField label="City" required error={errors.city?.message}>
        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger error={!!errors.city}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {PUBLIC_CITIES.map((city) => (
                  <SelectItem key={city.id} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Locality" required error={errors.locality?.message} htmlFor="locality">
          <Input id="locality" placeholder="e.g. Malviya Nagar" icon={MapPin} error={!!errors.locality} {...register("locality")} />
        </FormField>
        <FormField label="Pincode" required error={errors.pincode?.message} htmlFor="pincode">
          <Input id="pincode" placeholder="e.g. 302017" maxLength={6} error={!!errors.pincode} {...register("pincode")} />
        </FormField>
      </div>

      <FormField label="Full Address" required error={errors.address?.message} htmlFor="address" hint="This is shared with a buyer only after they enquire.">
        <Input id="address" placeholder="House / flat no., street, landmark" error={!!errors.address} {...register("address")} />
      </FormField>

      <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border-subtle bg-surface-muted">
        <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
          <MapPin className="h-4 w-4" /> Map pin confirmation appears here after address is entered
        </p>
      </div>
    </div>
  );
}
