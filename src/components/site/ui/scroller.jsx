"use client";

import { useRef } from "react";

// Ported from the prototype's scroller prev/next wiring in app.js.
export function Scroller({ children }) {
  const ref = useRef(null);

  function scrollBy(dir) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <div className="scroller-wrap">
      <button type="button" className="scroller-btn prev" aria-label="Previous" onClick={() => scrollBy(-1)}>
        <i className="bi bi-chevron-left" />
      </button>
      <div className="scroller" ref={ref}>
        {children}
      </div>
      <button type="button" className="scroller-btn next" aria-label="Next" onClick={() => scrollBy(1)}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}
