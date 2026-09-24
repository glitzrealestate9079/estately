"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { loginSchema } from "@/schemas/authSchema";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "admin@estately.example", password: "", remember: true },
  });
  const remember = useWatch({ control, name: "remember" });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 900));
    toast.success("Welcome back! Redirecting to your dashboard…");
    router.push("/admin/dashboard");
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Sign in to manage your real estate platform.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Email address" required error={errors.email?.message} htmlFor="email">
          <Input
            id="email"
            type="email"
            icon={Mail}
            placeholder="you@company.com"
            error={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" required error={errors.password?.message} htmlFor="password">
          <Input
            id="password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={!!errors.password}
            {...register("password")}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-muted">
            <Checkbox
              checked={remember}
              onCheckedChange={(checked) => setValue("remember", checked === true)}
            />
            Remember me
          </label>
          <Link href="/admin/forgot-password" className="text-sm font-medium text-primary-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-foreground-muted">
        Protected admin area. Unauthorized access is prohibited.
      </p>
    </div>
  );
}
