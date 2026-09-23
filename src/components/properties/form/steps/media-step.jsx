"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ImageDropzone } from "@/components/properties/form/image-dropzone";

export function MediaStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField label="Property Images" required error={errors.images?.message}>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageDropzone
              value={field.value}
              onChange={field.onChange}
              label="Upload property images"
              error={!!errors.images}
            />
          )}
        />
      </FormField>

      <FormField label="Floor Plan" error={errors.floorPlan?.message} hint="Optional single image">
        <Controller
          control={control}
          name="floorPlan"
          render={({ field }) => (
            <ImageDropzone
              value={field.value ? [{ id: "floor-plan", url: field.value, name: "Floor plan" }] : []}
              onChange={(files) => field.onChange(files[0]?.url ?? "")}
              multiple={false}
              label="Upload floor plan"
            />
          )}
        />
      </FormField>

      <FormField label="Video Tour URL" error={errors.video?.message} htmlFor="video" hint="Optional — YouTube, Vimeo, etc.">
        <Input id="video" placeholder="https://youtube.com/watch?v=…" error={!!errors.video} {...register("video")} />
      </FormField>
    </div>
  );
}
