"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { PROPERTY_TYPES, LEAD_SOURCES } from "@/lib/constants";
import { LEAD_DEFAULT_VALUES, LEAD_STATUSES, leadSchema } from "@/schemas/leadSchema";
import { LEAD_AGENTS } from "@/data/leads";

export function LeadFormModal({ open, onOpenChange, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(leadSchema),
    defaultValues: LEAD_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(LEAD_DEFAULT_VALUES);
    }
  }, [open, reset]);

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSubmit({ ...data, budget: Number(data.budget) });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Add New Lead</ModalTitle>
          <ModalDescription>Capture a new enquiry and get it into your sales pipeline.</ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Lead Name" required error={errors.name?.message} htmlFor="name">
              <Input id="name" placeholder="e.g. Ananya Kapoor" error={!!errors.name} {...register("name")} />
            </FormField>
            <FormField label="Phone Number" required error={errors.phone?.message} htmlFor="phone">
              <Input id="phone" placeholder="+91 98765 43210" error={!!errors.phone} {...register("phone")} />
            </FormField>
          </div>

          <FormField label="Email" required error={errors.email?.message} htmlFor="email">
            <Input id="email" type="email" placeholder="e.g. ananya.kapoor@gmail.com" error={!!errors.email} {...register("email")} />
          </FormField>

          <FormField label="Interested Property" required error={errors.interestedProperty?.message} htmlFor="interestedProperty">
            <Input
              id="interestedProperty"
              placeholder="e.g. 3 BHK Apartment in Malviya Nagar"
              error={!!errors.interestedProperty}
              {...register("interestedProperty")}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Budget (₹)" required error={errors.budget?.message} htmlFor="budget">
              <Input id="budget" type="number" min="0" placeholder="12000000" error={!!errors.budget} {...register("budget")} />
            </FormField>
            <FormField label="Preferred Location" required error={errors.location?.message} htmlFor="location">
              <Input id="location" placeholder="e.g. Malviya Nagar, Jaipur" error={!!errors.location} {...register("location")} />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Property Type" required error={errors.propertyType?.message}>
              <Controller
                control={control}
                name="propertyType"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.propertyType}>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Lead Source" required error={errors.source?.message}>
              <Controller
                control={control}
                name="source"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.source}>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_SOURCES.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Assigned Agent" required error={errors.assignedAgent?.message}>
              <Controller
                control={control}
                name="assignedAgent"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.assignedAgent}>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_AGENTS.map((agent) => (
                        <SelectItem key={agent.id} value={agent.name}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
                      {LEAD_STATUSES.map((status) => (
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

          <FormField label="Notes" error={errors.notes?.message} htmlFor="notes" hint="Optional context for whoever picks this lead up next.">
            <Textarea id="notes" rows={3} placeholder="Add any relevant notes about this lead…" error={!!errors.notes} {...register("notes")} />
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            Add Lead
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
