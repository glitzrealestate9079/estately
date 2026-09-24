"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { forgotPasswordSchema } from "@/schemas/authSchema";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSent(true);
  }

  if (sent) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600 dark:bg-success-500/10">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">Check your email</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          We&apos;ve sent password reset instructions to <strong>{getValues("email")}</strong>.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push("/admin/reset-password")}>
          Continue to reset password
        </Button>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-sm font-medium text-primary-600 hover:underline"
        >
          Didn&apos;t get the email? Try again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link href="/admin/login" className="mb-6 flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <h1 className="font-display text-2xl font-bold text-foreground">Forgot password?</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Enter your email and we&apos;ll send you instructions to reset it.
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

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Send reset instructions
        </Button>
      </form>
    </div>
  );
}
