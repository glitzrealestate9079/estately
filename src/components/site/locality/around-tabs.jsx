"use client";

import { useState } from "react";

export function AroundTabs({ around }) {
  const keys = Object.keys(around);
  const [active, setActive] = useState(keys[0]);
  return (
    <>
      <div className="tabs mb-8">
        {keys.map((k) => (
          <button key={k} type="button" className={`tab ${active === k ? "is-active" : ""}`} onClick={() => setActive(k)}>{k}</button>
        ))}
      </div>
      <ul className="nearby-list">
        {around[active].map(([name, dist]) => (
          <li key={name}><span>{name}</span><span className="d">{dist}</span></li>
        ))}
      </ul>
    </>
  );
}
