"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProjectSearch } from "@/components/site/search/use-project-search";
import { ProjectFilterDrawer } from "@/components/site/search/project-filter-drawer";
import { ProjectCard } from "@/components/site/project/project-card";
import { LocationAutocomplete } from "@/components/site/home/location-autocomplete";
import { useSite } from "@/components/site/providers/site-provider";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/site/categories";
import { toTemplateProject } from "@/lib/site/template/project-mapper";

const SORTS = {
  newest: "Recently updated",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  possession: "Possession: soonest",
};

function chipsFor(filters, removeFilter) {
  const chips = [];
  if (filters.q) chips.push({ key: "q", label: `"${filters.q}"`, remove: () => removeFilter("q") });
  if (filters.city) chips.push({ key: "city", label: filters.city, remove: () => removeFilter("city") });
  if (filters.locality) chips.push({ key: "locality", label: filters.locality, remove: () => removeFilter("locality") });
  if (filters.status !== "any") chips.push({ key: "status", label: filters.status, remove: () => removeFilter("status") });
  if (filters.propertyType !== "any") chips.push({ key: "propertyType", label: filters.propertyType, remove: () => removeFilter("propertyType") });
  if (filters.minPrice || filters.maxPrice) {
    const label = filters.minPrice && filters.maxPrice
      ? `₹${filters.minPrice} – ₹${filters.maxPrice}`
      : filters.minPrice
      ? `₹${filters.minPrice}+`
      : `Up to ₹${filters.maxPrice}`;
    chips.push({ key: "price", label, remove: () => { removeFilter("minPrice"); removeFilter("maxPrice"); } });
  }
  if (filters.rera) chips.push({ key: "rera", label: "RERA", remove: () => removeFilter("rera") });
  return chips;
}

// Parallels property-search-experience.jsx's chrome exactly (same
// .results-top/.compact-search/.results-head/.results-layout classes) —
// projects get their own experience/hook/drawer stack because they're a
// different dataset/card/filter shape from properties, not a simplification.
export function ProjectSearchExperience() {
  const router = useRouter();
  const category = CATEGORIES.projects;
  const search = useProjectSearch();
  const { requireAuth, addSavedSearch } = useSite();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [locInput, setLocInput] = useState(search.filters.locality || search.filters.city || "");

  const title = search.filters.city ? `New Projects in ${search.filters.city}` : "New & Upcoming Projects";

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
        addSavedSearch({ label: title, category: "projects", filters: search.filters, resultCount: search.total });
        toast.success("Search saved", { description: "We'll notify you when new matches are posted." });
      },
      { title: "Save this search", description: "Sign in to get alerts when new projects match this search." }
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
                  placeholder="City, locality or project"
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
              <Link href={`/projects?city=${encodeURIComponent(search.filters.city)}`}>{search.filters.city}</Link>
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
            <div className="count">{search.total.toLocaleString("en-IN")} projects</div>
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
          </div>
        </div>

        <div className="results-layout no-map">
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
                <i className="bi bi-buildings state-ico" />
                <h3>No projects match these filters</h3>
                <p className="muted">Try removing a filter or widening your budget.</p>
                <button className="btn btn-outline" onClick={search.resetFilters}>Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="grid-3">
                  {search.results.map((project) => (
                    <ProjectCard key={project.id} project={toTemplateProject(project)} />
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
        </div>
      </main>

      <ProjectFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={search.filters}
        setFilters={search.setFilters}
        resetFilters={search.resetFilters}
        activeFilterCount={search.activeFilterCount}
        resultCount={search.total}
      />
    </>
  );
}
