"use client";

import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS } from "@/lib/site/site-data";

// Same .filter-drawer chrome/classes as FilterDrawer, wired to project
// filters (project type, status, starting-price range) instead of property
// filters — see use-project-search.js for why projects get their own hook.
export function ProjectFilterDrawer({ open, onClose, filters, setFilters, resetFilters, activeFilterCount, resultCount }) {
  function Chip({ active, onClick, children }) {
    return (
      <button type="button" className="chip chip-sm" aria-pressed={active} onClick={onClick}>
        {children}
      </button>
    );
  }

  function single(key) {
    return (value) => setFilters({ [key]: filters[key] === value ? "any" : value });
  }

  return (
    <>
      <div className={`filter-backdrop ${open ? "is-open" : ""}`} onClick={onClose} />
      <aside className={`filter-drawer ${open ? "is-open" : ""}`} aria-label="Filters" aria-hidden={!open}>
        <div className="fd-head">
          <span className="h4"><i className="bi bi-sliders" />Filters</span>
          <button className="modal-x" aria-label="Close filters" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="fd-body">
          <div className="filter-group">
            <span className="label">Project type</span>
            <div className="row-wrap">
              {PROJECT_TYPE_OPTIONS.map((t) => (
                <Chip key={t} active={filters.propertyType === t} onClick={() => single("propertyType")(t)}>{t}</Chip>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="label">Status</span>
            <div className="row-wrap">
              {PROJECT_STATUS_OPTIONS.map((s) => (
                <Chip key={s} active={filters.status === s} onClick={() => single("status")(s)}>{s}</Chip>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="label">Starting price</span>
            <div className="range-row">
              <input className="input" type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ minPrice: e.target.value })} />
              <span className="xs muted">to</span>
              <input className="input" type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ maxPrice: e.target.value })} />
            </div>
          </div>

          <div className="filter-group">
            <label className="switch"><input type="checkbox" checked={filters.rera} onChange={(e) => setFilters({ rera: e.target.checked })} />RERA registration provided</label>
          </div>
        </div>
        <div className="fd-foot">
          <button className="btn btn-ghost" type="button" disabled={!activeFilterCount} onClick={resetFilters}>Clear all</button>
          <button className="btn btn-primary btn-lg" type="button" onClick={onClose}>
            {resultCount ? `Show ${resultCount.toLocaleString("en-IN")} ${resultCount === 1 ? "result" : "results"}` : "No matches — adjust filters"}
          </button>
        </div>
      </aside>
    </>
  );
}
