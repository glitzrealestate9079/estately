"use client";

import { PG_GENDER_OPTIONS, PG_ROOM_TYPES, COMMERCIAL_CATEGORIES, POSSESSION_STATUSES, PLOT_TYPES } from "@/lib/site/derived";

const BHK_OPTIONS = [
  ["1", "1 BHK"],
  ["2", "2 BHK"],
  ["3", "3 BHK"],
  ["4", "4+ BHK"],
];

const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const LISTING_TYPE_OPTIONS = [["Rent", "Lease / rent"], ["Sale", "Buy"]];

// Ported from the prototype's filter-drawer markup/classes in search.html —
// simplified to the single-value filter fields usePropertySearch()/
// applyFilters() actually support (the prototype's much larger per-category
// "more filters" set — floor bands, facing, age, amenities-as-AND, etc. —
// isn't backed by the real data layer yet).
export function FilterDrawer({ open, onClose, category, filters, setFilters, resetFilters, activeFilterCount, resultCount }) {
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
          {category.key === "plots" ? (
            <div className="filter-group">
              <span className="label">Plot type</span>
              <div className="row-wrap">
                {PLOT_TYPES.map((t) => (
                  <Chip key={t} active={filters.plotType === t} onClick={() => single("plotType")(t)}>{t}</Chip>
                ))}
              </div>
            </div>
          ) : category.propertyTypes.length > 0 && (
            <div className="filter-group">
              <span className="label">Property type</span>
              <div className="row-wrap">
                {category.propertyTypes.map((t) => (
                  <Chip key={t} active={filters.propertyType === t} onClick={() => single("propertyType")(t)}>{t}</Chip>
                ))}
              </div>
            </div>
          )}

          {category.key === "commercial" && (
            <div className="filter-group">
              <span className="label">Looking to</span>
              <div className="row-wrap">
                {LISTING_TYPE_OPTIONS.map(([v, l]) => (
                  <Chip key={v} active={filters.listingType === v} onClick={() => single("listingType")(v)}>{l}</Chip>
                ))}
              </div>
            </div>
          )}

          {(category.key === "buy" || category.key === "rent") && (
            <div className="filter-group">
              <span className="label">BHK</span>
              <div className="row-wrap">
                {BHK_OPTIONS.map(([v, l]) => (
                  <Chip key={v} active={filters.bhk === v} onClick={() => single("bhk")(v)}>{l}</Chip>
                ))}
              </div>
            </div>
          )}

          <div className="filter-group">
            <span className="label">{category.key === "rent" || category.key === "pg" ? "Monthly budget" : "Budget"}</span>
            <div className="range-row">
              <input className="input" type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ minPrice: e.target.value })} />
              <span className="xs muted">to</span>
              <input className="input" type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ maxPrice: e.target.value })} />
            </div>
          </div>

          <div className="filter-group">
            <span className="label">Area (sq.ft)</span>
            <div className="range-row">
              <input className="input" type="number" placeholder="Min" value={filters.minArea} onChange={(e) => setFilters({ minArea: e.target.value })} />
              <span className="xs muted">to</span>
              <input className="input" type="number" placeholder="Max" value={filters.maxArea} onChange={(e) => setFilters({ maxArea: e.target.value })} />
            </div>
          </div>

          {category.key !== "pg" && (
            <div className="filter-group">
              <span className="label">Furnishing</span>
              <div className="row-wrap">
                {FURNISHING_OPTIONS.map((f) => (
                  <Chip key={f} active={filters.furnishing === f} onClick={() => single("furnishing")(f)}>{f}</Chip>
                ))}
              </div>
            </div>
          )}

          {category.key === "buy" && (
            <div className="filter-group">
              <span className="label">Possession</span>
              <div className="row-wrap">
                {POSSESSION_STATUSES.map((p) => (
                  <Chip key={p} active={filters.possession === p} onClick={() => single("possession")(p)}>{p}</Chip>
                ))}
              </div>
            </div>
          )}

          {category.key === "pg" && (
            <>
              <div className="filter-group">
                <span className="label">Available for</span>
                <div className="row-wrap">
                  {PG_GENDER_OPTIONS.map((g) => (
                    <Chip key={g} active={filters.gender === g} onClick={() => single("gender")(g)}>{g === "Any" ? "Co-living · All" : g === "Male" ? "Boys / Men" : "Girls / Women"}</Chip>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <span className="label">Room type</span>
                <div className="row-wrap">
                  {PG_ROOM_TYPES.map((r) => (
                    <Chip key={r} active={filters.roomType === r} onClick={() => single("roomType")(r)}>{r}</Chip>
                  ))}
                </div>
              </div>
            </>
          )}

          {category.key === "commercial" && (
            <div className="filter-group">
              <span className="label">Category</span>
              <div className="row-wrap">
                {COMMERCIAL_CATEGORIES.map((c) => (
                  <Chip key={c} active={filters.commercialCategory === c} onClick={() => single("commercialCategory")(c)}>{c}</Chip>
                ))}
              </div>
            </div>
          )}

          <div className="filter-group">
            <label className="switch"><input type="checkbox" checked={filters.parking} onChange={(e) => setFilters({ parking: e.target.checked })} />Parking available</label>
          </div>
          <div className="filter-group">
            <label className="switch"><input type="checkbox" checked={filters.verified} onChange={(e) => setFilters({ verified: e.target.checked })} />Verified only</label>
          </div>
          {(category.key === "buy" || category.key === "plots" || category.key === "commercial") && (
            <div className="filter-group">
              <label className="switch"><input type="checkbox" checked={filters.rera} onChange={(e) => setFilters({ rera: e.target.checked })} />RERA registered</label>
            </div>
          )}
          <div className="filter-group">
            <label className="switch"><input type="checkbox" checked={filters.ownerOnly} onChange={(e) => setFilters({ ownerOnly: e.target.checked })} />Owner listings only (no brokerage)</label>
          </div>

          <p className="xs muted mt-16"><i className="bi bi-shield-check" /> Verification filters match specific checks — not a generic &ldquo;verified&rdquo; label.</p>
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
