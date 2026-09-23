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
import { PAYMENT_SETTINGS_DEFAULTS, paymentSettingsSchema } from "@/schemas/settingsSchema";

const PAYMENT_GATEWAYS = ["Razorpay", "PayU", "CCAvenue", "Stripe", "PayPal"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

export function PaymentSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(paymentSettingsSchema),
    defaultValues: PAYMENT_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Payment settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Payment Gateway" required error={errors.paymentGateway?.message}>
          <Controller
            control={control}
            name="paymentGateway"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.paymentGateway}>
                  <SelectValue placeholder="Select gateway" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_GATEWAYS.map((gateway) => (
                    <SelectItem key={gateway} value={gateway}>
                      {gateway}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField label="Currency" required error={errors.currency?.message}>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger error={!!errors.currency}>
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
      </div>

      <FormField label="Merchant ID" required error={errors.merchantId?.message} htmlFor="merchantId">
        <Input id="merchantId" placeholder="MID-EST-88214" error={!!errors.merchantId} {...register("merchantId")} />
      </FormField>

      <label className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3">
        <span>
          <span className="block text-sm font-medium text-foreground">Test Mode</span>
          <span className="block text-xs text-foreground-muted">Process payments in sandbox mode without real transactions.</span>
        </span>
        <Controller
          control={control}
          name="testMode"
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
