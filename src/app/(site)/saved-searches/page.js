"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { getCategory } from "@/lib/site/categories";
import { applyFilters, getPropertiesForCategory } from "@/lib/site/site-data";
import { formatDate } from "@/lib/utils";
import { inr } from "@/lib/site/template/format";

function liveCountFor(search) {
  return applyFilters(getPropertiesForCategory(search.category), search.filters).length;
}

const ICON = { buy: "bi-house-door", rent: "bi-key", pg: "bi-people", commercial: "bi-shop", plots: "bi-bounding-box", projects: "bi-buildings" };

function buildHref(search) {
  const params = new URLSearchParams();
  Object.entries(search.filters ?? {}).forEach(([key, value]) => {
    if (value && value !== "any" && value !== false) params.set(key, value);
  });
  const category = getCategory(search.category);
  return `${category.href}?${params.toString()}`;
}

function summaryOf(search) {
  const parts = [];
  const f = search.filters ?? {};
  if (f.locality) parts.push(f.locality);
  else if (f.city) parts.push(f.city);
  if (f.minPrice || f.maxPrice) parts.push(`Budget: ${f.minPrice ? inr(Number(f.minPrice)) : "Any"}–${f.maxPrice ? inr(Number(f.maxPrice)).replace("₹", "") : "Any"}`);
  if (f.bhk && f.bhk !== "any") parts.push(`${f.bhk} BHK`);
  if (f.propertyType && f.propertyType !== "any") parts.push(f.propertyType);
  return parts;
}

export default function SavedSearchesPage() {
  const { savedSearches, mounted, removeSavedSearch, updateSavedSearchAlert, markSavedSearchSeen, auth, openAuthGate } = useSite();

  if (!mounted) return null;

  if (!auth.isAuthenticated) {
    return (
      <main className="container-narrow">
        <h1>Saved Searches</h1>
        <div className="card mt-16">
          <div className="state">
            <i className="bi bi-bookmark state-ico info" />
            <h3>Log in to see saved searches</h3>
            <p className="muted">Save a search from any results page to come back to it in one tap.</p>
            <button className="btn btn-primary" onClick={() => openAuthGate(null, { title: "Log in to see saved searches" })}>Log in with OTP</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-narrow">
      <div className="page-head">
        <h1>Saved Searches</h1>
        <p>Re-run a search in one tap. New matches since your last visit are counted.</p>
      </div>

      <div className="stack mt-24" style={{ "--stack": "12px" }}>
        {savedSearches.length === 0 ? (
          <div className="card">
            <div className="state">
              <i className="bi bi-bookmark state-ico" />
              <h3>No saved searches</h3>
              <p className="muted">On any results page, tap &ldquo;Save search&rdquo; to keep your location and filters.</p>
              <Link className="btn btn-primary" href="/buy">Search properties</Link>
            </div>
          </div>
        ) : (
          savedSearches.map((s) => {
            const liveCount = liveCountFor(s);
            const newCount = Math.max(0, liveCount - (s.resultCount ?? 0));
            return (
            <div key={s.id} className="saved-search">
              <span className="ico"><i className={`bi ${ICON[s.category] ?? "bi-search"}`} /></span>
              <div className="grow">
                <div className="row-wrap" style={{ alignItems: "center" }}>
                  <span className="strong" style={{ fontSize: 16 }}>{s.label}</span>
                  <span className="badge badge-sm">{getCategory(s.category).label}</span>
                  {newCount > 0 && <span className="badge badge-success badge-sm">{newCount} new</span>}
                </div>
                <div className="small muted mt-4">{summaryOf(s).join(" · ") || "All locations"}</div>
                <div className="xs subtle mt-4">Saved {formatDate(s.createdAt)}</div>
              </div>
              <div className="row ss-actions">
                <Link className="btn btn-primary btn-sm" href={buildHref(s)} onClick={() => markSavedSearchSeen(s.id, liveCount)}>View results</Link>
                <select
                  className="select"
                  style={{ height: 32, width: "auto", fontSize: 13 }}
                  value={s.alertFrequency}
                  onChange={(e) => updateSavedSearchAlert(s.id, e.target.value)}
                  aria-label="Alert frequency"
                  disabled
                  title="Coming soon"
                >
                  <option value="daily">Daily alerts</option>
                  <option value="weekly">Weekly alerts</option>
                  <option value="off">Alerts off</option>
                </select>
                <button
                  className="btn btn-ghost btn-sm"
                  aria-label={`Delete ${s.label}`}
                  onClick={() => {
                    removeSavedSearch(s.id);
                    toast.success("Search deleted");
                  }}
                >
                  <i className="bi bi-trash" />Delete
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>

      <div className="banner banner-info mt-24">
        <i className="bi bi-bell" />
        <div><b>Alerts for saved searches</b> — get notified about new matches on WhatsApp or email. Coming in a later release.</div>
      </div>
    </main>
  );
}
