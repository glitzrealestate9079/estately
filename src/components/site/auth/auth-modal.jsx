"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/site/providers/site-provider";
import { PhoneOtpFlow } from "@/components/site/auth/phone-otp-flow";
import { AuthSide } from "@/components/site/auth/auth-side";

// Ported from the prototype's openLogin() in app.js — same modal DOM shape
// (.modal-root > .modal-backdrop + .modal.login-modal) so styles.css
// applies unmodified. The phone/OTP steps live in PhoneOtpFlow, shared with
// the standalone /login page.
export function AuthModal() {
  const { authModal, closeAuthModal } = useSite();
  const open = authModal.open;

  // Remount PhoneOtpFlow with a fresh key each time the modal opens, so its
  // internal step/phone/otp state always starts clean without needing an
  // effect (see react-hooks/set-state-in-effect).
  const [openCount, setOpenCount] = useState(0);
  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setOpenCount((c) => c + 1);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") closeAuthModal();
    }
    document.addEventListener("keydown", onKey);
    const root = document.querySelector(".hp-app");
    root?.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      root?.classList.remove("modal-open");
    };
  }, [open, closeAuthModal]);

  if (!open) return null;

  return (
    <div className="modal-root">
      <div className="modal-backdrop" onClick={closeAuthModal} />
      <div className="modal login-modal" role="dialog" aria-modal="true" aria-label="Log in or sign up" style={{ "--mw": "900px" }}>
        <div className="sheet-handle" />
        <div className="modal-head">
          <h3>Log in or sign up</h3>
          <button className="modal-x" aria-label="Close" onClick={closeAuthModal}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="modal-body">
          <div className="lm-grid">
            <AuthSide compact />
            <PhoneOtpFlow key={openCount} description={authModal.description} onDone={closeAuthModal} />
          </div>
        </div>
      </div>
    </div>
  );
}
