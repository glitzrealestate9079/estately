"use client";

import { useEffect } from "react";
import { ContactActions } from "@/components/site/property/contact-actions";

// Ported from property-view.js's mobile sticky CTA — appended only on the
// property detail page, and only visible at mobile widths (site-template.css
// keeps .mobile-cta display:none above the mobile breakpoint). Toggles
// has-mobile-cta on both the real <body> (site-wide bottom nav / toast
// selectors) and .hp-app (site-scoped padding-bottom selector).
export function MobilePropertyCta({ property }) {
  useEffect(() => {
    const root = document.querySelector(".hp-app");
    document.body.classList.add("has-mobile-cta");
    root?.classList.add("has-mobile-cta");
    return () => {
      document.body.classList.remove("has-mobile-cta");
      root?.classList.remove("has-mobile-cta");
    };
  }, []);

  return <ContactActions property={property} variant="mobile-cta" />;
}
