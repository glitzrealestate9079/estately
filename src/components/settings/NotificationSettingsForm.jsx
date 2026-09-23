"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { NOTIFICATION_SETTINGS_DEFAULTS, notificationSettingsSchema } from "@/schemas/settingsSchema";

const TOGGLES = [
  {
    name: "emailAlerts",
    label: "Email Alerts",
    description: "Receive important account and listing alerts by email.",
  },
  {
    name: "smsAlerts",
    label: "SMS Alerts",
    description: "Receive urgent alerts via SMS on your registered phone number.",
  },
  {
    name: "pushAlerts",
    label: "Push Alerts",
    description: "Receive real-time push notifications in the browser.",
  },
  {
    name: "weeklyDigest",
    label: "Weekly Digest",
    description: "Get a weekly summary email of activity across your platform.",
  },
];

export function NotificationSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    resolver: yupResolver(notificationSettingsSchema),
    defaultValues: NOTIFICATION_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Notification settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      {TOGGLES.map((toggle) => (
        <label
          key={toggle.name}
          className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3"
        >
          <span>
            <span className="block text-sm font-medium text-foreground">{toggle.label}</span>
            <span className="block text-xs text-foreground-muted">{toggle.description}</span>
          </span>
          <Controller
            control={control}
            name={toggle.name}
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
        </label>
      ))}

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
