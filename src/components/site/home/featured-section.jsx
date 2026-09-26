"use client";

import { useState } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/site/property/property-card";
import { Scroller } from "@/components/site/ui/scroller";

const TABS = [
  { key: "buy", label: "Buy", route: "/buy", allLabel: "See all properties for sale" },
  { key: "rent", label: "Rent", route: "/rent", allLabel: "See all rentals" },
  { key: "pg", label: "PG", route: "/pg", allLabel: "See all PGs" },
  { key: "commercial", label: "Commercial", mobileLabel: "Office", route: "/commercial", allLabel: "See all commercial" },
  { key: "plot", label: "Plots", route: "/plots", allLabel: "See all plots & land" },
];

// Ported from the prototype's featured() section in home.js — client-side
// category switch over pools already mapped/sorted on the server.
export function FeaturedSection({ pools }) {
  const [active, setActive] = useState("buy");
  const tab = TABS.find((t) => t.key === active);
  const list = pools[active] ?? [];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="h2">Featured properties</h2>
            <p>Recently updated listings with location or document checks.</p>
          </div>
          <div className="seg hide-mobile">
            {TABS.map((t) => (
              <button key={t.key} className={active === t.key ? "is-active" : ""} onClick={() => setActive(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="seg seg-block show-mobile mb-16" style={{ overflowX: "auto" }}>
          {TABS.map((t) => (
            <button key={t.key} className={active === t.key ? "is-active" : ""} onClick={() => setActive(t.key)}>
              {t.mobileLabel ?? t.label}
            </button>
          ))}
        </div>
        <Scroller>
          {list.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </Scroller>
        <div className="mt-16" style={{ textAlign: "center" }}>
          <Link className="btn btn-outline" href={tab.route}>{tab.allLabel}</Link>
        </div>
      </div>
    </section>
  );
}
