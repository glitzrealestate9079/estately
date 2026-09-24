"use client";

import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CalendarClock, Lock, ShieldCheck } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { addDays, formatDate } from "@/lib/utils";
import { VERIFICATION_VALIDITY_DAYS } from "@/schemas/propertySchema";

const RERA_STATUSES = ["Registered", "Pending", "Not Applicable"];
const VERIFICATION_STATUSES = ["Pending", "Verified", "Rejected"];

export function VerificationStep() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [phoneVerified, identityVerified, propertyVerified, verifiedUntil] = useWatch({
    control,
    name: ["phoneVerified", "identityVerified", "propertyVerified", "verifiedUntil"],
  });
  const isFullyVerified = phoneVerified === true && identityVerified === "Verified" && propertyVerified === "Verified";

  // Stamp (or clear) verifiedUntil as the three checks change, instead of
  // storing a separate verification date — see VERIFICATION_VALIDITY_DAYS.
  useEffect(() => {
    if (isFullyVerified && !verifiedUntil) {
      setValue("verifiedUntil", addDays(new Date(), VERIFICATION_VALIDITY_DAYS).toISOString(), { shouldDirty: true });
    } else if (!isFullyVerified && verifiedUntil) {
      setValue("verifiedUntil", null, { shouldDirty: true });
    }
  }, [isFullyVerified, verifiedUntil, setValue]);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-info-200 bg-info-50 p-4 text-sm text-info-700 dark:border-info-500/20 dark:bg-info-500/10 dark:text-info-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>RERA registration builds buyer trust and is required for most residential projects in India.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="RERA Number" error={errors.reraNumber?.message} htmlFor="reraNumber" hint="Optional">
          <Input id="reraNumber" placeholder="RJ/2026/01234" {...register("reraNumber")} />
        </FormField>
        <FormField label="RERA Authority" error={errors.reraAuthority?.message} htmlFor="reraAuthority" hint="Optional">
          <Input id="reraAuthority" placeholder="e.g. Rajasthan RERA" {...register("reraAuthority")} />
        </FormField>
      </div>

      <FormField label="RERA Status" error={errors.reraStatus?.message}>
        <Controller
          control={control}
          name="reraStatus"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger error={!!errors.reraStatus}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RERA_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div>
        <p className="mb-1 text-sm font-semibold text-foreground">Verification Checklist</p>
        <p className="mb-2 text-xs text-foreground-muted">
          Verified listings get up to 3x more buyer trust and rank higher in search — completing all three checks below
          confirms the phone, identity and property details behind this listing are genuine.
        </p>
        <Card className="divide-y divide-border-subtle">
          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Phone Verified</p>
              <p className="text-xs text-foreground-muted">
                Confirms the owner&apos;s contact number has been reached and verified by our team.
              </p>
            </div>
            <Controller
              control={control}
              name="phoneVerified"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Identity Verification</p>
              <p className="text-xs text-foreground-muted">Whether the seller&apos;s identity documents have been reviewed.</p>
            </div>
            <Controller
              control={control}
              name="identityVerified"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-40 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Property Verification</p>
              <p className="text-xs text-foreground-muted">Whether a site visit or document check has validated this property.</p>
            </div>
            <Controller
              control={control}
              name="propertyVerified"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-40 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </Card>
      </div>

      {isFullyVerified && verifiedUntil && (
        <div className="flex items-start gap-3 rounded-lg border border-success-100 bg-success-50 p-4 text-sm text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-500">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Valid until <span className="font-semibold">{formatDate(verifiedUntil)}</span> — re-verification required
            after this date.
          </p>
        </div>
      )}

      <p className="flex items-start gap-2 text-xs text-foreground-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Only &quot;Verified&quot; and RERA badges are ever shown publicly — phone numbers and identity documents stay private to the admin team.
      </p>

      {/* Kept registered so the shared verificationStatus field stays valid, even though its own select is no longer shown. */}
      <input type="hidden" {...register("verificationStatus")} />
      {/* Auto-managed above whenever all three checks are Verified — see VERIFICATION_VALIDITY_DAYS. */}
      <input type="hidden" {...register("verifiedUntil")} />
    </div>
  );
}
