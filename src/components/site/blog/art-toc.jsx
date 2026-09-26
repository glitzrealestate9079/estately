"use client";

import { useEffect, useState } from "react";

// Ported from blog-detail.js's IntersectionObserver that highlights the
// currently-read section in the "In this article" sidebar.
export function ArtToc({ toc }) {
  const [activeId, setActiveId] = useState(toc[0]?.id ?? null);

  useEffect(() => {
    const headings = toc.map((h) => document.getElementById(h.id)).filter(Boolean);
    if (headings.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="art-toc hide-mobile">
      <div className="art-aside-title"><i className="bi bi-list-ul" />In this article</div>
      <ol>
        {toc.map((h) => (
          <li key={h.id}><a href={`#${h.id}`} className={h.id === activeId ? "is-active" : ""}>{h.text}</a></li>
        ))}
      </ol>
    </div>
  );
}
