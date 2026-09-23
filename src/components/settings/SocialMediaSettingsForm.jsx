"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Link2, Camera, Briefcase, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { SOCIAL_MEDIA_SETTINGS_DEFAULTS, socialMediaSettingsSchema } from "@/schemas/settingsSchema";

export function SocialMediaSettingsForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(socialMediaSettingsSchema),
    defaultValues: SOCIAL_MEDIA_SETTINGS_DEFAULTS,
    mode: "onBlur",
  });

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Social media settings saved successfully");
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5">
      <FormField label="Facebook URL" error={errors.facebookUrl?.message} htmlFor="facebookUrl">
        <Input
          id="facebookUrl"
          icon={Link2}
          placeholder="https://facebook.com/estately"
          error={!!errors.facebookUrl}
          {...register("facebookUrl")}
        />
      </FormField>

      <FormField label="Twitter / X URL" error={errors.twitterUrl?.message} htmlFor="twitterUrl">
        <Input
          id="twitterUrl"
          icon={MessageCircle}
          placeholder="https://x.com/estately"
          error={!!errors.twitterUrl}
          {...register("twitterUrl")}
        />
      </FormField>

      <FormField label="Instagram URL" error={errors.instagramUrl?.message} htmlFor="instagramUrl">
        <Input
          id="instagramUrl"
          icon={Camera}
          placeholder="https://instagram.com/estately"
          error={!!errors.instagramUrl}
          {...register("instagramUrl")}
        />
      </FormField>

      <FormField label="LinkedIn URL" error={errors.linkedinUrl?.message} htmlFor="linkedinUrl">
        <Input
          id="linkedinUrl"
          icon={Briefcase}
          placeholder="https://linkedin.com/company/estately"
          error={!!errors.linkedinUrl}
          {...register("linkedinUrl")}
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
