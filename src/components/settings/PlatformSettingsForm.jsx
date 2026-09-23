"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PLATFORM_SETTINGS_DEFAULTS, platformSettingsSchema } from "@/schemas/settingsSchema";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];
const LANGUAGES = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada"];

export function PlatformSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(platformSettingsSchema),
    defaultValues: PLATFORM_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Platform settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <FormField label="Site URL" required error={errors.siteUrl?.message} htmlFor="siteUrl">
        <Input
          id="siteUrl"
          placeholder="https://www.estately.example"
          error={!!errors.siteUrl}
          {...register("siteUrl")}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Default Currency" required error={errors.defaultCurrency?.message}>
          <Controller
            control={control}
            name="defaultCurrency"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.defaultCurrency}>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Default Language" required error={errors.defaultLanguage?.message}>
          <Controller
            control={control}
            name="defaultLanguage"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.defaultLanguage}>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <label className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-foreground">Maintenance Mode</span>
          <span className="block text-xs text-foreground-muted">Temporarily take the public site offline for visitors.</span>
        </span>
        <Controller
          control={control}
          name="maintenanceMode"
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
