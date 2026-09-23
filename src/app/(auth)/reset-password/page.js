"use client";

import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { resetPasswordSchema } from "@/schemas/authSchema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Password reset successfully. Please sign in.");
    router.push("/login");
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Set a new password</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Choose a strong password you haven&apos;t used before.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="New password" required error={errors.password?.message} htmlFor="password">
          <Input
            id="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <FormField
          label="Confirm password"
          required
          error={errors.confirmPassword?.message}
          htmlFor="confirmPassword"
        >
          <Input
            id="confirmPassword"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Reset password
        </Button>
      </form>
    </div>
  );
}
