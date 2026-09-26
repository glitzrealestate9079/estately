"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LocationAutocomplete } from "@/components/site/home/location-autocomplete";
import { SiteModal } from "@/components/site/ui/site-modal";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/site/categories";
import { PG_ROOM_TYPES, COMMERCIAL_CATEGORIES, POSSESSION_STATUSES, PLOT_TYPES } from "@/lib/site/derived";
import { getPopularLocalities, PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS } from "@/lib/site/site-data";

const BUDGET_SALE = [
  ["", "Any budget"],
  ["0-3000000", "Under ₹30 L"],
  ["3000000-5000000", "₹30 L – ₹50 L"],
  ["5000000-10000000", "₹50 L – ₹1 Cr"],
  ["10000000-20000000", "₹1 Cr – ₹2 Cr"],
  ["20000000-", "₹2 Cr +"],
];
const BUDGET_RENT = [
  ["", "Any rent"],
  ["0-10000", "Under ₹10,000"],
  ["10000-20000", "₹10,000 – ₹20,000"],
  ["20000-35000", "₹20,000 – ₹35,000"],
  ["35000-", "₹35,000 +"],
];
const BUDGET_PG = [
  ["", "Any rent"],
  ["0-7000", "Under ₹7,000"],
  ["7000-10000", "₹7,000 – ₹10,000"],
  ["10000-15000", "₹10,000 – ₹15,000"],
  ["15000-", "₹15,000 +"],
];
const AREA_SQFT = [
  ["", "Any size"],
  ["0-1000", "Under 1,000 sq.ft"],
  ["1000-5000", "1,000 – 5,000 sq.ft"],
  ["5000-", "5,000 sq.ft +"],
];
const BHK = [["", "Any BHK"], ["1", "1 BHK"], ["2", "2 BHK"], ["3", "3 BHK"], ["4", "4+ BHK"]];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];

// Per-category quick-filter selects, mirroring the prototype's home.js TABS
// config field-for-field — reusing this app's real filter vocabulary
// (usePropertySearch()/applyFilters()) instead of the prototype's own mock
// query scheme, so picking a value here actually filters the results page.
const FIELDS = {
  buy: [
    { key: "propertyType", label: "Property type", icon: "bi-buildings", kind: "value", options: [["", "All residential"], ...CATEGORIES.buy.propertyTypes.map((t) => [t, t])] },
    { key: "budget", label: "Budget", icon: "bi-currency-rupee", kind: "range", rangeKeys: ["minPrice", "maxPrice"], options: BUDGET_SALE },
    { key: "bhk", label: "BHK", icon: "bi-house", kind: "value", options: BHK },
  ],
  rent: [
    { key: "propertyType", label: "Property type", icon: "bi-buildings", kind: "value", options: [["", "All residential"], ...CATEGORIES.rent.propertyTypes.map((t) => [t, t])] },
    { key: "budget", label: "Monthly rent", icon: "bi-currency-rupee", kind: "range", rangeKeys: ["minPrice", "maxPrice"], options: BUDGET_RENT },
    { key: "bhk", label: "BHK", icon: "bi-house", kind: "value", options: BHK },
  ],
  pg: [
    { key: "roomType", label: "Occupancy", icon: "bi-people", kind: "value", options: [["", "Any sharing"], ...PG_ROOM_TYPES.map((t) => [t, t.replace(" Sharing", "")])] },
    { key: "budget", label: "Rent per bed", icon: "bi-currency-rupee", kind: "range", rangeKeys: ["minPrice", "maxPrice"], options: BUDGET_PG },
    { key: "gender", label: "Available for", icon: "bi-person", kind: "value", options: [["", "Anyone"], ["Male", "Boys / Men"], ["Female", "Girls / Women"]] },
  ],
  commercial: [
    { key: "commercialCategory", label: "Type", icon: "bi-shop", kind: "value", options: [["", "All commercial"], ...COMMERCIAL_CATEGORIES.map((t) => [t, t])] },
    { key: "listingType", label: "Looking to", icon: "bi-arrow-left-right", kind: "value", options: [["", "Lease or buy"], ["Rent", "Lease / rent"], ["Sale", "Buy"]] },
    { key: "area", label: "Area", icon: "bi-arrows-angle-expand", kind: "range", rangeKeys: ["minArea", "maxArea"], options: AREA_SQFT },
  ],
  plots: [
    { key: "plotType", label: "Plot type", icon: "bi-bounding-box", kind: "value", options: [["", "All plots & land"], ...PLOT_TYPES.map((t) => [t, t])] },
    { key: "budget", label: "Budget", icon: "bi-currency-rupee", kind: "range", rangeKeys: ["minPrice", "maxPrice"], options: BUDGET_SALE },
    { key: "area", label: "Area", icon: "bi-arrows-angle-expand", kind: "range", rangeKeys: ["minArea", "maxArea"], options: AREA_SQFT },
  ],
  projects: [
    { key: "status", label: "Project status", icon: "bi-flag", kind: "value", options: [["", "Any status"], ...PROJECT_STATUS_OPTIONS.map((s) => [s, s])] },
    { key: "budget", label: "Budget", icon: "bi-currency-rupee", kind: "range", rangeKeys: ["minPrice", "maxPrice"], options: BUDGET_SALE },
    { key: "propertyType", label: "Property type", icon: "bi-house", kind: "value", options: [["", "Any type"], ...PROJECT_TYPE_OPTIONS.map((t) => [t, t])] },
  ],
};

// Advanced-filters modal groups — a proportionate subset of the prototype's
// much larger per-category ADV config, limited to dimensions this app's real
// filter engine (applyFilters()/applyProjectFilters()) actually supports, so
// every toggle here genuinely changes the results rather than being decorative.
const ADV = {
  buy: [
    ["furnishing", "Furnishing", "value", FURNISHING_OPTIONS.map((f) => [f, f])],
    ["possession", "Possession", "value", POSSESSION_STATUSES.map((p) => [p, p])],
    ["parking", "Parking available", "toggle"],
    ["verified", "Verified only", "toggle"],
    ["rera", "RERA registered", "toggle"],
    ["ownerOnly", "Owner listings only", "toggle"],
  ],
  rent: [
    ["furnishing", "Furnishing", "value", FURNISHING_OPTIONS.map((f) => [f, f])],
    ["parking", "Parking available", "toggle"],
    ["verified", "Verified only", "toggle"],
    ["ownerOnly", "Owner listings only", "toggle"],
  ],
  pg: [
    ["verified", "Verified only", "toggle"],
    ["ownerOnly", "Owner listings only", "toggle"],
  ],
  commercial: [
    ["furnishing", "Fit-out", "value", FURNISHING_OPTIONS.map((f) => [f, f])],
    ["parking", "Parking available", "toggle"],
    ["verified", "Verified only", "toggle"],
    ["rera", "RERA registered", "toggle"],
    ["ownerOnly", "Owner listings only", "toggle"],
  ],
  plots: [
    ["verified", "Verified only", "toggle"],
    ["rera", "RERA / approval on record", "toggle"],
    ["ownerOnly", "Owner listings only", "toggle"],
  ],
  projects: [["rera", "RERA registration provided", "toggle"]],
};

// Matches the prototype's home.js TABS[*].label wording exactly (its own
// per-category "hero" field is a byte off for PG, and "Plots"/"Projects" are
// shorter than the header nav's "Plots / Land"/"New Projects" labels).
const HERO_TAB_LABEL = { buy: "Buy", rent: "Rent", pg: "PG / Co-living", commercial: "Commercial", plots: "Plots", projects: "Projects" };

const TRENDING_TEMPLATES = {
  buy: (loc) => ({ label: `Flats in ${loc.name}`, params: { city: loc.cityName, locality: loc.name } }),
  rent: (loc) => ({ label: `2 BHK for rent in ${loc.name}`, params: { city: loc.cityName, locality: loc.name, bhk: "2" } }),
  pg: (loc) => ({ label: `PG in ${loc.name}`, params: { city: loc.cityName, locality: loc.name } }),
  commercial: (loc) => ({ label: `Office space in ${loc.name}`, params: { city: loc.cityName, locality: loc.name, commercialCategory: "Office" } }),
  plots: (loc) => ({ label: `Plots in ${loc.name}`, params: { city: loc.cityName, locality: loc.name } }),
  projects: (loc) => ({ label: `New projects in ${loc.name}`, params: { city: loc.cityName, locality: loc.name } }),
};

function rangeToMinMax(value) {
  if (!value) return {};
  const [min, max] = value.split("-");
  return { min: min || "", max: max || "" };
}

function withoutKey(obj, key) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}

// Ported from the prototype's hero-search (index.html) + home.js — category
// tabs, per-category quick-filter selects, location autocomplete and an
// advanced-filters modal, all in one component so the `cat` tab state stays
// in sync between the search form and the trending-searches strip beneath it
// (which the prototype renders as a DOM sibling outside .hero, hence the
// Fragment: this returns both the hero section and that strip together).
export function HeroSection() {
  const router = useRouter();
  const [cat, setCat] = useState("buy");
  const [locText, setLocText] = useState("");
  const [locSel, setLocSel] = useState(null);
  const [quick, setQuick] = useState({});
  const [adv, setAdv] = useState({});
  const [advOpen, setAdvOpen] = useState(false);
  const [advDraft, setAdvDraft] = useState({});

  const category = CATEGORIES[cat];
  const fields = FIELDS[cat];
  const advGroups = ADV[cat] ?? [];
  const advCount = Object.keys(adv).length;

  function selectTab(key) {
    setCat(key);
    setQuick({});
    setAdv({});
  }

  function handleLocChange(text) {
    setLocText(text);
    if (locSel && locSel.label !== text) setLocSel(null);
  }

  function buildParams() {
    const params = new URLSearchParams();
    if (locSel) {
      if (locSel.cityName) params.set("city", locSel.cityName);
      if (locSel.localityName) params.set("locality", locSel.localityName);
    } else if (locText.trim()) {
      params.set("q", locText.trim());
    }
    fields.forEach((f) => {
      const value = quick[f.key];
      if (!value) return;
      if (f.kind === "range") {
        const { min, max } = rangeToMinMax(value);
        if (min) params.set(f.rangeKeys[0], min);
        if (max) params.set(f.rangeKeys[1], max);
      } else {
        params.set(f.key, value);
      }
    });
    Object.entries(adv).forEach(([k, v]) => params.set(k, v === true ? "true" : v));
    return params;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const params = buildParams();
    const qs = params.toString();
    router.push(qs ? `${category.href}?${qs}` : category.href);
  }

  function openAdvFilters() {
    setAdvDraft(adv);
    setAdvOpen(true);
  }

  function applyAdvFilters() {
    setAdv(advDraft);
    setAdvOpen(false);
  }

  const advDraftCount = Object.keys(advDraft).length;

  function toggleAdvDraft(key, checked) {
    setAdvDraft((d) => (checked ? { ...d, [key]: true } : withoutKey(d, key)));
  }

  function pickAdvDraft(key, value) {
    setAdvDraft((d) => (d[key] === value ? withoutKey(d, key) : { ...d, [key]: value }));
  }

  const trending = getPopularLocalities(3).map((loc) => TRENDING_TEMPLATES[cat](loc));

  return (
    <>
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=70")' }} />
        <div className="container">
          <span className="hero-eyebrow">India&apos;s property marketplace</span>
          <h1 className="display">Find a place you&apos;ll love to call home</h1>
          <p>Search homes, rentals, PGs, plots, commercial spaces and new projects with location-first discovery and clear property information.</p>

          <div className="hero-search">
            <form className="search-card" onSubmit={handleSubmit} role="search">
              <div className="search-tabs" role="tablist" aria-label="What are you looking for?">
                {CATEGORY_LIST.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    role="tab"
                    className={`search-tab ${cat === c.key ? "is-active" : ""}`}
                    aria-selected={cat === c.key}
                    onClick={() => selectTab(c.key)}
                  >
                    {HERO_TAB_LABEL[c.key]}
                  </button>
                ))}
              </div>
              <div className="search-body">
                <div className={`sfield sfield-loc ${locSel ? "has-level" : ""}`}>
                  <label htmlFor="hs-loc"><i className="bi bi-geo-alt-fill" />Location</label>
                  <i className="bi bi-search sfield-icon" aria-hidden="true" />
                  <LocationAutocomplete
                    id="hs-loc"
                    value={locText}
                    onChange={handleLocChange}
                    onSelect={(s) => setLocSel(s)}
                    placeholder="Locality, project or city"
                  />
                  {locSel && <span className="level-pill badge badge-info badge-sm">{locSel.level}</span>}
                </div>
                {fields.map((f) => (
                  <div className="sfield" key={f.key}>
                    <label htmlFor={`hs-${f.key}`}><i className={`bi ${f.icon}`} />{f.label}</label>
                    <select
                      id={`hs-${f.key}`}
                      value={quick[f.key] ?? ""}
                      onChange={(e) => setQuick((q) => ({ ...q, [f.key]: e.target.value }))}
                    >
                      {f.options.map(([v, l]) => (
                        <option key={v || "any"} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="search-actions">
                  {advGroups.length > 0 && (
                    <button
                      className={`btn btn-outline search-filter ${advCount ? "has-count" : ""}`}
                      type="button"
                      aria-label={advCount ? `Advanced filters (${advCount} applied)` : "Advanced filters"}
                      title="Advanced filters"
                      onClick={openAdvFilters}
                    >
                      <i className="bi bi-sliders" />
                      {advCount > 0 && <span className="search-filter-count">{advCount}</span>}
                    </button>
                  )}
                  <button className="btn btn-primary search-go" type="submit">Search</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="hero-trending">
          <span className="quick-label">Popular searches:</span>
          <div className="hero-trending-list">
            {trending.map((t) => (
              <Link key={t.label} className="chip chip-sm" href={`${category.href}?${new URLSearchParams(t.params).toString()}`}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {advOpen && (
        <SiteModal
          title={`More filters · ${category.label}`}
          size={560}
          onClose={() => setAdvOpen(false)}
          foot={
            <>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!advDraftCount}
                onClick={() => setAdvDraft({})}
              >
                Clear all
              </button>
              <button type="button" className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={applyAdvFilters}>
                {advDraftCount ? `Apply ${advDraftCount} filter${advDraftCount === 1 ? "" : "s"}` : "Done"}
              </button>
            </>
          }
        >
          {advGroups.map(([key, label, kind, options]) => (
            <div className="filter-group" key={key}>
              {kind === "toggle" ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!!advDraft[key]}
                    onChange={(e) => toggleAdvDraft(key, e.target.checked)}
                  />
                  {label}
                </label>
              ) : (
                <>
                  <span className="label">{label}</span>
                  <div className="row-wrap">
                    {options.map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        className="chip chip-sm"
                        aria-pressed={advDraft[key] === v}
                        onClick={() => pickAdvDraft(key, v)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </SiteModal>
      )}
    </>
  );
}
