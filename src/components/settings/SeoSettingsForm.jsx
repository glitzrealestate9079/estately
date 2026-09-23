"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { SEO_SETTINGS_DEFAULTS, seoSettingsSchema } from "@/schemas/settingsSchema";

export function SeoSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(seoSettingsSchema),
    defaultValues: SEO_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("SEO settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <FormField
        label="Meta Title"
        required
        error={errors.metaTitle?.message}
        htmlFor="metaTitle"
        hint="Keep it under 70 characters."
      >
        <Input
          id="metaTitle"
          placeholder="Estately — Find Your Perfect Property in India"
          error={!!errors.metaTitle}
          {...register("metaTitle")}
        />
      </FormField>

      <FormField
        label="Meta Description"
        required
        error={errors.metaDescription?.message}
        htmlFor="metaDescription"
        hint="Keep it under 160 characters."
      >
        <Textarea
          id="metaDescription"
          rows={3}
          placeholder="Browse verified apartments, villas, plots and commercial spaces…"
          error={!!errors.metaDescription}
          {...register("metaDescription")}
        />
      </FormField>

      <FormField
        label="Keywords"
        required
        error={errors.keywords?.message}
        htmlFor="keywords"
        hint="Comma-separated keywords for search engines."
      >
        <Input
          id="keywords"
          placeholder="real estate, property, apartments, villas, India"
          error={!!errors.keywords}
          {...register("keywords")}
        />
      </FormField>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
