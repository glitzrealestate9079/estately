"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteModal } from "@/components/site/ui/site-modal";
import { LocationAutocomplete } from "@/components/site/home/location-autocomplete";
import { CATEGORY_LIST } from "@/lib/site/categories";
import { getPopularLocalities } from "@/lib/site/site-data";

const POPULAR_TEMPLATES = [
  (loc) => ({ label: `2 BHK in ${loc.name}`, href: `/buy?city=${enc(loc.cityName)}&locality=${enc(loc.name)}&bhk=2` }),
  (loc) => ({ label: `Plots in ${loc.name}`, href: `/plots?city=${enc(loc.cityName)}&locality=${enc(loc.name)}` }),
  (loc) => ({ label: `Flats in ${loc.name}`, href: `/buy?city=${enc(loc.cityName)}&locality=${enc(loc.name)}&propertyType=Apartment` }),
  (loc) => ({ label: `PG in ${loc.name}`, href: `/pg?city=${enc(loc.cityName)}&locality=${enc(loc.name)}` }),
  (loc) => ({ label: `Office space in ${loc.name}`, href: `/commercial?city=${enc(loc.cityName)}&locality=${enc(loc.name)}&commercialCategory=Office` }),
];

function enc(v) {
  return encodeURIComponent(v ?? "");
}

// Ported from the prototype's mountBottomNav()'s "Search" button →
// openSearchOverlay() in app.js — a full-screen (on mobile) quick-search
// sheet: category tabs, a location field, popular searches, and a footer
// Search button. Opened from MobileBottomNav instead of that component
// linking straight to /search.
export function MobileSearchOverlay({ onClose }) {
  const router = useRouter();
  const [cat, setCat] = useState("buy");
  const [locText, setLocText] = useState("");
  const [locSel, setLocSel] = useState(null);

  const category = CATEGORY_LIST.find((c) => c.key === cat);
  const popular = getPopularLocalities(POPULAR_TEMPLATES.length).map((loc, i) => POPULAR_TEMPLATES[i](loc));

  function go(selOverride) {
    const sel = selOverride ?? locSel;
    const params = new URLSearchParams();
    if (sel) {
      if (sel.cityName) params.set("city", sel.cityName);
      if (sel.localityName) params.set("locality", sel.localityName);
    } else if (locText.trim()) {
      params.set("q", locText.trim());
    }
    const qs = params.toString();
    router.push(qs ? `${category.href}?${qs}` : category.href);
    onClose();
  }

  return (
    <SiteModal
      title="Search properties"
      full
      size={640}
      className="search-ov"
      onClose={onClose}
      foot={
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={go}>
          <i className="bi bi-search" />Search
        </button>
      }
    >
      <div className="seg seg-block" style={{ overflowX: "auto" }}>
        {CATEGORY_LIST.map((c) => (
          <button key={c.key} type="button" className={cat === c.key ? "is-active" : ""} onClick={() => setCat(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="field mt-16" style={{ position: "relative" }}>
        <label className="label" htmlFor="ov-loc">Location</label>
        <div className="input-group">
          <span className="addon"><i className="bi bi-geo-alt" /></span>
          <LocationAutocomplete
            id="ov-loc"
            className="input"
            value={locText}
            onChange={(text) => {
              setLocText(text);
              if (locSel && locSel.label !== text) setLocSel(null);
            }}
            onSelect={(s) => {
              setLocSel(s);
              go(s);
            }}
            placeholder="City, locality, project or landmark"
          />
        </div>
      </div>
      <div className="mt-24">
        <div className="ds-label">Popular searches</div>
        <div className="pop-links">
          {popular.map((p) => (
            <Link key={p.label} className="pop-link" href={p.href} onClick={onClose}>
              <i className="bi bi-search" />{p.label}
            </Link>
          ))}
        </div>
      </div>
    </SiteModal>
  );
}
