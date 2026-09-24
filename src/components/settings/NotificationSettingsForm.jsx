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
];

const TRANSACTIONAL_TOGGLES = [
  {
    name: "propertyAlerts",
    label: "Property Alerts",
    description: "Status changes on your listings.",
  },
  {
    name: "visitUpdates",
    label: "Visit Updates",
    description: "Site visit confirmations and reschedules.",
  },
  {
    name: "messageAlerts",
    label: "Messages",
    description: "New buyer or agent messages.",
  },
  {
    name: "listingUpdates",
    label: "Listing Updates",
    description: "Approval, rejection, and expiry notices.",
  },
  {
    name: "paymentAlerts",
    label: "Payment Alerts",
    description: "Payments received, due, or failed on your account.",
  },
];

const MARKETING_TOGGLES = [
  {
    name: "priceChangeAlerts",
    label: "Price Change Alerts",
    description: "Price changes on listings from your saved searches.",
  },
  {
    name: "savedSearchAlerts",
    label: "Saved Search Alerts",
    description: "New listings that match your saved searches.",
  },
  {
    name: "weeklyDigest",
    label: "Weekly Digest",
    description: "Get a weekly summary email of activity across your platform.",
  },
  {
    name: "promotionalOffers",
    label: "Promotions & Offers",
    description: "Occasional offers, discounts, and platform announcements.",
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

  function renderToggle(toggle) {
    return (
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
    );
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="space-y-3">{TOGGLES.map(renderToggle)}</div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Transactional</p>
        <div className="space-y-3">{TRANSACTIONAL_TOGGLES.map(renderToggle)}</div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Marketing</p>
        <div className="space-y-3">{MARKETING_TOGGLES.map(renderToggle)}</div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
