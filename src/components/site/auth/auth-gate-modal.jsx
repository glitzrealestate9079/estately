"use client";

import { useRef, useState } from "react";
import { Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSite } from "@/components/site/providers/site-provider";
import { cn } from "@/lib/utils";

const DIGITS = 6;

// Mounted once in the site layout. Any protected consumer action (contact a
// seller, schedule a visit, save a search, post a property) routes through
// useSite().requireAuth(), which opens this exact modal and resumes the
// original action the moment OTP verification succeeds.
export function AuthGateModal() {
  const { authModal, closeAuthModal, login } = useSite();
  const [stage, setStage] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(DIGITS).fill(""));
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [wasOpen, setWasOpen] = useState(authModal.open);
  const inputRefs = useRef([]);

  // Reset the form fields each time the modal transitions to open — adjusted
  // during render per React's "you might not need an effect" guidance,
  // since it's purely derived from the authModal.open prop changing.
  if (authModal.open !== wasOpen) {
    setWasOpen(authModal.open);
    if (authModal.open) {
      setStage("mobile");
      setMobile("");
      setName("");
      setMobileError("");
      setOtpDigits(Array(DIGITS).fill(""));
      setOtpError("");
    }
  }

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
  }

  return (
    <Modal open={authModal.open} onOpenChange={(open) => !open && closeAuthModal()}>
      <ModalContent size="sm" className="p-0">
        <ModalHeader className="border-0 pb-0">
          {stage === "otp" && (
            <button
              onClick={() => setStage("mobile")}
              className="mb-2 flex items-center gap-1 text-xs font-medium text-foreground-muted hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
            {stage === "mobile" ? <Phone className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>
          <ModalTitle className="mt-3">
            {stage === "mobile" ? "Sign in to continue" : "Verify your number"}
          </ModalTitle>
          <ModalDescription>
            {authModal.description ??
              (stage === "mobile"
                ? "We use your mobile number to keep your saved searches and enquiries in sync."
                : `Enter the 6-digit code sent to +91 ${mobile}`)}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="pt-4">
          {stage === "mobile" ? (
            <form className="space-y-4" onSubmit={handleSendOtp} noValidate>
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
              <p className="text-center text-[11px] leading-relaxed text-foreground-muted">
                By continuing, you agree to Estately&apos;s Terms &amp; Privacy Policy.
              </p>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleVerify} noValidate>
              <div className="flex justify-between gap-2">
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
                      "h-12 w-11 rounded-lg border bg-surface text-center text-lg font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
