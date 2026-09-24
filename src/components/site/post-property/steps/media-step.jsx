"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { ImageDropzone } from "@/components/properties/form/image-dropzone";

export function MediaStep() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-2">
      <FormField
        label="Property Photos"
        required
        error={errors.images?.message}
        hint="Add at least 3 photos — listings with 5+ good photos get significantly more enquiries."
      >
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageDropzone value={field.value} onChange={field.onChange} label="Upload property photos" error={!!errors.images} />
          )}
        />
      </FormField>
      <p className="text-xs text-foreground-muted">The first photo you upload becomes the cover photo shown on search results.</p>
    </div>
  );
}
