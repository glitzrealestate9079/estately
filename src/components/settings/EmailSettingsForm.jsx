"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { EMAIL_SETTINGS_DEFAULTS, emailSettingsSchema } from "@/schemas/settingsSchema";

export function EmailSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(emailSettingsSchema),
    defaultValues: EMAIL_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Email settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="SMTP Host" required error={errors.smtpHost?.message} htmlFor="smtpHost">
          <Input id="smtpHost" placeholder="smtp.estately.example" error={!!errors.smtpHost} {...register("smtpHost")} />
        </FormField>
        <FormField label="SMTP Port" required error={errors.smtpPort?.message} htmlFor="smtpPort">
          <Input id="smtpPort" type="number" min="1" error={!!errors.smtpPort} {...register("smtpPort")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Sender Name" required error={errors.senderName?.message} htmlFor="senderName">
          <Input id="senderName" placeholder="Estately" error={!!errors.senderName} {...register("senderName")} />
        </FormField>
        <FormField label="Sender Email" required error={errors.senderEmail?.message} htmlFor="senderEmail">
          <Input
            id="senderEmail"
            type="email"
            placeholder="no-reply@estately.example"
            error={!!errors.senderEmail}
            {...register("senderEmail")}
          />
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
