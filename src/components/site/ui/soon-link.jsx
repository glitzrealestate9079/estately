"use client";

import { toast } from "sonner";

// Ported from the prototype's global `data-soon` handler in app.js — any
// link to a page that isn't part of this build shows the same toast instead
// of a broken/blank navigation.
export function SoonLink({ children, className, ...props }) {
  return (
    <a
      href="#"
      className={className}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        toast("This page isn't part of the prototype");
      }}
    >
      {children}
    </a>
  );
}
