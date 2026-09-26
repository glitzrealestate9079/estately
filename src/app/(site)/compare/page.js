"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";
import { PROPERTIES } from "@/data/properties";
import { getCategory, getCategoryKeyForProperty } from "@/lib/site/categories";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { daysAgoText, inr, num, sellerLabel } from "@/lib/site/template/format";

const ROWS = ["Price", "Area", "BHK", "Price / sq.ft", "Possession", "Furnishing", "Parking", "Amenities", "RERA", "Seller type", "Location", "Verification", "Last updated"];
const ROW_ICON = {
  Price: "bi-currency-rupee", Area: "bi-aspect-ratio", BHK: "bi-house-door", "Price / sq.ft": "bi-calculator", Possession: "bi-calendar-check",
  Furnishing: "bi-lamp", Parking: "bi-p-square", Amenities: "bi-stars", RERA: "bi-shield-check", "Seller type": "bi-person-badge",
  Location: "bi-geo-alt", Verification: "bi-patch-check", "Last updated": "bi-clock-history",
};

function origAreaMain(p) {
  return `${num(p.orig.value)} ${p.orig.unit}`;
}

function valueFor(p, row) {
  switch (row) {
    case "Price":
      return p.cat === "rent" || p.cat === "pg" ? `${inr(p.rent)}/month` : inr(p.price);
    case "Area":
      return p.cat === "plot" ? origAreaMain(p) : `${num(p.area)} sq.ft`;
    case "BHK":
      return p.bhk ? `${p.bhk} BHK` : p.cat === "pg" ? `${Object.keys(p.occ).join(" / ")} sharing` : "—";
    case "Price / sq.ft":
      return p.cat === "buy" || p.cat === "plot" || (p.cat === "commercial" && p.txn === "sale") ? `₹${num(p.price / p.area)}` : "—";
    case "Possession":
      return p.cat === "rent" || p.cat === "pg" ? `Available ${p.available === "Immediately" ? "now" : `from ${p.available}`}` : p.possession;
    case "Furnishing":
      return p.furnishing || "—";
    case "Parking":
      return p.cat === "pg" ? "Not modelled" : p.parking ? `${p.parking} ${p.cat === "commercial" ? "spaces" : "covered"}` : "None";
    case "Amenities": {
      const list = p.amenities ?? p.features ?? [];
      return list.slice(0, 6).join(", ") + (list.length > 6 ? ` +${list.length - 6}` : "");
    }
    case "RERA":
      return p.rera || "Not applicable";
    case "Seller type":
      return sellerLabel(p);
    case "Location":
      return `${p.sub ? `${p.sub}, ` : ""}${p.loc}`;
    case "Verification":
      return [p.verif.phone && "Phone verified", p.verif.identity && "Identity verified", p.verif.location && "Location verified"].filter(Boolean).join(", ") || "—";
    case "Last updated":
      return daysAgoText(p.updated);
    default:
      return "—";
  }
}

function Cell({ p, row, value }) {
  if (!value || value === "—") return <span className="cmp-na">—</span>;
  if (row === "Price") return <span className="cmp-price">{value}</span>;
  if (row === "Amenities") {
    const list = p.amenities ?? p.features ?? [];
    return (
      <div className="cmp-tags">
        {list.slice(0, 6).map((a) => <span key={a}>{a}</span>)}
        {list.length > 6 && <span className="more">+{list.length - 6}</span>}
      </div>
    );
  }
  if (row === "Verification") {
    const items = [p.verif.phone && "Phone verified", p.verif.identity && "Identity verified", p.verif.location && "Location verified"].filter(Boolean);
    return <div className="cmp-verif">{items.map((i) => <span key={i}><i className="bi bi-patch-check-fill" />{i}</span>)}</div>;
  }
  if (row === "RERA" && /^[A-Z]+\//.test(value)) return <span className="cmp-rera"><i className="bi bi-shield-check" />{value}</span>;
  return value;
}

function titleFor(p) {
  return p.cat === "buy" || p.cat === "rent" ? `${p.bhk} BHK ${p.type}` : p.title;
}

export default function ComparePage() {
  const { mounted, compareIds, toggleCompare, clearCompare, requireAuth } = useSite();
  const [onlyDiff, setOnlyDiff] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [contactFor, setContactFor] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!mounted) return null;

  const items = compareIds
    .map((id) => PROPERTIES.find((p) => p.id === id))
    .filter(Boolean)
    .map((raw) => toTemplateProperty(raw, getCategoryKeyForProperty(raw)));

  const visibleRows = ROWS.filter((row) => {
    if (!onlyDiff) return true;
    const values = items.map((p) => valueFor(p, row));
    return !values.every((v) => v === values[0]);
  }).length;

  function handleRemove(id) {
    toggleCompare(id);
    toast("Removed from compare", { action: { label: "Undo", onClick: () => toggleCompare(id) } });
  }

  function openContact(p) {
    requireAuth(() => {
      setMessage(`I'm interested in this ${titleFor(p)}. Is it still available?`);
      setContactFor(p);
    }, { title: "Contact the seller", description: "Sign in so the seller can reach you back." });
  }

  async function sendEnquiry() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setContactFor(null);
    toast.success("Enquiry sent!", { description: `${contactFor.seller.name} will get back to you soon.` });
  }

  const addHref = items[0] ? getCategory(items[0].cat === "plot" ? "plots" : items[0].cat).href : "/buy";

  return (
    <main className="container">
      <div className="page-head between" style={{ flexWrap: "wrap" }}>
        <div>
          <h1>Compare properties</h1>
          <p>{items.length ? `${items.length} of 4 selected. Differences are highlighted — the choice is yours.` : "Add up to 4 properties to see them side by side."}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card mt-16">
          <div className="state">
            <i className="bi bi-layout-three-columns state-ico" />
            <h3>Nothing to compare yet</h3>
            <p className="muted">Tick &ldquo;Compare&rdquo; on any property card. You can compare up to 4 at a time.</p>
            <div className="row-wrap" style={{ justifyContent: "center" }}>
              <Link className="btn btn-primary" href="/buy">Browse properties</Link>
              <Link className="btn btn-outline" href="/saved">From saved</Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          {items.some((p) => p.cat !== items[0].cat) && (
            <div className="banner banner-info mt-16"><i className="bi bi-info-circle" /><div>You&apos;re comparing different property types. Some rows won&apos;t apply to every property.</div></div>
          )}
          <div className="cmp-wrap mt-16">
            <div className="cmp-bar">
              <span className="cc-ic"><i className="bi bi-layout-three-columns" /></span>
              <div>
                <div className="cc-t">Comparing {items.length} {items.length === 1 ? "property" : "properties"}</div>
                <div className="cc-s">{visibleRows} of {ROWS.length} details shown</div>
              </div>
              <div className="cmp-legend"><span className="legend-dot" />Differs between properties</div>
              <div className="cmp-bar-actions">
                {items.length > 1 && (
                  <label className="switch"><input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} />Show only differences</label>
                )}
                <button className="btn btn-outline btn-sm" onClick={() => setConfirmClear(true)}><i className="bi bi-trash" />Clear all</button>
              </div>
            </div>
            <div className="cmp-scroll">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="cmp-corner">
                      {items.length < 4 ? (
                        <Link className="compare-add" href={addHref}>
                          <span className="ca-ic"><i className="bi bi-plus-lg" /></span>
                          <b>Add a property</b>
                          <span className="xs">{4 - items.length} more slot{4 - items.length === 1 ? "" : "s"} left</span>
                        </Link>
                      ) : (
                        <div className="compare-add is-full">
                          <span className="ca-ic"><i className="bi bi-check2-all" /></span>
                          <b>Compare list full</b>
                          <span className="xs">Remove one to add another</span>
                        </div>
                      )}
                    </th>
                    {items.map((p) => (
                      <th key={p.id}>
                        <div className="compare-col-head">
                          <div className="cch-media">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.images[0]} alt="" />
                            <span className="cch-cat">{sellerLabel(p)}</span>
                            <button className="cch-rm" aria-label="Remove from compare" title="Remove" onClick={() => handleRemove(p.id)}><i className="bi bi-x-lg" /></button>
                          </div>
                          <Link className="cch-title" href={`/property/${p.slug}`}>{titleFor(p)}</Link>
                          <span className="cch-loc"><i className="bi bi-geo-alt-fill" />{p.loc} · {p.id}</span>
                          <div className="cch-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openContact(p)}><i className="bi bi-telephone" />Contact</button>
                            <Link className="btn btn-primary btn-sm" href={`/property/${p.slug}`}>View<i className="bi bi-arrow-right" /></Link>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => {
                    const values = items.map((p) => valueFor(p, row));
                    const same = values.every((v) => v === values[0]);
                    if (onlyDiff && same) return null;
                    return (
                      <tr key={row} className={same ? "is-same" : "is-diff"}>
                        <th scope="row"><i className={`bi ${ROW_ICON[row]}`} />{row}</th>
                        {items.map((p, i) => (
                          <td key={p.id}><Cell p={p} row={row} value={values[i]} /></td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="xs muted mt-16"><i className="bi bi-info-circle" /> Values are as provided by sellers and developers. Estately does not rank properties.</p>
        </>
      )}

      {confirmClear && (
        <SiteModal
          title="Clear compare list?"
          size={420}
          onClose={() => setConfirmClear(false)}
          foot={
            <>
              <button className="btn btn-outline" onClick={() => setConfirmClear(false)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  clearCompare();
                  setConfirmClear(false);
                  toast.success("Compare list cleared");
                }}
              >
                Clear all
              </button>
            </>
          }
        >
          <p className="muted">All properties will be removed from compare.</p>
        </SiteModal>
      )}

      {contactFor && (
        <SiteModal title="Contact seller" onClose={() => setContactFor(null)}>
          <div className="field">
            <label className="label" htmlFor="cmp-enq-msg">Message</label>
            <textarea id="cmp-enq-msg" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className={`btn btn-primary btn-lg btn-block mt-16 ${sending ? "is-loading" : ""}`} onClick={sendEnquiry}>Send enquiry</button>
        </SiteModal>
      )}
    </main>
  );
}
