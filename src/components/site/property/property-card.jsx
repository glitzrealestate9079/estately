"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { useCompareToggle } from "@/components/site/property/use-compare-toggle";
import { daysAgoText, inr, num, sellerLabel } from "@/lib/site/template/format";

function initials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function updatedText(days) {
  const rel = daysAgoText(days);
  return rel ? `Updated ${rel}` : "";
}

function priceParts(p) {
  switch (p.cat) {
    case "buy":
      return { main: inr(p.price), per: `₹${num(p.price / p.area)}/sq.ft` };
    case "rent":
      return { main: inr(p.rent), suffix: "/month", per: `Deposit ${inr(p.deposit)}` };
    case "pg":
      return { main: inr(p.rent), suffix: "/month", per: Object.keys(p.occ).length > 1 ? "onwards · per bed" : "per bed" };
    case "commercial":
      return p.txn === "rent"
        ? { main: inr(p.price), suffix: "/month", per: `₹${num(p.price / p.area)}/sq.ft/month` }
        : { main: inr(p.price), per: `₹${num(p.price / p.area)}/sq.ft` };
    case "plot":
      return { main: inr(p.price), per: `₹${num(p.price / p.orig.value)}/${p.orig.unit}` };
    default:
      return { main: inr(p.price) };
  }
}

function statusBadge(p) {
  if (p.cat === "buy") {
    return p.possession === "Ready to Move" ? (
      <span className="badge badge-success badge-sm">Ready to move</span>
    ) : (
      <span className="badge badge-warning badge-sm">Under construction</span>
    );
  }
  if (p.cat === "rent") {
    return p.available === "Immediately" ? (
      <span className="badge badge-success badge-sm">Available now</span>
    ) : (
      <span className="badge badge-info badge-sm">From {p.available.replace(" 2026", "")}</span>
    );
  }
  if (p.cat === "pg") {
    return <span className="badge badge-purple badge-sm">{p.gender === "Female" ? "Girls" : p.gender === "Male" ? "Boys" : "Co-living · All"}</span>;
  }
  if (p.cat === "commercial") {
    return <span className="badge badge-info badge-sm">For {p.txn === "rent" ? "lease" : "sale"}</span>;
  }
  if (p.cat === "plot") {
    return <span className="badge badge-sm" style={{ background: "#fff" }}>{p.plotType}</span>;
  }
  return null;
}

function Kv({ k, v, s }) {
  return (
    <div>
      <div className="k">{k}</div>
      <div className="v">{v} {s && <small>{s}</small>}</div>
    </div>
  );
}

function Feat({ ok, label }) {
  return (
    <span className={`feat ${ok ? "" : "no"}`}>
      <i className={`bi ${ok ? "bi-check-lg" : "bi-x-lg"}`} />{label}
    </span>
  );
}

function verifItems(p) {
  const items = [];
  if (p.verif.location) items.push({ key: "location", label: "Location verified" });
  if (p.verif.docs && (p.cat === "buy" || p.cat === "plot" || (p.cat === "commercial" && p.txn === "sale"))) {
    items.push({ key: "docs", label: "Ownership docs checked" });
  }
  if (p.verif.identity) items.push({ key: "identity", label: "Identity verified" });
  if (p.verif.phone) items.push({ key: "phone", label: "Phone verified" });
  return items;
}

const VSHORT = { location: "Location verified", docs: "Docs checked", identity: "ID verified", phone: "Phone verified" };

function VBadges({ p, max = 2, short = false }) {
  const items = verifItems(p).slice(0, max);
  if (!items.length) return <div className="vlist" />;
  return (
    <div className="vlist">
      {items.map((i) => (
        <span key={i.key} className="vbadge" title={i.label}>
          <i className="bi bi-patch-check-fill" />{short ? VSHORT[i.key] : i.label}
        </span>
      ))}
    </div>
  );
}

function SaveButton({ id }) {
  const { mounted, savedIds, toggleSave } = useSite();
  const router = useRouter();
  const isSaved = mounted && savedIds.includes(id);
  return (
    <button
      type="button"
      className={`save-btn ${isSaved ? "is-saved" : ""}`}
      aria-label={isSaved ? "Remove from saved" : "Save property"}
      aria-pressed={isSaved}
      onClick={(e) => {
        e.preventDefault();
        toggleSave(id);
        if (isSaved) {
          toast("Removed from saved", { action: { label: "Undo", onClick: () => toggleSave(id) } });
        } else {
          toast.success("Saved to your shortlist", { action: { label: "View saved", onClick: () => router.push("/saved") } });
        }
      }}
    >
      <i className="bi bi-heart" />
    </button>
  );
}

function CompareChip({ id }) {
  const { mounted, compareIds } = useSite();
  const handleCompareToggle = useCompareToggle();
  const checked = mounted && compareIds.includes(id);
  return (
    <label className="cmp-chip" title="Add to compare">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => handleCompareToggle(id)}
        aria-label="Compare"
      />
      <i className="bi bi-plus-lg ic-off" /><i className="bi bi-check-lg ic-on" />
      <span className="t-off">Compare</span><span className="t-on">Added</span>
    </label>
  );
}

function CardBody({ p, list }) {
  if (p.cat === "buy") {
    return list ? (
      <div className="pcard-kv">
        <Kv k={p.areaType} v={`${num(p.area)} sq.ft`} />
        <Kv k="Possession" v={p.possession === "Ready to Move" ? "Ready to move" : "Under construction"} />
        <Kv k="Furnishing" v={p.furnishing} />
      </div>
    ) : (
      <div className="pcard-facts">
        <span><i className="bi bi-arrows-angle-expand" />{num(p.area)} sq.ft</span>
        <span>{p.possession === "Ready to Move" ? "Ready to move" : "Under construction"}</span>
      </div>
    );
  }
  if (p.cat === "rent") {
    return list ? (
      <>
        <div className="pcard-kv">
          <Kv k="Furnishing" v={p.furnishing} />
          <Kv k="Parking" v={p.parking ? `${p.parking} covered` : "None"} />
          <Kv k="Available" v={p.available === "Immediately" ? "Immediately" : p.available.replace(" 2026", "")} />
        </div>
        <div className="pcard-feats">
          <span className="feat"><i className="bi bi-people" />{p.tenant}</span>
          <span className="feat"><i className="bi bi-calendar3" />{p.lease} lease</span>
        </div>
      </>
    ) : (
      <div className="pcard-facts">
        <span>{p.furnishing}</span>
        <span>{p.available === "Immediately" ? "Available now" : `From ${p.available.replace(" 2026", "")}`}</span>
      </div>
    );
  }
  if (p.cat === "pg") {
    const occEntries = Object.entries(p.occ);
    return (
      <>
        {list ? (
          <div className="pcard-feats">
            {occEntries.map(([k, v]) => (
              <span key={k} className="feat" style={{ color: "var(--ink)" }}>{k} <b style={{ marginLeft: 2 }}>{inr(v)}</b></span>
            ))}
          </div>
        ) : (
          <div className="pcard-facts">
            {occEntries.slice(0, 2).map(([k, v]) => (
              <span key={k}>{k} <b className="ink">{inr(v)}</b></span>
            ))}
          </div>
        )}
        <div className="pcard-feats">
          <Feat ok={p.food !== "No food"} label="Food" />
          <Feat ok={p.wifi} label="Wi-Fi" />
          <Feat ok={p.ac} label="AC" />
          <Feat ok={p.bath} label="Attached bath" />
        </div>
        {list && (
          <div className="small muted">
            <i className="bi bi-people" /> {p.gender === "Any" ? "Male / Female" : p.gender === "Male" ? "Male only" : "Female only"} · {p.tenantType} · {p.food}
          </div>
        )}
      </>
    );
  }
  if (p.cat === "commercial") {
    return (
      <>
        {list ? (
          <div className="pcard-kv">
            <Kv k="Area" v={`${num(p.area)} sq.ft`} />
            <Kv k="Furnishing" v={p.furnishing} />
            <Kv k="Parking" v={p.parking ? `${p.parking} spaces` : "—"} />
          </div>
        ) : (
          <div className="pcard-facts">
            <span>{num(p.area)} sq.ft</span>
            <span>{p.furnishing}</span>
          </div>
        )}
        <div className="pcard-feats">
          {p.features.slice(0, list ? 4 : 2).map((f) => (
            <span key={f} className="feat"><i className="bi bi-check-lg" />{f}</span>
          ))}
        </div>
        <div className="small muted"><i className="bi bi-train-front" /> {p.connectivity}</div>
      </>
    );
  }
  if (p.cat === "plot") {
    return (
      <>
        {list ? (
          <div className="pcard-kv">
            <Kv k="Plot area" v={<span className="unit-orig">{num(p.orig.value)} {p.orig.unit}</span>} />
            <Kv k="Facing" v={p.facing} />
            <Kv k="Road width" v={`${p.roadWidth} ft`} />
          </div>
        ) : (
          <div className="pcard-facts">
            <span><span className="unit-orig">{num(p.orig.value)} {p.orig.unit}</span></span>
          </div>
        )}
        <div className="pcard-feats">
          <span className="feat"><i className="bi bi-info-circle" style={{ color: "var(--muted)" }} />{p.approval}</span>
          {list && p.corner && <span className="feat"><i className="bi bi-check-lg" />Corner plot</span>}
          {list && p.boundary && <span className="feat"><i className="bi bi-check-lg" />Boundary wall</span>}
        </div>
      </>
    );
  }
  return null;
}

function titleFor(p) {
  if (p.cat === "buy" || p.cat === "rent") return `${p.bhk} BHK ${p.type}`;
  if (p.cat === "commercial") return p.ctype;
  return p.type ?? "";
}

// Ported from the prototype's propertyCard() in app.js — same markup/classes
// for all 5 categories (buy/rent/pg/commercial/plot), fed by
// toTemplateProperty() instead of the prototype's own mock data shape.
export function PropertyCard({ property, layout }) {
  const list = layout === "list";
  const p = property;
  const href = `/property/${p.slug}`;
  const title = titleFor(p);
  const pr = priceParts(p);
  const locLine = p.sub ? `${p.sub}, ${p.loc}, ${p.city}` : `${p.loc}, ${p.city}`;

  if (!list) {
    return (
      <article className="pcard" data-id={p.id}>
        <Link className="pcard-link" href={href} tabIndex={-1} aria-hidden="true" />
        <div className="pcard-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" src={p.images[0]} alt={`${title} in ${p.loc}`} />
          <div className="pcard-tl">{statusBadge(p)}</div>
          <SaveButton id={p.id} />
          <div className="pcard-ov">
            <div className="ov-text">
              <h3 className="pcard-title"><Link href={href}>{title}</Link></h3>
              <div className="pcard-loc"><i className="bi bi-geo-alt-fill" />{locLine}</div>
            </div>
            <span className="badge badge-dark badge-sm ov-photos"><i className="bi bi-camera" />{p.images.length}</span>
          </div>
        </div>
        <div className="pcard-body">
          <div className="seller-mini">
            <span className="avatar">{initials(p.seller.name)}</span>
            <div style={{ minWidth: 0 }}>
              <div className="nm" title={p.seller.name}>{p.seller.name}</div>
              <div className="xs">{sellerLabel(p)}</div>
            </div>
            <span className="seller-fresh" title={updatedText(p.updated)}>
              <i className="bi bi-clock" />{updatedText(p.updated).replace("Updated ", "").replace(/^./, (c) => c.toUpperCase())}
            </span>
          </div>
          <div className="pcard-price">
            <span className="price">{pr.main}</span>
            {pr.suffix && <span className="per" style={{ marginLeft: -6 }}>{pr.suffix}</span>}
            {pr.per && <span className="per">{pr.per}</span>}
          </div>
          <CardBody p={p} list={false} />
          <div className="pcard-foot"><VBadges p={p} max={2} short /></div>
          <div className="pcard-reveal">
            <Link className="btn btn-primary btn-sm" href={href}>View details<i className="bi bi-arrow-right" /></Link>
            <CompareChip id={p.id} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`pcard ${list ? "is-list" : ""}`} data-id={p.id}>
      <div className="pcard-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={p.images[0]} alt={`${title} in ${p.loc}`} />
        <div className="pcard-tl">{statusBadge(p)}</div>
        <SaveButton id={p.id} />
        <div className="pcard-bl"><span className="badge badge-dark badge-sm"><i className="bi bi-camera" />{p.images.length}</span></div>
      </div>
      <div className="pcard-body">
        <div className="pcard-top">
          <div className="pcard-head">
            <h3 className="pcard-title"><Link href={href}>{title}</Link></h3>
            <div className="pcard-loc mt-4"><i className="bi bi-geo-alt-fill" />{locLine}</div>
          </div>
          <div className="pcard-price">
            <div><span className="price">{pr.main}</span>{pr.suffix && <span className="suffix">{pr.suffix}</span>}</div>
            {pr.per && <span className="per">{pr.per}</span>}
          </div>
        </div>
        <CardBody p={p} list />
        <VBadges p={p} max={3} />
        <div className="pcard-foot">
          <div className="seller-mini">
            <span className="avatar">{initials(p.seller.name)}</span>
            <div style={{ minWidth: 0 }}>
              <div className="nm" title={p.seller.name}>{p.seller.name}</div>
              <div className="xs">{sellerLabel(p)} · {updatedText(p.updated)}</div>
            </div>
          </div>
          <div className="pcard-actions">
            <CompareToggle id={p.id} />
            <button type="button" className="btn btn-outline btn-sm"><i className="bi bi-telephone" />Contact</button>
            <Link className="btn btn-primary btn-sm" href={href}>View details<i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompareToggle({ id }) {
  const { mounted, compareIds } = useSite();
  const handleCompareToggle = useCompareToggle();
  const checked = mounted && compareIds.includes(id);
  return (
    <label className="compare-toggle">
      <input type="checkbox" checked={checked} onChange={() => handleCompareToggle(id)} />Compare
    </label>
  );
}
