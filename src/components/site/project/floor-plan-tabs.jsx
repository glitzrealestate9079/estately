"use client";

import { useState } from "react";
import { floorPlanSvg } from "@/lib/site/template/floor-plan-svg";
import { num } from "@/lib/site/template/format";

// Ported from the prototype's Floor plans section in project.js.
export function FloorPlanTabs({ units }) {
  const [active, setActive] = useState(0);
  const u = units[active];
  const bhk = Number(u.name.match(/\d/)?.[0] ?? 2);

  return (
    <>
      <div className="tabs mb-16">
        {units.map((unit, i) => (
          <button key={i} type="button" className={`tab ${active === i ? "is-active" : ""}`} onClick={() => setActive(i)}>{unit.name}</button>
        ))}
      </div>
      <div className="floorplan" dangerouslySetInnerHTML={{ __html: floorPlanSvg({ cat: "buy", bhk, bathrooms: Math.min(bhk, 3) }) }} />
      <p className="xs muted mt-8">{u.name} · {num(u.size)} sq.ft super area · {num(u.carpet)} sq.ft carpet. Indicative layout — refer to the developer&apos;s approved plan.</p>
    </>
  );
}
