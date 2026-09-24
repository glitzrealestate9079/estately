"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, ImagePlus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { PropertyImage } from "@/components/common/property-image";
import { AMENITIES } from "@/lib/constants";
import { PROJECT_DEFAULT_VALUES, PROJECT_STATUSES, PROJECT_TYPES, projectSchema } from "@/schemas/projectSchema";
import { PROJECT_CITIES } from "@/data/projects";
import { imageForProject } from "@/data/property-images";
import { cn } from "@/lib/utils";

function ProjectImagesField({ value = [], onChange, error }) {
  const [url, setUrl] = useState("");
  const sampleIndexRef = useRef(value.length);

  function addUrl() {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setUrl("");
  }

  function addSample() {
    const next = imageForProject(sampleIndexRef.current);
    sampleIndexRef.current += 1;
    onChange([...value, next]);
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="https://images.unsplash.com/…"
            value={url}
            error={error}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={addUrl}>
            <Plus className="h-4 w-4" />
            Add URL
          </Button>
          <Button type="button" variant="outline" onClick={addSample}>
            <ImagePlus className="h-4 w-4" />
            Add Sample
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((src, index) => (
            <div key={`${src}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border-subtle">
              <PropertyImage src={src} alt={`Project image ${index + 1}`} />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 rounded-full bg-navy-950/70 p-1 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectFormModal({ open, onOpenChange, mode = "add", defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: defaultValues ?? PROJECT_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? PROJECT_DEFAULT_VALUES);
    }
  }, [open, defaultValues, reset]);

  const totalUnits = Number(useWatch({ control, name: "totalUnits" })) || 0;

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl">
        <ModalHeader>
          <ModalTitle>{mode === "edit" ? "Edit Project" : "Add New Project"}</ModalTitle>
          <ModalDescription>
            {mode === "edit"
              ? "Update this project's details, units and availability."
              : "Add a new residential, commercial or mixed-use project to your portfolio."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-6">
          <FormField label="Project Name" required error={errors.projectName?.message} htmlFor="projectName">
            <Input
              id="projectName"
              placeholder="e.g. Horizon Skyline Residences"
              error={!!errors.projectName}
              {...register("projectName")}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Developer" required error={errors.developer?.message} htmlFor="developer">
              <Input id="developer" placeholder="e.g. Horizon Developers" error={!!errors.developer} {...register("developer")} />
            </FormField>
            <FormField label="Project Type" required error={errors.projectType?.message}>
              <Controller
                control={control}
                name="projectType"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.projectType}>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((type) => (
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
                      {PROJECT_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Locality" required error={errors.locality?.message} htmlFor="locality">
              <Input id="locality" placeholder="e.g. Sector 84" error={!!errors.locality} {...register("locality")} />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
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
                      {PROJECT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Total Units" required error={errors.totalUnits?.message} htmlFor="totalUnits">
              <Input id="totalUnits" type="number" min="0" placeholder="420" error={!!errors.totalUnits} {...register("totalUnits")} />
            </FormField>
            <FormField
              label="Available Units"
              required
              error={errors.availableUnits?.message}
              htmlFor="availableUnits"
              hint={totalUnits > 0 ? `Out of ${totalUnits} total units` : undefined}
            >
              <Input
                id="availableUnits"
                type="number"
                min="0"
                placeholder="310"
                error={!!errors.availableUnits}
                {...register("availableUnits")}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField label="Starting Price (₹)" required error={errors.startingPrice?.message} htmlFor="startingPrice">
              <Input
                id="startingPrice"
                type="number"
                min="0"
                placeholder="8500000"
                error={!!errors.startingPrice}
                {...register("startingPrice")}
              />
            </FormField>
            <FormField label="Possession Date" required error={errors.possessionDate?.message} htmlFor="possessionDate">
              <Input id="possessionDate" type="date" error={!!errors.possessionDate} {...register("possessionDate")} />
            </FormField>
            <FormField label="RERA Number" error={errors.reraNumber?.message} htmlFor="reraNumber" hint="Optional">
              <Input id="reraNumber" placeholder="e.g. GGM/RERA/2026/1042" {...register("reraNumber")} />
            </FormField>
          </div>

          <FormField label="Amenities">
            <Controller
              control={control}
              name="amenities"
              render={({ field }) => {
                function toggle(amenity) {
                  const set = new Set(field.value ?? []);
                  if (set.has(amenity)) set.delete(amenity);
                  else set.add(amenity);
                  field.onChange(Array.from(set));
                }

                return (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {AMENITIES.map((amenity) => {
                      const selected = field.value?.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggle(amenity)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                            selected
                              ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                              : "border-border-subtle text-foreground hover:border-navy-300"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border",
                              selected ? "border-primary-600 bg-primary-600 text-white" : "border-border-subtle"
                            )}
                          >
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
          </FormField>

          <FormField
            label="Description"
            required
            error={errors.description?.message}
            htmlFor="description"
            hint="Describe the project's positioning, specifications and neighbourhood."
          >
            <Textarea
              id="description"
              rows={4}
              placeholder="Write a compelling project overview…"
              error={!!errors.description}
              {...register("description")}
            />
          </FormField>

          <FormField label="Project Images" required error={errors.images?.message}>
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ProjectImagesField value={field.value} onChange={field.onChange} error={!!errors.images} />
              )}
            />
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            {mode === "edit" ? "Save Changes" : "Add Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
