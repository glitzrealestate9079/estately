"use client";

import { useEffect, useRef } from "react";

// Ported from blog-detail.js's scroll listener that fills #readBar's width
// as the visitor scrolls down the article.
export function ReadingProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="read-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}
