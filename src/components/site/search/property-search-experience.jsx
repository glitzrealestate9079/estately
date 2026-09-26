"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePropertySearch } from "@/components/site/search/use-property-search";
import { FilterDrawer } from "@/components/site/search/filter-drawer";
import { ResultsMap } from "@/components/site/search/results-map";
import { PropertyCard } from "@/components/site/property/property-card";
import { LocationAutocomplete } from "@/components/site/home/location-autocomplete";
import { useSite } from "@/components/site/providers/site-provider";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/site/categories";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";

const SORTS = {
  relevance: "Relevance",
  newest: "Recently updated",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

const FILTER_LABELS = {
  q: (v) => `"${v}"`,
  propertyType: (v) => v,
  bhk: (v) => `${v}${Number(v) >= 4 ? "+" : ""} BHK`,
  minPrice: () => null,
  maxPrice: () => null,
  furnishing: (v) => v,
  parking: () => "Parking",
  verified: () => "Verified",
  rera: () => "RERA",
  ownerOnly: () => "Owner only",
  gender: (v) => v,
  roomType: (v) => v,
  commercialCategory: (v) => v,
  possession: (v) => v,
  listingType: (v) => (v === "Rent" ? "Lease / rent" : "Buy"),
  plotType: (v) => v,
};

function chipsFor(filters, removeFilter) {
  const chips = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (key === "city" || key === "locality") {
      if (value) chips.push({ key, label: value, remove: () => removeFilter(key) });
      return;
    }
    if (key === "minPrice" || key === "maxPrice") return;
    if (value === "any" || value === "" || value === false) return;
    const label = FILTER_LABELS[key]?.(value) ?? String(value);
    if (label) chips.push({ key, label, remove: () => removeFilter(key) });
  });
  if (filters.minPrice || filters.maxPrice) {
    const label = filters.minPrice && filters.maxPrice
      ? `₹${filters.minPrice} – ₹${filters.maxPrice}`
      : filters.minPrice
      ? `₹${filters.minPrice}+`
      : `Up to ₹${filters.maxPrice}`;
    chips.push({ key: "price", label, remove: () => removeFilter("minPrice") || removeFilter("maxPrice") });
  }
  return chips;
}

// Ported from the prototype's search.html/search.js chrome (compact search
// bar, breadcrumbs, results head, filter drawer, list + map column) — the
// underlying data/filter engine is this app's existing usePropertySearch()
// hook (src/data/properties.js), not the prototype's own mock data/filters.
export function PropertySearchExperience({ categoryKey }) {
  const router = useRouter();
  const category = CATEGORIES[categoryKey] ?? CATEGORIES.buy;
  const search = usePropertySearch(category.key);
  const { requireAuth, addSavedSearch } = useSite();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("list");
  const [locInput, setLocInput] = useState(search.filters.locality || search.filters.city || "");

  const title = buildTitle(category, search.filters);

  function handleCompactSearchSubmit(e) {
    e.preventDefault();
    const typed = locInput.trim();
    if (typed) search.setFilters({ q: typed, city: "", locality: "" });
  }

  function handleLocationSelect(s) {
    search.setFilters({ city: s.cityName ?? "", locality: s.localityName ?? "", q: "" });
  }

  function handleCategoryChange(newKey) {
    router.push(newKey === "search" ? "/search" : CATEGORIES[newKey].href);
  }

  function handleSaveSearch() {
    requireAuth(
      () => {
        addSavedSearch({ label: title, category: category.key, filters: search.filters, resultCount: search.total });
        toast.success("Search saved", { description: "We'll notify you when new matches are posted." });
      },
      { title: "Save this search", description: "Sign in to get alerts when new properties match this search." }
    );
  }

  const chips = chipsFor(search.filters, search.removeFilter);

  return (
    <>
      <div className="results-top">
        <div className="container">
          <form className="compact-search" onSubmit={handleCompactSearchSubmit}>
            <div className="cs-box">
              <select className="select cs-cat" value={category.key} onChange={(e) => handleCategoryChange(e.target.value)} aria-label="Category">
                {CATEGORY_LIST.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <div className="cs-loc">
                <i className="bi bi-geo-alt" />
                <LocationAutocomplete
                  value={locInput}
                  onChange={setLocInput}
                  onSelect={handleLocationSelect}
                  placeholder="Locality, project, landmark or city"
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" style={{ height: 46 }}>
              <i className="bi bi-search" /><span className="hide-mobile">Search</span>
            </button>
            <button className="btn btn-outline btn-save-search" type="button" style={{ height: 46 }} onClick={handleSaveSearch}>
              <i className="bi bi-bookmark" /><span>Save search</span>
            </button>
          </form>
        </div>
      </div>

      <main className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <i className="bi bi-chevron-right" />
          {search.filters.city ? (
            <>
              <Link href={`${category.href}?city=${encodeURIComponent(search.filters.city)}`}>{search.filters.city}</Link>
              <i className="bi bi-chevron-right" />
              <span>{category.label}</span>
            </>
          ) : (
            <span>{category.label}</span>
          )}
        </nav>

        <div className="results-head">
          <div>
            <h1>{title}</h1>
            <div className="count">{search.total.toLocaleString("en-IN")} {category.key === "pg" ? "PGs" : "properties"}</div>
          </div>
          <div className="row sort-desktop">
            <button
              className={`btn btn-outline btn-filters hide-tablet ${search.activeFilterCount ? "is-active" : ""}`}
              type="button"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <i className="bi bi-sliders" />Filters
              {search.activeFilterCount > 0 && <span className="fb-count">{search.activeFilterCount}</span>}
            </button>
            <label className="small muted nowrap" htmlFor="sortSel">Sort</label>
            <select id="sortSel" className="select" style={{ height: 38, width: "auto", fontSize: 13.5, fontWeight: 600 }} value={search.sortKey} onChange={(e) => search.setSortKey(e.target.value)}>
              {Object.entries(SORTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <div className="seg hide-tablet" aria-label="Layout">
              <button type="button" className={view === "split" ? "is-active" : ""} title="List and map" onClick={() => setView("split")}>
                <i className="bi bi-layout-split" />Map
              </button>
              <button type="button" className={view === "list" ? "is-active" : ""} title="List only" onClick={() => setView("list")}>
                <i className="bi bi-list-ul" />List
              </button>
            </div>
          </div>
        </div>

        <div className={`results-layout ${view === "list" ? "no-map" : ""}`}>
          <section className="list-col" aria-live="polite">
            {chips.length > 0 && (
              <div className="active-chips">
                {chips.map((c) => (
                  <button key={c.key} className="chip chip-remove" onClick={c.remove}>{c.label}<i className="bi bi-x" /></button>
                ))}
                {chips.length > 1 && <button className="btn-link small" style={{ marginLeft: 4 }} onClick={search.resetFilters}>Clear all</button>}
              </div>
            )}

            {search.total === 0 ? (
              <div className="state">
                <i className="bi bi-house-slash state-ico" />
                <h3>No {category.key === "pg" ? "PGs" : "properties"} match these filters</h3>
                <p className="muted">Try removing a filter or widening your budget.</p>
                <button className="btn btn-outline" onClick={search.resetFilters}>Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="results-list">
                  {search.results.map((property) => (
                    <PropertyCard key={property.id} property={toTemplateProperty(property, categoryKey === "plots" ? "plot" : categoryKey)} layout="list" />
                  ))}
                </div>
                {search.pageCount > 1 && (
                  <div className="pagination">
                    <button disabled={search.page === 1} onClick={() => search.setPage(search.page - 1)} aria-label="Previous"><i className="bi bi-chevron-left" /></button>
                    {Array.from({ length: search.pageCount }, (_, i) => (
                      <button key={i} className={search.page === i + 1 ? "is-active" : ""} onClick={() => search.setPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button disabled={search.page === search.pageCount} onClick={() => search.setPage(search.page + 1)} aria-label="Next"><i className="bi bi-chevron-right" /></button>
                    <span className="small muted" style={{ width: "100%", textAlign: "center", marginTop: 6 }}>
                      Showing {(search.page - 1) * search.pageSize + 1}–{Math.min(search.page * search.pageSize, search.total)} of {search.total}
                    </span>
                  </div>
                )}
              </>
            )}
          </section>

          {view === "split" && (
            <div className="map-col">
              <ResultsMap properties={search.allFiltered} onFocusLocality={(locality, city) => search.setFilters({ locality, city })} />
            </div>
          )}
        </div>
      </main>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        category={category}
        filters={search.filters}
        setFilters={search.setFilters}
        resetFilters={search.resetFilters}
        activeFilterCount={search.activeFilterCount}
        resultCount={search.total}
      />

      <button className="btn btn-primary map-toggle-fab" type="button" onClick={() => setView(view === "split" ? "list" : "split")}>
        <i className={`bi ${view === "split" ? "bi-list-ul" : "bi-map"}`} /><span>{view === "split" ? "List" : "Map"}</span>
      </button>
    </>
  );
}

function buildTitle(category, filters) {
  const bhkPart = filters.bhk !== "any" ? `${filters.bhk}${Number(filters.bhk) >= 4 ? "+" : ""} BHK ` : "";
  const typePart = filters.propertyType !== "any" ? filters.propertyType : category.propertyTypes.length === 1 ? category.propertyTypes[0] : category.label;
  const wherePart = filters.locality ? `in ${filters.locality}, ${filters.city}` : filters.city ? `in ${filters.city}` : "in India";
  return `${bhkPart}${typePart} ${wherePart}`;
}
