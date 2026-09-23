"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { developerSchema, DEVELOPER_DEFAULT_VALUES } from "@/schemas/developerSchema";
import { DEVELOPERS } from "@/data/developers";

const DEVELOPER_CITIES = [...new Set(DEVELOPERS.map((d) => d.city))].sort((a, b) => a.localeCompare(b));

export function DeveloperFormModal({ open, onOpenChange, mode = "add", defaultValues = DEVELOPER_DEFAULT_VALUES, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(developerSchema),
    defaultValues: DEVELOPER_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(defaultValues ?? DEVELOPER_DEFAULT_VALUES);
  }, [open, defaultValues, reset]);

  async function submit(data) {
    await onSubmit?.(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <form onSubmit={handleSubmit(submit)}>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
                <HardHat className="h-5 w-5" />
              </div>
              <div>
                <ModalTitle>{mode === "edit" ? "Edit Developer" : "Add New Developer"}</ModalTitle>
                <ModalDescription>
                  {mode === "edit"
                    ? "Update this developer's profile and contact details."
                    : "Onboard a new real estate developer to your platform."}
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="space-y-5">
            <FormField label="Developer / Company Name" required error={errors.name?.message} htmlFor="developer-name">
              <Input id="developer-name" placeholder="e.g. Horizon Developers" error={!!errors.name} {...register("name")} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Phone Number" required error={errors.phone?.message} htmlFor="developer-phone">
                <Input id="developer-phone" placeholder="+91 98765 43210" error={!!errors.phone} {...register("phone")} />
              </FormField>
              <FormField label="Email Address" required error={errors.email?.message} htmlFor="developer-email">
                <Input
                  id="developer-email"
                  type="email"
                  placeholder="contact@developer.com"
                  error={!!errors.email}
                  {...register("email")}
                />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Website" required error={errors.website?.message} htmlFor="developer-website">
                <Input
                  id="developer-website"
                  placeholder="https://www.developer.com"
                  error={!!errors.website}
                  {...register("website")}
                />
              </FormField>
              <FormField label="Established Year" required error={errors.establishedYear?.message} htmlFor="developer-year">
                <Input
                  id="developer-year"
                  type="number"
                  min="1800"
                  max="2026"
                  placeholder="e.g. 2001"
                  error={!!errors.establishedYear}
                  {...register("establishedYear")}
                />
              </FormField>
            </div>

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
                      {DEVELOPER_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Description"
              required
              error={errors.description?.message}
              htmlFor="developer-description"
              hint="Describe the developer's portfolio focus, track record and specialisation."
            >
              <Textarea
                id="developer-description"
                rows={4}
                placeholder="Write a short profile of this developer…"
                error={!!errors.description}
                {...register("description")}
              />
            </FormField>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {mode === "edit" ? "Save Changes" : "Add Developer"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
