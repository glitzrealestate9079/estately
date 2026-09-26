"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/site/providers/site-provider";

const DEMO_OTP = "123456";
const RESEND_SECONDS = 30;

// Ported from the prototype's loginFlow() in app.js — same two steps
// (phone -> OTP) and demo OTP. Shared by AuthModal (the login gate) and the
// standalone /login page, which embed it in different chrome.
export function PhoneOtpFlow({ description, onDone }) {
  const { login } = useSite();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpInvalid, setOtpInvalid] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const boxRefs = useRef([]);

  useEffect(() => {
    if (step !== "otp" || resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [step, resendIn]);

  function handlePhoneSubmit(e) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setPhoneError(null);
    setStep("otp");
    setResendIn(RESEND_SECONDS);
  }

  function handleOtpChange(index, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && boxRefs.current[index + 1]) boxRefs.current[index + 1].focus();
    if (next.every((d) => d)) void verify(next.join(""));
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && boxRefs.current[index - 1]) {
      boxRefs.current[index - 1].focus();
    }
  }

  function handleOtpPaste(e) {
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array.from({ length: 6 }, (_, i) => text[i] || "");
    setOtp(next);
    (boxRefs.current[text.length] ?? boxRefs.current[5])?.focus();
    if (text.length === 6) void verify(text);
  }

  async function verify(code) {
    if (submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    if (code !== DEMO_OTP) {
      setSubmitting(false);
      setOtpInvalid(true);
      setOtp(["", "", "", "", "", ""]);
      boxRefs.current[0]?.focus();
      return;
    }
    setOtpInvalid(false);
    setOtpValid(true);
    login({ name: "Guest User", phone, type: "Buyer/Tenant" });
    await new Promise((r) => setTimeout(r, 300));
    setSubmitting(false);
    onDone?.();
  }

  function handleResend() {
    setResendIn(RESEND_SECONDS);
    setOtp(["", "", "", "", "", ""]);
    setOtpInvalid(false);
    boxRefs.current[0]?.focus();
  }

  return (
    <div className="lm-form">
      {description && (
        <div className="login-intent">
          <i className="bi bi-info-circle" />
          <span>{description}</span>
        </div>
      )}
      {step === "phone" ? (
        <>
          <h1 className="h2">Log in or sign up</h1>
          <p className="muted mt-4 mb-24">Browse freely — log in only to save, contact or post.</p>
          <form className="stack" style={{ "--stack": "14px" }} onSubmit={handlePhoneSubmit} noValidate>
            <div className={`field ${phoneError ? "is-invalid" : ""}`}>
              <label className="label" htmlFor="lg-phone">Mobile number</label>
              <div className="input-group">
                <span className="addon">+91</span>
                <input
                  id="lg-phone"
                  className="input"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  autoFocus
                />
              </div>
              {phoneError ? (
                <span className="error-text"><i className="bi bi-exclamation-circle" />{phoneError}</span>
              ) : (
                <span className="hint">New here? An account is created automatically.</span>
              )}
            </div>
            <button className="btn btn-primary btn-lg btn-block" type="submit">Get OTP</button>
            <p className="xs muted" style={{ textAlign: "center" }}>
              By continuing you agree to the <a className="btn-link" href="#">Terms</a> and <a className="btn-link" href="#">Privacy Policy</a>.
            </p>
          </form>
        </>
      ) : (
        <div className="stack" style={{ "--stack": "16px" }}>
          <div>
            <h1 className="h2">Enter OTP</h1>
            <p className="muted mt-4">
              Sent to <b className="ink">+91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</b> ·{" "}
              <button type="button" className="btn-link" onClick={() => setStep("phone")}>Change</button>
            </p>
          </div>
          <div className={`otp ${otpInvalid ? "is-invalid" : ""} ${otpValid ? "is-valid" : ""}`} role="group" aria-label="One-time password">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (boxRefs.current[i] = el)}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={handleOtpPaste}
              />
            ))}
          </div>
          <div style={{ textAlign: "center" }} className="small">
            {otpInvalid && (
              <p className="error-text" style={{ justifyContent: "center" }}>
                <i className="bi bi-exclamation-circle" />Incorrect OTP. Please check and try again.
              </p>
            )}
            <p className="muted mt-4">
              Didn&apos;t get it?{" "}
              <button type="button" className="btn-link" disabled={resendIn > 0} onClick={handleResend}>
                {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
              </button>
            </p>
            <div className="otp-demo mt-12">
              <i className="bi bi-info-circle-fill" />
              <span>Demo OTP <b className="kbd">{DEMO_OTP}</b><small>Any other code shows the error state</small></span>
            </div>
          </div>
          <button className={`btn btn-primary btn-lg btn-block ${submitting ? "is-loading" : ""}`} onClick={() => verify(otp.join(""))}>
            Verify &amp; continue
          </button>
        </div>
      )}
      <div className="auth-trust">
        <span><i className="bi bi-lock-fill" />Secure OTP login</span>
        <span><i className="bi bi-incognito" />Number stays private</span>
      </div>
    </div>
  );
}
