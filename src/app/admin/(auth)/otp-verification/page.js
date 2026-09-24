"use client";

import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { otpSchema } from "@/schemas/authSchema";
import { cn } from "@/lib/utils";

const DIGITS = 6;

export default function OtpVerificationPage() {
  const router = useRouter();
  const inputRefs = useRef([]);
  const [digits, setDigits] = useState(Array(DIGITS).fill(""));
  const [timer, setTimer] = useState(30);

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(otpSchema), defaultValues: { otp: "" } });

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  function updateDigit(index, value) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    setValue("otp", next.join(""));
    if (clean && index < DIGITS - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("");
    while (next.length < DIGITS) next.push("");
    setDigits(next);
    setValue("otp", next.join(""));
    inputRefs.current[Math.min(pasted.length, DIGITS - 1)]?.focus();
  }

  async function onSubmit(values) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (values.otp !== "123456") {
      setError("otp", { message: "Invalid code. Try 123456 for this demo." });
      return;
    }
    toast.success("Identity verified successfully");
    router.push("/admin/dashboard");
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Verify your identity</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Enter the 6-digit code sent to your registered mobile number.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => updateDigit(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              maxLength={1}
              className={cn(
                "h-12 w-11 rounded-lg border bg-surface text-center text-lg font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
                errors.otp ? "border-error-500" : "border-border-subtle focus:border-primary-500"
              )}
            />
          ))}
        </div>
        {errors.otp && <p className="text-xs font-medium text-error-600">{errors.otp.message}</p>}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          Verify &amp; continue
        </Button>

        <p className="text-center text-sm text-foreground-muted">
          {timer > 0 ? (
            <>Resend code in {timer}s</>
          ) : (
            <button
              type="button"
              className="font-medium text-primary-600 hover:underline"
              onClick={() => setTimer(30)}
            >
              Resend code
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
