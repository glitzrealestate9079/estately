"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { SECURITY_SETTINGS_DEFAULTS, securitySettingsSchema } from "@/schemas/settingsSchema";

export function SecuritySettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(securitySettingsSchema),
    defaultValues: SECURITY_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(SECURITY_SETTINGS_DEFAULTS);
    toast.success("Password changed successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <FormField label="Current Password" required error={errors.currentPassword?.message} htmlFor="currentPassword">
        <Input
          id="currentPassword"
          type="password"
          placeholder="Enter your current password"
          error={!!errors.currentPassword}
          {...register("currentPassword")}
        />
      </FormField>

      <FormField
        label="New Password"
        required
        error={errors.newPassword?.message}
        htmlFor="newPassword"
        hint="At least 8 characters, including one uppercase letter and one number."
      >
        <Input
          id="newPassword"
          type="password"
          placeholder="Enter a new password"
          error={!!errors.newPassword}
          {...register("newPassword")}
        />
      </FormField>

      <FormField label="Confirm New Password" required error={errors.confirmPassword?.message} htmlFor="confirmPassword">
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter the new password"
          error={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
      </FormField>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
