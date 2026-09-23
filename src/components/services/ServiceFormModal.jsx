"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { SERVICE_DEFAULT_VALUES, SERVICE_STATUSES, serviceSchema } from "@/schemas/serviceSchema";

export function ServiceFormModal({ open, onOpenChange, mode = "add", defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: defaultValues ?? SERVICE_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? SERVICE_DEFAULT_VALUES);
    }
  }, [open, defaultValues, reset]);

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>{mode === "edit" ? "Edit Service" : "Add New Service"}</ModalTitle>
          <ModalDescription>
            {mode === "edit"
              ? "Update this add-on service's pricing and details."
              : "Add a new premium add-on service to the catalog."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-5">
          <FormField label="Service Name" required error={errors.name?.message} htmlFor="name">
            <Input
              id="name"
              placeholder="e.g. Professional Photography"
              error={!!errors.name}
              {...register("name")}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Price (₹)" required error={errors.price?.message} htmlFor="price">
              <Input id="price" type="number" min="0" placeholder="2999" error={!!errors.price} {...register("price")} />
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
                      {SERVICE_STATUSES.map((status) => (
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

          <FormField
            label="Description"
            required
            error={errors.description?.message}
            htmlFor="description"
            hint="Describe what's included and why it helps agents or developers."
          >
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe this service…"
              error={!!errors.description}
              {...register("description")}
            />
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            {mode === "edit" ? "Save Changes" : "Add Service"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
