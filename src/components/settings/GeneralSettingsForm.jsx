"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GENERAL_SETTINGS_DEFAULTS, generalSettingsSchema } from "@/schemas/settingsSchema";

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Kathmandu",
  "Asia/Dhaka",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
  "UTC",
];

export function GeneralSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(generalSettingsSchema),
    defaultValues: GENERAL_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("General settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <FormField label="Platform Name" required error={errors.platformName?.message} htmlFor="platformName">
        <Input id="platformName" placeholder="e.g. Estately" error={!!errors.platformName} {...register("platformName")} />
      </FormField>

      <FormField label="Support Email" required error={errors.supportEmail?.message} htmlFor="supportEmail">
        <Input
          id="supportEmail"
          type="email"
          placeholder="support@estately.example"
          error={!!errors.supportEmail}
          {...register("supportEmail")}
        />
      </FormField>

      <FormField label="Timezone" required error={errors.timezone?.message}>
        <Controller
          control={control}
          name="timezone"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger error={!!errors.timezone}>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
