"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";
import { SITE_VISITS } from "@/data/site-visits";
import { timeAgoLabel } from "@/lib/site/derived";
import { getCategoryKeyForProperty } from "@/lib/site/categories";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { deriveListingHealth, deriveListingExpiry, deriveLeadsForListing, daysAgoLabel } from "@/lib/site/template/dashboard-derive";
import { num } from "@/lib/site/template/format";

const STATUS_BADGE = { Active: "badge-success", Paused: "", Sold: "badge-info" };

export default function DashboardListingDetailPage() {
  const params = useParams();
  const { mounted, myListings, updateListingStatus, touchListing } = useSite();
  const [confirming, setConfirming] = useState(false);
  const [confirmingSold, setConfirmingSold] = useState(false);

  if (!mounted) return null;
  const listing = myListings.find((l) => l.id === params.id);
  if (!listing) notFound();

  const paused = listing.status === "Paused";
  const sold = listing.status === "Sold";
  const expires = deriveListingExpiry(listing);
  const health = deriveListingHealth(listing);
  const leads = deriveLeadsForListing(listing);
  const visits = SITE_VISITS.filter((v) => v.propertyTitle === listing.title);
  const p = toTemplateProperty(listing, getCategoryKeyForProperty(listing));
  const soldLabel = p.cat === "rent" || p.cat === "pg" ? "Rented" : "Sold";
  const verifBadges = [p.verif.location && "Location verified", p.verif.identity && "Identity verified", p.verif.phone && "Phone verified", p.verif.docs && "Ownership docs checked"].filter(Boolean);

  function togglePause() {
    if (paused) {
      updateListingStatus(listing.id, "Active");
      toast.success("Listing resumed");
      return;
    }
    updateListingStatus(listing.id, "Paused");
    toast.success("Listing paused");
  }

  function confirmFresh() {
    setConfirming(true);
    touchListing(listing.id);
    toast.success("Thanks — availability and price confirmed");
  }

  function markSold() {
    updateListingStatus(listing.id, "Sold");
    toast.success(`Marked as ${soldLabel.toLowerCase()} — congratulations!`);
  }

  return (
    <>
      <nav className="crumbs" style={{ display: "flex", paddingTop: 0 }}>
        <Link href="/dashboard/listings">My listings</Link>
        <i className="bi bi-chevron-right" />
        <span>{listing.title}</span>
      </nav>
      {paused && (
        <div className="banner banner-warning mb-16"><i className="bi bi-pause-circle" /><div><b>Paused.</b> Buyers can&apos;t find this listing. Resume whenever you&apos;re ready.</div></div>
      )}

      <div className="grid-2" style={{ gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 20, alignItems: "start" }}>
        <div className="stack" style={{ "--stack": "20px" }}>
          <div className="card" style={{ overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.images?.[0]} alt="" style={{ width: "100%", aspectRatio: "16/8", objectFit: "cover" }} />
            <div className="card-body">
              <div className="between" style={{ flexWrap: "wrap" }}>
                <div>
                  <div className="row-wrap" style={{ alignItems: "center" }}>
                    <h1 className="h3" style={{ fontSize: 20 }}>{listing.title}</h1>
                    <span className={`badge ${STATUS_BADGE[listing.status] ?? ""}`}>{sold ? soldLabel : listing.status}</span>
                  </div>
                  <div className="small muted mt-4">{listing.location.locality}, {listing.location.city} · Listing ID {listing.id}</div>
                </div>
                <div className="price" style={{ fontSize: 22 }}>{p.cat === "rent" || p.cat === "pg" ? `₹${num(p.rent)}/month` : `₹${num(p.price)}`}</div>
              </div>
              {verifBadges.length > 0 && (
                <div className="vlist mt-12">
                  {verifBadges.map((v) => <span key={v} className="vbadge"><i className="bi bi-patch-check-fill" />{v}</span>)}
                </div>
              )}
              <div className="mt-12"><Link className="btn-link small" href={`/property/${listing.slug}`} target="_blank"><i className="bi bi-box-arrow-up-right" /> View public listing</Link></div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><span className="h4">Leads for this listing</span><Link className="see-all small" href="/dashboard/leads">Open leads</Link></div>
            {leads.length > 0 ? leads.map((l) => (
              <div key={l.id} className="list-row">
                <span className="avatar">{l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                <div className="grow"><div className="strong small">{l.name}</div><div className="xs muted">{l.source} · {daysAgoLabel(l.daysAgo)}</div></div>
                <span className="badge badge-sm">{l.status}</span>
              </div>
            )) : (
              <div className="state" style={{ padding: 24 }}>
                <i className="bi bi-people state-ico" />
                <h3>No leads yet</h3>
                <p className="muted">Listings with more photos and a verified location get more enquiries.</p>
              </div>
            )}
          </div>
        </div>

        <div className="stack" style={{ "--stack": "20px" }}>
          <div className="card card-pad">
            <div className="grid-2" style={{ gap: 12 }}>
              <div><div className="xs muted">Views</div><div className="price" style={{ fontSize: 24 }}>{num(listing.views ?? 0)}</div></div>
              <div><div className="xs muted">Leads</div><div className="price" style={{ fontSize: 24 }}>{listing.enquiries ?? 0}</div></div>
              <div><div className="xs muted">Visits</div><div className="price" style={{ fontSize: 24 }}>{visits.length}</div></div>
              <div><div className="xs muted">Last updated</div><div className="strong" style={{ marginTop: 6 }}>{timeAgoLabel(listing.updatedAt).replace("Posted ", "")}</div></div>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />
            <div className="small">
              <div className="strong mb-8">Freshness</div>
              <div className="stack" style={{ "--stack": "6px" }}>
                <div className="between"><span className="muted">Availability confirmed</span><span>{confirming ? "today" : timeAgoLabel(listing.updatedAt).replace("Posted ", "")}</span></div>
                <div className="between"><span className="muted">Price confirmed</span><span>{confirming ? "today" : timeAgoLabel(listing.updatedAt).replace("Posted ", "")}</span></div>
                <div className="between"><span className="muted">Expires</span><span className={expires != null && expires <= 7 ? "text-warning strong" : ""}>{expires == null ? "—" : `in ${expires} days`}</span></div>
              </div>
              {!paused && !sold && (
                <button type="button" className="btn btn-outline btn-sm btn-block mt-12" onClick={confirmFresh}>
                  <i className="bi bi-check2-circle" />Confirm still available at this price
                </button>
              )}
            </div>
          </div>

          {health.length > 0 && !sold && (
            <div className="card card-pad">
              <div className="strong mb-8"><i className="bi bi-heart-pulse text-primary" /> Listing health</div>
              <ul className="stack small" style={{ "--stack": "8px" }}>
                {health.map((h) => <li key={h} className="row" style={{ alignItems: "flex-start" }}><i className="bi bi-dot" />{h}</li>)}
              </ul>
            </div>
          )}

          <div className="card card-pad">
            <div className="strong mb-12">Actions</div>
            {sold ? (
              <div className="stack" style={{ "--stack": "10px" }}>
                <p className="small muted">Marked as {soldLabel.toLowerCase()}. This listing is closed.</p>
                <Link className="btn btn-primary btn-block" href="/post-property">Post a new property</Link>
              </div>
            ) : (
              <div className="stack" style={{ "--stack": "10px" }}>
                <Link className="btn btn-primary btn-block" href="/post-property"><i className="bi bi-pencil" />Edit listing</Link>
                <button type="button" className="btn btn-outline btn-block" onClick={togglePause}>
                  <i className={`bi bi-${paused ? "play" : "pause"}-circle`} />{paused ? "Resume listing" : "Pause"}
                </button>
                <button type="button" className="btn btn-danger btn-block" onClick={() => setConfirmingSold(true)}>
                  <i className="bi bi-check2-all" />Mark {soldLabel.toLowerCase()}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmingSold && (
        <SiteModal
          title={`Mark as ${soldLabel.toLowerCase()}?`}
          size={420}
          onClose={() => setConfirmingSold(false)}
          foot={
            <>
              <button className="btn btn-outline" onClick={() => setConfirmingSold(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { markSold(); setConfirmingSold(false); }}>Mark {soldLabel.toLowerCase()}</button>
            </>
          }
        >
          <p className="muted">The listing will be closed and removed from search. This can&apos;t be undone.</p>
        </SiteModal>
      )}
    </>
  );
}
