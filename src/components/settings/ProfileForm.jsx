"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { profileSchema } from "@/schemas/settingsSchema";
import { CURRENT_USER } from "@/data/current-user";
import { initials } from "@/lib/utils";

const PROFILE_DEFAULTS = {
  name: CURRENT_USER.name,
  email: CURRENT_USER.email,
  avatarUrl: CURRENT_USER.avatar,
};

export function ProfileForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: PROFILE_DEFAULTS,
    mode: "onBlur",
  });

  const avatarUrl = watch("avatarUrl");
  const name = watch("name");

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    reset(data);
    toast.success("Profile updated successfully");
  }

  return (
    <Card className="animate-slide-up">
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-base">{initials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-foreground-muted">{CURRENT_USER.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="space-y-5">
          <FormField label="Full Name" required error={errors.name?.message} htmlFor="name">
            <Input id="name" placeholder="e.g. Sanjay Mehta" error={!!errors.name} {...register("name")} />
          </FormField>

          <FormField label="Email" required error={errors.email?.message} htmlFor="email">
            <Input
              id="email"
              type="email"
              placeholder="you@estately.example"
              error={!!errors.email}
              {...register("email")}
            />
          </FormField>

          <FormField
            label="Avatar URL"
            required
            error={errors.avatarUrl?.message}
            htmlFor="avatarUrl"
            hint="Paste a link to your profile photo."
          >
            <Input
              id="avatarUrl"
              placeholder="https://i.pravatar.cc/160?img=68"
              error={!!errors.avatarUrl}
              {...register("avatarUrl")}
            />
          </FormField>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={submitting} disabled={!isDirty || submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
