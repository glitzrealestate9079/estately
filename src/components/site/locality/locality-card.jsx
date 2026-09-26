"use client";

import Link from "next/link";
import { num } from "@/lib/site/template/format";

function trim0(n) {
  return String(+n.toFixed(2));
}

function kShort(n) {
  return n >= 1e5 ? `${trim0(n / 1e5)} L` : `${trim0(n / 1e3)}k`;
}

// Ported from the prototype's localityCard() in app.js, fed by
// toTemplateLocality() instead of the prototype's own mock data shape.
export function LocalityCard({ locality }) {
  const l = locality;
  const yoy = Math.round((l.trend[5] / l.trend[1] - 1) * 100);
  return (
    <Link className="loc-card" href={`/locality/${l.slug}`} aria-label={`${l.name}, ${l.zone} — view locality`}>
      <div className="media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={l.img} alt="" />
        <span className="loc-rating"><i className="bi bi-star-fill" />{l.rating}</span>
      </div>
      <div className="body">
        <div className="loc-head">
          <div>
            <div className="loc-name">{l.name}</div>
            <div className="loc-zone"><i className="bi bi-geo-alt" />{l.zone}</div>
          </div>
        </div>
        <div className="loc-stats">
          <div><div className="k">Avg. sale price</div><div className="v">₹{num(l.avg)}<small>/sq.ft</small></div></div>
          <div><div className="k">Rent (2 BHK)</div><div className="v">₹{kShort(l.rent[0])}–{kShort(l.rent[1])}<small>/mo</small></div></div>
        </div>
        <div className="loc-foot">
          <span><i className="bi bi-houses" />{num(l.count)} properties</span>
          {yoy > 0 && <span className="loc-trend"><i className="bi bi-graph-up-arrow" />+{yoy}% YoY</span>}
        </div>
        <div className="loc-reveal" aria-hidden="true"><span className="loc-explore">Explore locality<i className="bi bi-arrow-right" /></span></div>
      </div>
    </Link>
  );
}
