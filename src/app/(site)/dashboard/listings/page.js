"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { timeAgoLabel } from "@/lib/site/derived";
import { formatPrice, formatIndianCurrency } from "@/lib/site/format";
import { deriveListingHealth, deriveListingExpiry } from "@/lib/site/template/dashboard-derive";
import { num } from "@/lib/site/template/format";

// Only the statuses this app's post-property flow can actually produce
// (Active / Paused) get their own tab — the prototype's Pending / Expired /
// Sold-Rented states aren't reachable here, so those tabs are dropped
// rather than shown permanently empty.
const TABS = ["All", "Active", "Paused"];
const STATUS_BADGE = { Active: "badge-success", Paused: "", Sold: "badge-info" };

function statusLabel(listing) {
  if (listing.status !== "Sold") return listing.status;
  return listing.listingType === "Rent" || listing.listingType === "PG" ? "Rented" : "Sold";
}

function healthText(listing) {
  const expires = deriveListingExpiry(listing);
  const health = deriveListingHealth(listing);
  if (listing.status === "Sold") {
    return <span className="health muted"><i className="bi bi-check2-all" />Closed</span>;
  }
  if (listing.status === "Active" && expires != null && expires <= 7) {
    return <span className="health text-warning"><i className="bi bi-exclamation-triangle-fill" />Expires in {expires} days</span>;
  }
  if (listing.status === "Active" && health.length) {
    return <span className="health text-warning"><i className="bi bi-lightbulb-fill" />{health[0]}</span>;
  }
  if (listing.status === "Active") {
    return <span className="health text-success"><i className="bi bi-check-circle-fill" />Healthy · visible in search</span>;
  }
  return <span className="health muted"><i className="bi bi-pause-circle-fill" />Paused — hidden from search</span>;
}

export default function DashboardListingsPage() {
  const { mounted, myListings, myProjects, updateListingStatus } = useSite();
  const [tab, setTab] = useState("All");

  if (!mounted) return null;

  const count = (t) => (t === "All" ? myListings.length : myListings.filter((l) => l.status === t).length);
  const list = myListings.filter((l) => tab === "All" || l.status === tab);

  function toggleStatus(listing) {
    const next = listing.status === "Active" ? "Paused" : "Active";
    updateListingStatus(listing.id, next);
    toast.success(next === "Active" ? "Listing activated — visible in search again" : "Listing paused");
  }

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>My Listings</h1>
          <p className="muted mt-4">Keep listings fresh — confirm price and availability every 30 days.</p>
        </div>
        <Link className="btn btn-outline" href="/post-property"><i className="bi bi-plus-lg" />Post property</Link>
      </div>

      <div className="tabs mb-16" role="tablist">
        {TABS.map((t) => (
          <button key={t} type="button" className={`tab ${t === tab ? "is-active" : ""}`} role="tab" aria-selected={t === tab} onClick={() => setTab(t)}>
            {t}<span className="count">{count(t)}</span>
          </button>
        ))}
      </div>

      <div className="stack" style={{ "--stack": "12px" }}>
        {list.length === 0 && (
          <div className="card">
            <div className="state">
              <i className="bi bi-card-list state-ico" />
              <h3>No {tab.toLowerCase()} listings</h3>
              <p className="muted">Listings in this state will appear here.</p>
              <Link className="btn btn-primary" href="/post-property">Post a property</Link>
            </div>
          </div>
        )}
        {list.map((l) => (
          <div key={l.id} className="listing-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.images?.[0]} alt="" />
            <div style={{ minWidth: 0 }}>
              <div className="row-wrap" style={{ alignItems: "center" }}>
                <Link className="strong" href={`/dashboard/listings/${l.id}`}>{l.title}</Link>
                <span className={`badge badge-sm ${STATUS_BADGE[l.status] ?? ""}`}>{statusLabel(l)}</span>
              </div>
              <div className="small muted mt-4">{l.location.locality}, {l.location.city} · {formatPrice(l)} · {l.id}</div>
              {healthText(l)}
              <div className="lr-mobile-stats small muted mt-4" style={{ display: "none", gap: 12 }}>
                <span><i className="bi bi-eye" /> {num(l.views ?? 0)}</span>
                <span><i className="bi bi-people" /> {l.enquiries ?? 0} leads</span>
                <span>{timeAgoLabel(l.updatedAt).replace("Posted ", "")}</span>
              </div>
            </div>
            <div className="stat views"><div className="k">Views</div><div className="v">{num(l.views ?? 0)}</div></div>
            <div className="stat"><div className="k">Leads</div><div className="v">{l.enquiries ?? 0}</div></div>
            <div className="stat"><div className="k">Updated</div><div className="v" style={{ fontSize: 13, fontFamily: "var(--font-body)" }}>{timeAgoLabel(l.updatedAt).replace("Posted ", "")}</div></div>
            <div className="lr-actions row">
              {l.status !== "Sold" && <Link className="btn btn-outline btn-sm" href="/post-property"><i className="bi bi-pencil" />Edit</Link>}
              {l.status !== "Sold" && (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleStatus(l)}>
                  <i className={`bi ${l.status === "Active" ? "bi-pause" : "bi-play"}`} />{l.status === "Active" ? "Pause" : "Activate"}
                </button>
              )}
              <Link className="btn btn-ghost btn-sm" href={`/dashboard/listings/${l.id}`}>Manage</Link>
            </div>
          </div>
        ))}
      </div>

      {myProjects.length > 0 && (
        <div className="mt-24">
          <h2 className="h4 mb-12">My Projects</h2>
          <div className="stack" style={{ "--stack": "12px" }}>
            {myProjects.map((p) => (
              <div key={p.id} className="listing-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images?.[0]} alt="" />
                <div style={{ minWidth: 0 }}>
                  <div className="row-wrap" style={{ alignItems: "center" }}>
                    <span className="strong">{p.projectName}</span>
                    <span className="badge badge-sm">{p.status}</span>
                  </div>
                  <div className="small muted mt-4">{p.locality}, {p.city} · {formatIndianCurrency(p.startingPrice)} onwards · {p.id}</div>
                </div>
                <div className="stat"><div className="k">Units</div><div className="v">{p.totalUnits ?? "—"}</div></div>
                <div className="stat"><div className="k">Towers</div><div className="v">{p.towers ?? "—"}</div></div>
                <div className="stat"><div className="k">Updated</div><div className="v" style={{ fontSize: 13, fontFamily: "var(--font-body)" }}>{timeAgoLabel(p.createdAt).replace("Posted ", "")}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
