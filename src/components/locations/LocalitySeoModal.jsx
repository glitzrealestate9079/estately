"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { localitySchema, LOCALITY_DEFAULT_VALUES } from "@/schemas/localitySchema";

export function LocalitySeoModal({ open, onOpenChange, locality, onSave }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(localitySchema),
    defaultValues: LOCALITY_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(
        locality
          ? {
              seoTitle: locality.seoTitle ?? "",
              seoDescription: locality.seoDescription ?? "",
              avgPricePerSqft: locality.avgPricePerSqft ?? "",
              rentRangeMin: locality.rentRangeMin ?? "",
              rentRangeMax: locality.rentRangeMax ?? "",
              dataPeriod: locality.dataPeriod ?? "",
            }
          : LOCALITY_DEFAULT_VALUES
      );
    }
  }, [open, locality, reset]);

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSave({ ...data, id: locality?.id });
    toast.success(`SEO details updated for "${locality?.name}"`);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Edit Locality SEO</ModalTitle>
          <ModalDescription>
            Update SEO and market-intelligence details for {locality?.name ?? "this locality"}.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-5">
          <FormField label="SEO Title" required error={errors.seoTitle?.message} htmlFor="seoTitle">
            <Input
              id="seoTitle"
              placeholder="e.g. Malviya Nagar Properties in Jaipur | Buy, Sell & Rent"
              error={!!errors.seoTitle}
              {...register("seoTitle")}
            />
          </FormField>

          <FormField label="SEO Description" required error={errors.seoDescription?.message} htmlFor="seoDescription">
            <Textarea
              id="seoDescription"
              rows={4}
              placeholder="Write a clear, search-friendly description…"
              error={!!errors.seoDescription}
              {...register("seoDescription")}
            />
          </FormField>

          <FormField label="Avg. Price / Sqft" required error={errors.avgPricePerSqft?.message} htmlFor="avgPricePerSqft">
            <Input
              id="avgPricePerSqft"
              type="number"
              placeholder="e.g. 6500"
              error={!!errors.avgPricePerSqft}
              {...register("avgPricePerSqft")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Rent Range Min" required error={errors.rentRangeMin?.message} htmlFor="rentRangeMin">
              <Input
                id="rentRangeMin"
                type="number"
                placeholder="e.g. 18000"
                error={!!errors.rentRangeMin}
                {...register("rentRangeMin")}
              />
            </FormField>

            <FormField label="Rent Range Max" required error={errors.rentRangeMax?.message} htmlFor="rentRangeMax">
              <Input
                id="rentRangeMax"
                type="number"
                placeholder="e.g. 42000"
                error={!!errors.rentRangeMax}
                {...register("rentRangeMax")}
              />
            </FormField>
          </div>

          <FormField label="Data Period" required error={errors.dataPeriod?.message} htmlFor="dataPeriod">
            <Input id="dataPeriod" placeholder="e.g. Q3 2026" error={!!errors.dataPeriod} {...register("dataPeriod")} />
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
