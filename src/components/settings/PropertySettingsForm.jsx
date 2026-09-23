"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { PROPERTY_SETTINGS_DEFAULTS, propertySettingsSchema } from "@/schemas/settingsSchema";

export function PropertySettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(propertySettingsSchema),
    defaultValues: PROPERTY_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Property settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Max Images per Listing"
          required
          error={errors.maxImagesPerListing?.message}
          htmlFor="maxImagesPerListing"
        >
          <Input
            id="maxImagesPerListing"
            type="number"
            min="1"
            max="50"
            error={!!errors.maxImagesPerListing}
            {...register("maxImagesPerListing")}
          />
        </FormField>
        <FormField label="Listing Expiry (days)" required error={errors.listingExpiryDays?.message} htmlFor="listingExpiryDays">
          <Input
            id="listingExpiryDays"
            type="number"
            min="1"
            error={!!errors.listingExpiryDays}
            {...register("listingExpiryDays")}
          />
        </FormField>
      </div>

      <FormField
        label="Featured Listing Price (₹)"
        required
        error={errors.featuredListingPrice?.message}
        htmlFor="featuredListingPrice"
        hint="One-time fee charged to feature a listing."
      >
        <Input
          id="featuredListingPrice"
          type="number"
          min="0"
          error={!!errors.featuredListingPrice}
          {...register("featuredListingPrice")}
        />
      </FormField>

      <label className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-foreground">Auto-Approve Listings</span>
          <span className="block text-xs text-foreground-muted">Skip manual review and publish new listings instantly.</span>
        </span>
        <Controller
          control={control}
          name="autoApproveListings"
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
      </label>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
