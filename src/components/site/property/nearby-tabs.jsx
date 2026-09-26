"use client";

import { useState } from "react";

function distanceLabel(d) {
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
}

// Ported from the prototype's nearby tabs in property-view.js.
export function NearbyTabs({ nearby }) {
  const keys = Object.keys(nearby);
  const [active, setActive] = useState(keys[0]);

  return (
    <>
      <div className="tabs mb-8">
        {keys.map((k) => (
          <button key={k} type="button" className={`tab ${active === k ? "is-active" : ""}`} onClick={() => setActive(k)}>{k}</button>
        ))}
      </div>
      <ul className="nearby-list">
        {nearby[active].map(([name, dist]) => (
          <li key={name}><span>{name}</span><span className="d">{distanceLabel(dist)}</span></li>
        ))}
      </ul>
    </>
  );
}
