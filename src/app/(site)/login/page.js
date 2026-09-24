"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite } from "@/components/site/providers/site-provider";
import { cn } from "@/lib/utils";

const DIGITS = 6;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { auth, login } = useSite();
  const [stage, setStage] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(DIGITS).fill(""));
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace(searchParams.get("redirect") || "/account");
    }
  }, [auth.isAuthenticated, router, searchParams]);

  async function handleSendOtp(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setMobileError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setStage("otp");
    toast.success(`OTP sent to +91 ${mobile}`, { description: "Use 123456 for this demo" });
  }

  function updateDigit(index, value) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    if (clean && index < DIGITS - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== DIGITS) {
      setOtpError("Enter the 6-digit code");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    if (code !== "123456") {
      setOtpError("Invalid code. Try 123456 for this demo.");
      return;
    }
    login({ mobile: `+91 ${mobile}`, name: name.trim() || "Guest User" });
    toast.success("You're signed in");
    router.replace(searchParams.get("redirect") || "/account");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-navy-900 text-white shadow-sm">
          <Building2 className="h-6 w-6" />
        </span>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-card sm:p-8">
        {stage === "otp" && (
          <button onClick={() => setStage("mobile")} className="mb-3 flex items-center gap-1 text-xs font-medium text-foreground-muted hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          {stage === "mobile" ? <Phone className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">
          {stage === "mobile" ? "Sign in to Estately" : "Verify your number"}
        </h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          {stage === "mobile" ? "Enter your mobile number to continue — no password needed." : `Enter the 6-digit code sent to +91 ${mobile}`}
        </p>

        {stage === "mobile" ? (
          <form className="mt-6 space-y-4" onSubmit={handleSendOtp} noValidate>
            <div>
              <Input
                autoFocus
                icon={Phone}
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={mobile}
                error={!!mobileError}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
              {mobileError && <p className="mt-1.5 text-xs font-medium text-error-600">{mobileError}</p>}
            </div>
            <Input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" className="w-full" loading={submitting}>
              Send OTP
            </Button>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleVerify} noValidate>
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => updateDigit(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputMode="numeric"
                  maxLength={1}
                  autoFocus={index === 0}
                  className={cn(
                    "h-12 w-10 rounded-lg border bg-surface text-center text-lg font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 sm:w-11",
                    otpError ? "border-error-500" : "border-border-subtle focus:border-primary-500"
                  )}
                />
              ))}
            </div>
            {otpError && <p className="text-xs font-medium text-error-600">{otpError}</p>}
            <Button type="submit" className="w-full" loading={submitting}>
              Verify &amp; continue
            </Button>
          </form>
        )}
      </div>
      <p className="mt-4 text-center text-[11px] text-foreground-muted">
        By continuing, you agree to Estately&apos;s Terms &amp; Privacy Policy.
      </p>
    </div>
  );
}
