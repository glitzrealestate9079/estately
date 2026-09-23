"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_STATES } from "@/lib/constants";

const CITIES_BY_STATE = {
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bengaluru", "Mysuru"],
  "Delhi NCR": ["New Delhi", "Gurugram", "Noida"],
  Telangana: ["Hyderabad"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
  Gujarat: ["Ahmedabad", "Surat"],
  "West Bengal": ["Kolkata"],
};

export function LocationStep() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedState = watch("state");
  const cities = CITIES_BY_STATE[selectedState] ?? [];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Country" required error={errors.country?.message} htmlFor="country">
          <Input id="country" disabled {...register("country")} />
        </FormField>
        <FormField label="State" required error={errors.state?.message}>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.state}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="City" required error={errors.city?.message}>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={!selectedState}>
                <SelectTrigger error={!!errors.city}>
                  <SelectValue placeholder={selectedState ? "Select city" : "Select a state first"} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="Locality" required error={errors.locality?.message} htmlFor="locality">
          <Input id="locality" placeholder="e.g. Malviya Nagar" error={!!errors.locality} {...register("locality")} />
        </FormField>
      </div>

      <FormField label="Address" required error={errors.address?.message} htmlFor="address">
        <Input id="address" placeholder="Flat / House no., Street" error={!!errors.address} {...register("address")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Pincode" required error={errors.pincode?.message} htmlFor="pincode">
          <Input id="pincode" placeholder="302017" error={!!errors.pincode} {...register("pincode")} />
        </FormField>
        <FormField label="Latitude" error={errors.latitude?.message} htmlFor="latitude" hint="Optional">
          <Input id="latitude" type="number" step="any" placeholder="26.9124" {...register("latitude")} />
        </FormField>
        <FormField label="Longitude" error={errors.longitude?.message} htmlFor="longitude" hint="Optional">
          <Input id="longitude" type="number" step="any" placeholder="75.7873" {...register("longitude")} />
        </FormField>
      </div>
    </div>
  );
}
