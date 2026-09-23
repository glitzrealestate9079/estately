"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { rescheduleSchema } from "@/schemas/siteVisitSchema";

export function RescheduleVisitModal({ open, onOpenChange, visit, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rescheduleSchema),
    defaultValues: { date: "", time: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (open && visit) {
      reset({ date: visit.date, time: visit.time });
    }
  }, [open, visit, reset]);

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    onSubmit?.(data);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Reschedule Visit</ModalTitle>
          {visit && (
            <ModalDescription>
              Pick a new date and time for {visit.buyerName}&rsquo;s visit to &ldquo;{visit.propertyTitle}&rdquo;.
            </ModalDescription>
          )}
        </ModalHeader>
        <form onSubmit={handleSubmit(onValid)}>
          <ModalBody className="space-y-5">
            <FormField label="New Date" required error={errors.date?.message} htmlFor="reschedule-date">
              <Input id="reschedule-date" type="date" error={!!errors.date} {...register("date")} />
            </FormField>
            <FormField label="New Time" required error={errors.time?.message} htmlFor="reschedule-time" hint="e.g. 11:30 AM">
              <Input id="reschedule-time" placeholder="11:30 AM" error={!!errors.time} {...register("time")} />
            </FormField>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Confirm New Slot
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
