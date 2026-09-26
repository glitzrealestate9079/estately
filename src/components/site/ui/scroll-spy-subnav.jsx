"use client";

import { useEffect, useState } from "react";

// Ported from the prototype's IntersectionObserver-driven subnav (#ltabs /
// #ptabs) that highlights the section currently in view as the visitor
// scrolls, instead of only ever showing the first tab as active.
export function ScrollSpySubnav({ sections }) {
  const [active, setActive] = useState(sections[0]?.[0]);

  useEffect(() => {
    const targets = sections.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (targets.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="tabs">
      {sections.map(([id, label]) => (
        <a key={id} className={`tab ${id === active ? "is-active" : ""}`} href={`#${id}`}>{label}</a>
      ))}
    </div>
  );
}
