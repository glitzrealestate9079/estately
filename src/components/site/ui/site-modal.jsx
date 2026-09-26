"use client";

import { useEffect } from "react";

// Shared modal chrome matching the prototype's modal() helper in app.js —
// same .modal-root > .modal-backdrop + .modal DOM shape (so styles.css
// applies unmodified), same Escape-to-close and .modal-open scroll-lock
// behavior already established by auth-modal.jsx.
export function SiteModal({ title, onClose, size = 480, children, foot, full, className = "" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const root = document.querySelector(".hp-app");
    root?.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      root?.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="modal-root">
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal ${full ? "is-full" : ""} ${className}`} role="dialog" aria-modal="true" aria-label={title} style={{ "--mw": `${size}px` }}>
        <div className="sheet-handle" />
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-x" aria-label="Close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </div>
  );
}
