"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  couponSchema,
  COUPON_DEFAULT_VALUES,
  COUPON_DISCOUNT_TYPES,
  COUPON_APPLICABLE_PLANS,
  COUPON_STATUSES,
} from "@/schemas/couponSchema";

function toFormValues(coupon) {
  if (!coupon) return COUPON_DEFAULT_VALUES;
  return {
    code: coupon.code ?? "",
    discountType: coupon.discountType ?? COUPON_DEFAULT_VALUES.discountType,
    discountValue: coupon.discountValue ?? "",
    minAmount: coupon.minAmount ?? "",
    maxDiscount: coupon.maxDiscount ?? "",
    validFrom: coupon.validFrom ?? "",
    validUntil: coupon.validUntil ?? "",
    usageLimit: coupon.usageLimit ?? "",
    perUserLimit: coupon.perUserLimit ?? 1,
    applicablePlan: coupon.applicablePlan ?? COUPON_DEFAULT_VALUES.applicablePlan,
    status: coupon.status ?? COUPON_DEFAULT_VALUES.status,
  };
}

// `coupon` is optional: pass an existing coupon to prefill for edit mode, or
// omit it to create a new one.
export function CouponFormModal({ open, onOpenChange, coupon, onSave }) {
  const mode = coupon ? "edit" : "add";

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(couponSchema),
    defaultValues: COUPON_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(toFormValues(coupon));
  }, [open, coupon, reset]);

  async function submit(data) {
    await onSave?.(data);
    toast.success(mode === "edit" ? `"${data.code}" coupon updated` : `"${data.code}" coupon created`);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <form onSubmit={handleSubmit(submit)}>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
                <BadgePercent className="h-5 w-5" />
              </div>
              <div>
                <ModalTitle>{mode === "edit" ? "Edit Coupon" : "New Coupon"}</ModalTitle>
                <ModalDescription>
                  {mode === "edit"
                    ? "Update this coupon's discount, validity and usage rules."
                    : "Create a new discount coupon for subscription plans."}
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Coupon Code" required error={errors.code?.message} htmlFor="coupon-code">
                <Input id="coupon-code" placeholder="e.g. WELCOME10" error={!!errors.code} {...register("code")} />
              </FormField>
              <FormField label="Discount Type" required error={errors.discountType?.message}>
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger error={!!errors.discountType}>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUPON_DISCOUNT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Discount Value"
                required
                error={errors.discountValue?.message}
                htmlFor="coupon-discount-value"
                hint="Percentage (0–100) or a flat rupee amount, based on discount type."
              >
                <Input
                  id="coupon-discount-value"
                  type="number"
                  min="0"
                  placeholder="e.g. 10"
                  error={!!errors.discountValue}
                  {...register("discountValue")}
                />
              </FormField>
              <FormField label="Applicable Plan" required error={errors.applicablePlan?.message}>
                <Controller
                  control={control}
                  name="applicablePlan"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger error={!!errors.applicablePlan}>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUPON_APPLICABLE_PLANS.map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Minimum Order Amount (₹)"
                error={errors.minAmount?.message}
                htmlFor="coupon-min-amount"
                hint="Leave blank for no minimum."
              >
                <Input
                  id="coupon-min-amount"
                  type="number"
                  min="0"
                  placeholder="e.g. 2999"
                  error={!!errors.minAmount}
                  {...register("minAmount")}
                />
              </FormField>
              <FormField
                label="Max Discount Cap (₹)"
                error={errors.maxDiscount?.message}
                htmlFor="coupon-max-discount"
                hint="Leave blank for no cap."
              >
                <Input
                  id="coupon-max-discount"
                  type="number"
                  min="0"
                  placeholder="e.g. 2000"
                  error={!!errors.maxDiscount}
                  {...register("maxDiscount")}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Valid From" required error={errors.validFrom?.message} htmlFor="coupon-valid-from">
                <Input id="coupon-valid-from" type="date" error={!!errors.validFrom} {...register("validFrom")} />
              </FormField>
              <FormField label="Valid Until" required error={errors.validUntil?.message} htmlFor="coupon-valid-until">
                <Input id="coupon-valid-until" type="date" error={!!errors.validUntil} {...register("validUntil")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Usage Limit"
                error={errors.usageLimit?.message}
                htmlFor="coupon-usage-limit"
                hint="Leave blank for unlimited redemptions."
              >
                <Input
                  id="coupon-usage-limit"
                  type="number"
                  min="1"
                  placeholder="e.g. 500"
                  error={!!errors.usageLimit}
                  {...register("usageLimit")}
                />
              </FormField>
              <FormField label="Per User Limit" error={errors.perUserLimit?.message} htmlFor="coupon-per-user-limit">
                <Input
                  id="coupon-per-user-limit"
                  type="number"
                  min="1"
                  placeholder="1"
                  error={!!errors.perUserLimit}
                  {...register("perUserLimit")}
                />
              </FormField>
            </div>

            <FormField label="Status" required error={errors.status?.message}>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.status}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUPON_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {mode === "edit" ? "Save Changes" : "Create Coupon"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
