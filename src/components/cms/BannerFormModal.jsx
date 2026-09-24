"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { PropertyImage } from "@/components/common/property-image";
import { bannerSchema, BANNER_DEFAULT_VALUES } from "@/schemas/bannerSchema";

const BANNER_STATUSES = ["Active", "Inactive"];

export function BannerFormModal({ open, onOpenChange, mode = "add", defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bannerSchema),
    defaultValues: defaultValues ?? BANNER_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? BANNER_DEFAULT_VALUES);
    }
  }, [open, defaultValues, reset]);

  const imagePreview = useWatch({ control, name: "image" });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>{mode === "edit" ? "Edit Banner" : "Add New Banner"}</ModalTitle>
          <ModalDescription>
            {mode === "edit"
              ? "Update this homepage hero banner's content and call-to-action."
              : "Add a new hero banner to the homepage carousel."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-5">
          <FormField label="Title" required error={errors.title?.message} htmlFor="title">
            <Input id="title" placeholder="e.g. Find Your Dream Home" error={!!errors.title} {...register("title")} />
          </FormField>

          <FormField label="Subtitle" required error={errors.subtitle?.message} htmlFor="subtitle">
            <Input
              id="subtitle"
              placeholder="A short, compelling supporting line"
              error={!!errors.subtitle}
              {...register("subtitle")}
            />
          </FormField>

          <FormField label="Image URL" required error={errors.image?.message} htmlFor="image" hint="Paste an Unsplash image URL for the hero background.">
            <Input id="image" placeholder="https://images.unsplash.com/…" error={!!errors.image} {...register("image")} />
          </FormField>

          {imagePreview && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border-subtle">
              <PropertyImage src={imagePreview} alt="Banner preview" />
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="CTA Label" required error={errors.ctaLabel?.message} htmlFor="ctaLabel">
              <Input id="ctaLabel" placeholder="e.g. Browse Properties" error={!!errors.ctaLabel} {...register("ctaLabel")} />
            </FormField>
            <FormField label="CTA URL" required error={errors.ctaUrl?.message} htmlFor="ctaUrl">
              <Input id="ctaUrl" placeholder="e.g. /properties" error={!!errors.ctaUrl} {...register("ctaUrl")} />
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
                    {BANNER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <input type="hidden" {...register("sortOrder", { valueAsNumber: true })} />
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            {mode === "edit" ? "Save Changes" : "Add Banner"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
