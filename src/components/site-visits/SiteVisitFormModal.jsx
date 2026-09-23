"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteVisitSchema, SITE_VISIT_DEFAULT_VALUES, SITE_VISIT_STATUSES } from "@/schemas/siteVisitSchema";
import { SITE_VISIT_AGENTS, SITE_VISIT_CITIES } from "@/data/site-visits";

export function SiteVisitFormModal({ open, onOpenChange, mode = "add", defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(siteVisitSchema),
    defaultValues: SITE_VISIT_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues || SITE_VISIT_DEFAULT_VALUES);
    }
  }, [open, defaultValues, reset]);

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSubmit?.(data);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>{mode === "edit" ? "Edit Site Visit" : "Schedule Site Visit"}</ModalTitle>
          <ModalDescription>
            {mode === "edit"
              ? "Update the buyer, property or scheduling details for this visit."
              : "Fill in the details to schedule a new property site visit."}
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit(onValid)}>
          <ModalBody className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Buyer Name" required error={errors.buyerName?.message} htmlFor="buyerName">
                <Input id="buyerName" placeholder="e.g. Aditya Sharma" error={!!errors.buyerName} {...register("buyerName")} />
              </FormField>
              <FormField label="Buyer Phone" error={errors.buyerPhone?.message} htmlFor="buyerPhone">
                <Input id="buyerPhone" placeholder="+91 98765 43210" error={!!errors.buyerPhone} {...register("buyerPhone")} />
              </FormField>
            </div>

            <FormField label="Property Title" required error={errors.propertyTitle?.message} htmlFor="propertyTitle">
              <Input
                id="propertyTitle"
                placeholder="e.g. 3 BHK Apartment, Malviya Nagar"
                error={!!errors.propertyTitle}
                {...register("propertyTitle")}
              />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Assigned Agent" required error={errors.agentName?.message}>
                <Controller
                  control={control}
                  name="agentName"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger error={!!errors.agentName}>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITE_VISIT_AGENTS.map((agent) => (
                          <SelectItem key={agent} value={agent}>
                            {agent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="City" required error={errors.city?.message}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger error={!!errors.city}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {SITE_VISIT_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <FormField label="Visit Date" required error={errors.date?.message} htmlFor="date">
                <Input id="date" type="date" error={!!errors.date} {...register("date")} />
              </FormField>
              <FormField label="Visit Time" required error={errors.time?.message} htmlFor="time" hint="e.g. 11:30 AM">
                <Input id="time" placeholder="11:30 AM" error={!!errors.time} {...register("time")} />
              </FormField>
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
                        {SITE_VISIT_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <FormField label="Notes" error={errors.notes?.message} htmlFor="notes" hint="Optional internal notes about this visit.">
              <Textarea id="notes" rows={3} placeholder="Any special requirements or context…" error={!!errors.notes} {...register("notes")} />
            </FormField>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {mode === "edit" ? "Save Changes" : "Schedule Visit"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
