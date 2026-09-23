"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SMS_SETTINGS_DEFAULTS, smsSettingsSchema } from "@/schemas/settingsSchema";

const SMS_PROVIDERS = ["Twilio", "MSG91", "Gupshup", "TextLocal", "Exotel"];

export function SmsSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(smsSettingsSchema),
    defaultValues: SMS_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("SMS settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <FormField label="SMS Provider" required error={errors.smsProvider?.message}>
        <Controller
          control={control}
          name="smsProvider"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger error={!!errors.smsProvider}>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {SMS_PROVIDERS.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Sender ID"
          required
          error={errors.senderId?.message}
          htmlFor="senderId"
          hint="Up to 6 characters, shown as the SMS sender name."
        >
          <Input id="senderId" placeholder="ESTATE" maxLength={6} error={!!errors.senderId} {...register("senderId")} />
        </FormField>
        <FormField label="API Key" required error={errors.apiKey?.message} htmlFor="apiKey">
          <Input id="apiKey" placeholder="sk_live_…" error={!!errors.apiKey} {...register("apiKey")} />
        </FormField>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
