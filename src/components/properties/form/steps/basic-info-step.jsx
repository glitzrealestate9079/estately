"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants";

export function BasicInfoStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-5">
      <FormField label="Property Title" required error={errors.title?.message} htmlFor="title">
        <Input id="title" placeholder="e.g. Premium 3 BHK Apartment in Malviya Nagar" error={!!errors.title} {...register("title")} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Property Type" required error={errors.propertyType?.message}>
          <Controller
            control={control}
            name="propertyType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.propertyType}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Listing Type" required error={errors.listingType?.message}>
          <Controller
            control={control}
            name="listingType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.listingType}>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Description"
        required
        error={errors.description?.message}
        htmlFor="description"
        hint="Describe the property's key highlights, amenities and neighbourhood."
      >
        <Textarea
          id="description"
          rows={5}
          placeholder="Write a compelling description…"
          error={!!errors.description}
          {...register("description")}
        />
      </FormField>
    </div>
  );
}
