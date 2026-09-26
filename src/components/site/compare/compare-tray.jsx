"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSite } from "@/components/site/providers/site-provider";
import { PROPERTIES } from "@/data/properties";

// Ported from app.js's renderCompareTray() — a persistent floating bar that
// appears sitewide (except where the original opts out via noCompareTray)
// whenever at least one property is queued for comparison.
export function CompareTray() {
  const { mounted, compareIds, toggleCompare, clearCompare } = useSite();

  // `body.has-compare` shifts the mobile map-toggle FAB up so it doesn't sit
  // underneath the tray — matches app.js's renderCompareTray() class toggle.
  useEffect(() => {
    document.body.classList.toggle("has-compare", mounted && compareIds.length > 0);
    return () => document.body.classList.remove("has-compare");
  }, [mounted, compareIds.length]);

  if (!mounted || compareIds.length === 0) return null;

  const thumbs = Array.from({ length: 4 }, (_, i) => {
    const id = compareIds[i];
    return id ? PROPERTIES.find((p) => p.id === id) : null;
  });

  return (
    <section className="compare-tray" aria-label="Compare tray">
      <div className="thumbs">
        {thumbs.map((p, i) => (
          <div className="thumb" key={p?.id ?? i}>
            {p && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt="" />
                <button type="button" aria-label="Remove" onClick={() => toggleCompare(p.id)}>
                  <i className="bi bi-x" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="small hide-mobile"><b className="ink">{compareIds.length} of 4</b> selected</div>
      <button type="button" data-clear className="btn btn-ghost btn-sm" onClick={clearCompare}>Clear</button>
      <Link className="btn btn-primary btn-sm" href="/compare">Compare ({compareIds.length})</Link>
    </section>
  );
}
