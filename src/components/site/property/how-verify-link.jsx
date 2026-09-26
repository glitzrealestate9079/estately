"use client";

import { useState } from "react";
import { SiteModal } from "@/components/site/ui/site-modal";

const CHECKS = [
  ["bi-phone", "Phone verified", "The seller confirmed their mobile number with an OTP."],
  ["bi-person-vcard", "Identity verified", "A government ID (Aadhaar / PAN) was matched to the seller's name."],
  ["bi-geo-alt", "Location verified", "The map pin matches geo-tagged photos taken at the property."],
  ["bi-file-earmark-check", "Ownership documents", "For sale listings, a sale deed or allotment letter was checked against the seller's identity. This is not a legal title search."],
  ["bi-file-earmark-text", "RERA information", "We display the registration number provided by the developer. RERA status should be checked on the state RERA portal."],
  ["bi-clock-history", "Freshness", "Sellers confirm availability and price regularly; listings not confirmed in 30 days are hidden from search."],
];

// Ported from app.js's openHowVerify() modal.
export function HowVerifyLink({ small }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`btn-link ${small ? "small" : ""} mt-12`} onClick={() => setOpen(true)}>
        <i className="bi bi-question-circle" /> What do these checks mean?
      </button>
      {open && (
        <SiteModal title="How Estately verifies listings" size={540} onClose={() => setOpen(false)}>
          <div className="stack" style={{ "--stack": "14px" }}>
            <p className="muted">We never show a generic &ldquo;Verified&rdquo; badge. Each check below is shown separately, and only when it was actually completed.</p>
            {CHECKS.map(([icon, title, text]) => (
              <div key={title} className="row" style={{ alignItems: "flex-start", gap: 12 }}>
                <span className="ac-ico"><i className={`bi ${icon}`} /></span>
                <div><div className="strong">{title}</div><div className="small muted">{text}</div></div>
              </div>
            ))}
          </div>
        </SiteModal>
      )}
    </>
  );
}
