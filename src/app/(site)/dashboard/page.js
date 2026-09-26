"use client";

import Link from "next/link";
import { useSite } from "@/components/site/providers/site-provider";
import { SITE_VISITS } from "@/data/site-visits";
import { formatPrice } from "@/lib/site/format";
import { timeAgoLabel } from "@/lib/site/derived";
import { deriveListingHealth, deriveListingExpiry, deriveLeadsForListing, daysAgoLabel } from "@/lib/site/template/dashboard-derive";
import { num } from "@/lib/site/template/format";

const STATUS_BADGE = { Active: "badge-success", Pending: "badge-warning", Expired: "badge-danger", Paused: "", Sold: "badge-info" };
const VISIT_BADGE = { Confirmed: "badge-success", Requested: "badge-warning" };
const VISIT_STATUS_LABEL = { Requested: "Pending" };

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function listingHealthText(listing) {
  const expires = deriveListingExpiry(listing);
  const health = deriveListingHealth(listing);
  if (listing.status === "Active" && expires != null && expires <= 7) {
    return <span className="health text-warning"><i className="bi bi-exclamation-triangle-fill" />Expires in {expires} days</span>;
  }
  if (listing.status === "Active" && health.length) {
    return <span className="health text-warning"><i className="bi bi-lightbulb-fill" />{health[0]}</span>;
  }
  if (listing.status === "Active") {
    return <span className="health text-success"><i className="bi bi-check-circle-fill" />Healthy · visible in search</span>;
  }
  if (listing.status === "Pending") {
    return <span className="health muted"><i className="bi bi-hourglass-split" />Under review</span>;
  }
  return <span className="health muted"><i className="bi bi-pause-circle-fill" />Paused — hidden from search</span>;
}

export default function DashboardOverviewPage() {
  const { mounted, auth, myListings } = useSite();
  if (!mounted) return null;

  const active = myListings.filter((l) => l.status === "Active");
  const leads = myListings.flatMap(deriveLeadsForListing);
  const newLeads = leads.filter((l) => l.status === "New");
  const myListingTitles = new Set(myListings.map((l) => l.title));
  const upcoming = SITE_VISITS.filter((v) => myListingTitles.has(v.propertyTitle) && ["Confirmed", "Requested"].includes(v.status))
    .sort((a, b) => a.date.localeCompare(b.date));
  const pendingVisits = upcoming.filter((v) => v.status === "Requested");

  const attn = [
    ...myListings
      .filter((l) => l.status === "Active" && deriveListingExpiry(l) <= 7)
      .map((l) => ({
        icon: "bi-hourglass-bottom", tone: "warning",
        t: `${l.title} expires in ${deriveListingExpiry(l)} days`, s: "Renew to keep it visible in search.",
        action: <Link className="btn btn-primary btn-sm" href="/dashboard/listings">Renew</Link>,
      })),
    ...(newLeads.length
      ? [{ icon: "bi-person-plus", tone: "info", t: `${newLeads.length} new lead${newLeads.length === 1 ? "" : "s"} waiting`, s: "Buyers who hear back within a few hours are more likely to visit.", action: <Link className="btn btn-primary btn-sm" href="/dashboard/leads">Respond</Link> }]
      : []),
    ...(pendingVisits.length
      ? [{
          icon: "bi-calendar-event", tone: "warning",
          t: `${pendingVisits.length} visit request${pendingVisits.length === 1 ? "" : "s"} to confirm`,
          s: pendingVisits.map((v) => `${v.buyerName} · ${new Date(v.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}`).join(", "),
          action: <Link className="btn btn-outline btn-sm" href="/dashboard/visits">Review</Link>,
        }]
      : []),
    ...myListings
      .filter((l) => l.status === "Active" && deriveListingHealth(l).length && deriveListingExpiry(l) > 7)
      .map((l) => ({
        icon: "bi-lightbulb", tone: "",
        t: `Improve ${l.title}`, s: deriveListingHealth(l).join(" · "),
        action: <Link className="btn btn-outline btn-sm" href={`/dashboard/listings/${l.id}`}>Fix</Link>,
      })),
  ];
  const toneStyle = { warning: { background: "var(--warning-50)", color: "var(--warning)" }, info: { background: "var(--info-50)", color: "var(--primary)" }, "": { background: "var(--surface-2)", color: "var(--muted)" } };

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>{greeting()}, {auth.user.name.split(" ")[0]}</h1>
          <p className="muted mt-4">{attn.length ? `${attn.length} thing${attn.length === 1 ? "" : "s"} need${attn.length === 1 ? "s" : ""} your attention today.` : "You're all caught up."}</p>
        </div>
        <Link className="btn btn-outline" href="/post-property"><i className="bi bi-plus-lg" />Post property</Link>
      </div>

      <div className="kpi-grid">
        <Link className="kpi" href="/dashboard/listings"><span className="k"><i className="bi bi-card-list" />Active listings</span><span className="v">{active.length}</span><span className="a">Manage listings <i className="bi bi-arrow-right" /></span></Link>
        <Link className="kpi" href="/dashboard/leads"><span className="k"><i className="bi bi-people" />New leads</span><span className="v">{newLeads.length}</span><span className="a">Respond to leads <i className="bi bi-arrow-right" /></span></Link>
        <Link className="kpi" href="/dashboard/visits"><span className="k"><i className="bi bi-calendar-check" />Upcoming visits</span><span className="v">{upcoming.length}</span><span className="a">View schedule <i className="bi bi-arrow-right" /></span></Link>
      </div>

      {attn.length > 0 && (
        <div className="card mt-24">
          <div className="card-head"><span className="h4">Needs attention</span></div>
          {attn.map((a, i) => (
            <div key={i} className="attn-item">
              <span className="ai" style={toneStyle[a.tone]}><i className={`bi ${a.icon}`} /></span>
              <div className="grow"><div className="strong small">{a.t}</div><div className="xs muted">{a.s}</div></div>
              {a.action}
            </div>
          ))}
        </div>
      )}

      <div className="grid-2 mt-24" style={{ alignItems: "start", gap: 20 }}>
        <div className="card">
          <div className="card-head"><span className="h4">Your listings</span><Link className="see-all small" href="/dashboard/listings">All {myListings.length} <i className="bi bi-arrow-right" /></Link></div>
          {myListings.filter((l) => l.status !== "Sold").slice(0, 4).map((l) => (
            <Link key={l.id} className="list-row" href={`/dashboard/listings/${l.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.images?.[0]} alt="" />
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="between">
                  <span className="strong small" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</span>
                  <span className={`badge badge-sm ${STATUS_BADGE[l.status] ?? ""}`}>{l.status}</span>
                </div>
                <div className="meta">
                  <span><i className="bi bi-eye" />{num(l.views ?? 0)}</span>
                  <span><i className="bi bi-people" />{l.enquiries ?? 0} leads</span>
                  <span>{timeAgoLabel(l.updatedAt)}</span>
                </div>
                {listingHealthText(l)}
              </div>
            </Link>
          ))}
          {myListings.length === 0 && <p className="small muted" style={{ padding: 16 }}>No listings yet — <Link className="btn-link" href="/post-property">post your first property</Link>.</p>}
        </div>
        <div className="stack" style={{ "--stack": "20px" }}>
          <div className="card">
            <div className="card-head"><span className="h4">Recent leads</span><Link className="see-all small" href="/dashboard/leads">All leads <i className="bi bi-arrow-right" /></Link></div>
            {leads.slice(0, 4).map((l) => (
              <div key={l.id} className="list-row">
                <span className="avatar">{l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="between"><span className="strong small">{l.name}</span><span className="xs muted">{daysAgoLabel(l.daysAgo)}</span></div>
                  <div className="xs muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.listingTitle} · via {l.source}</div>
                </div>
                {l.status === "New" && <span className="badge badge-sm badge-info">New</span>}
                <a className="btn btn-outline btn-sm btn-icon" href={`tel:${l.phone.replace(/\s/g, "")}`} aria-label={`Call ${l.name}`}><i className="bi bi-telephone" /></a>
              </div>
            ))}
            {leads.length === 0 && <p className="small muted" style={{ padding: 16 }}>No leads yet.</p>}
          </div>
          <div className="card">
            <div className="card-head"><span className="h4">Upcoming visits</span><Link className="see-all small" href="/dashboard/visits">Schedule <i className="bi bi-arrow-right" /></Link></div>
            {upcoming.length > 0 ? upcoming.slice(0, 3).map((v) => {
              const dt = new Date(v.date);
              return (
                <div key={v.id} className="list-row">
                  <div className="date-block" style={{ width: 52, flexShrink: 0 }}>
                    <div className="m">{dt.toLocaleDateString("en-IN", { month: "short" })}</div>
                    <div className="d" style={{ fontSize: 19 }}>{dt.getDate()}</div>
                    <div className="w">{dt.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                  </div>
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="strong small">{v.buyerName}</div>
                    <div className="xs muted">{v.time} · {v.propertyTitle}</div>
                  </div>
                  <span className={`badge badge-sm ${VISIT_BADGE[v.status] ?? ""}`}>{VISIT_STATUS_LABEL[v.status] ?? v.status}</span>
                </div>
              );
            }) : (
              <div className="state" style={{ padding: 24 }}><i className="bi bi-calendar state-ico" /><h3>No upcoming visits</h3></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
