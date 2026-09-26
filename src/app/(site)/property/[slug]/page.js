import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/site/property/gallery";
import { EmiCalculator } from "@/components/site/property/emi-calculator";
import { NearbyTabs } from "@/components/site/property/nearby-tabs";
import { ContactActions } from "@/components/site/property/contact-actions";
import { SaveShareActions } from "@/components/site/property/save-share-actions";
import { PropertyCard } from "@/components/site/property/property-card";
import { Scroller } from "@/components/site/ui/scroller";
import { PROPERTIES } from "@/data/properties";
import { getPropertyBySlug, getRelatedProperties, getLocalityByName } from "@/lib/site/site-data";
import { deriveHighlights } from "@/lib/site/highlights";
import { getCategoryKeyForProperty } from "@/lib/site/categories";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { toTemplateLocality } from "@/lib/site/template/locality-mapper";
import { floorPlanSvg } from "@/lib/site/template/floor-plan-svg";
import { AMENITY_POOLS, AMENITY_ICONS } from "@/lib/site/amenity-pools";
import { HowVerifyLink } from "@/components/site/property/how-verify-link";
import { MobilePropertyCta } from "@/components/site/property/mobile-cta-bar";
import { daysAgoText, inr, num, sellerLabel } from "@/lib/site/template/format";

export function generateStaticParams() {
  return PROPERTIES.filter((p) => p.status === "Active").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.bedrooms ? `${property.bedrooms} BHK ` : ""}${property.type} for ${property.listingType === "Sale" ? "Sale" : "Rent"} in ${property.location.locality}, ${property.location.city}`,
    description: property.description,
  };
}

const CAT_LABEL = { buy: "Buy", rent: "Rent", pg: "PG / Co-living", commercial: "Commercial", plot: "Plots / Land" };
const CAT_ROUTE = { buy: "/buy", rent: "/rent", pg: "/pg", commercial: "/commercial", plot: "/plots" };

function titleOf(p) {
  if (p.cat === "buy" || p.cat === "rent") return `${p.bhk} BHK ${p.type}${p.cat === "rent" ? " for Rent" : ""}`;
  return p.title;
}

function fact(icon, k, v, s) {
  return { icon, k, v, s };
}

function factsFor(p) {
  switch (p.cat) {
    case "buy":
      return [
        fact("bi-arrows-angle-expand", `${p.areaType} area`, `${num(p.area)} sq.ft`),
        fact("bi-door-open", "Configuration", `${p.bhk} BHK · ${p.bathrooms} Bath`, `${p.balcony} balcon${p.balcony === 1 ? "y" : "ies"}`),
        fact("bi-building", "Floor", p.floor === 0 ? (p.totalFloors > 1 ? `Ground of ${p.totalFloors}` : "Ground") : `${p.floor} of ${p.totalFloors}`),
        fact("bi-lamp", "Furnishing", p.furnishing),
        fact("bi-calendar-check", "Possession", p.possession),
        fact("bi-compass", "Facing", p.facing),
        fact("bi-hourglass-split", "Property age", p.age),
        fact("bi-p-square", "Parking", p.parking ? `${p.parking} covered` : "Not available"),
      ];
    case "rent":
      return [
        fact("bi-cash-stack", "Monthly rent", inr(p.rent), p.maintenance ? `+ ${inr(p.maintenance)} maintenance` : "No maintenance"),
        fact("bi-safe", "Security deposit", inr(p.deposit), `${Math.round(p.deposit / p.rent)} months`),
        fact("bi-calendar-event", "Available from", p.available),
        fact("bi-lamp", "Furnishing", p.furnishing),
        fact("bi-people", "Preferred tenant", p.tenant),
        fact("bi-file-earmark-text", "Lease duration", p.lease),
        fact("bi-arrows-angle-expand", "Area", `${num(p.area)} sq.ft`, `${p.bhk} BHK · ${p.bathrooms} Bath`),
        fact("bi-building", "Floor", p.floor === 0 ? "Ground" : `${p.floor} of ${p.totalFloors}`),
      ];
    case "pg":
      return [
        fact("bi-people", "Sharing", Object.keys(p.occ).join(" / ")),
        fact("bi-gender-ambiguous", "Available for", p.gender === "Any" ? "Male & Female" : p.gender === "Male" ? "Male only" : "Female only"),
        fact("bi-mortarboard", "Tenant type", p.tenantType),
        fact("bi-egg-fried", "Food", p.food),
        fact("bi-safe", "Deposit", inr(p.deposit)),
        fact("bi-box-arrow-right", "Notice period", p.notice),
        fact("bi-stars", "Housekeeping", p.housekeeping),
        fact("bi-calendar-event", "Available from", p.available),
      ];
    case "commercial": {
      const spec = p.workstations
        ? fact("bi-pc-display", "Workspace", `${p.workstations} workstations`, `${p.cabins} cabin${p.cabins === 1 ? "" : "s"}`)
        : p.ceiling
        ? fact("bi-arrows-vertical", "Ceiling height", `${p.ceiling} ft`)
        : p.frontage
        ? fact("bi-shop-window", "Frontage", `${p.frontage} ft`)
        : fact("bi-signpost", "Access", "Highway frontage");
      return [
        fact("bi-arrows-angle-expand", "Area", `${num(p.area)} sq.ft`),
        fact("bi-tag", "Transaction", p.txn === "rent" ? "Lease / rent" : "Sale"),
        fact("bi-tools", "Fit-out", p.furnishing),
        spec,
        fact("bi-building", "Floor", p.totalFloors ? (p.floor === 0 ? `Ground of ${p.totalFloors}` : `${p.floor} of ${p.totalFloors}`) : "—"),
        fact("bi-p-square", "Parking", p.parking ? `${p.parking} spaces` : "—"),
        fact("bi-train-front", "Metro", p.metro ? `${p.metro} km` : "Not nearby"),
      ];
    }
    case "plot":
      return [
        fact("bi-bounding-box", "Plot area", `${num(p.orig.value)} ${p.orig.unit}`),
        fact("bi-rulers", "Dimensions", p.dims),
        fact("bi-compass", "Facing", p.facing),
        fact("bi-signpost-2", "Road width", `${p.roadWidth} ft`),
        fact("bi-file-earmark-check", "Approval", p.approval, "As declared by seller"),
        fact("bi-bounding-box-circles", "Corner plot", p.corner ? "Yes" : "No"),
        fact("bi-bricks", "Boundary wall", p.boundary ? "Yes" : "No"),
        fact("bi-tag", "Plot type", p.plotType),
      ];
    default:
      return [];
  }
}

function statusBadgeItems(p) {
  const items = [];
  if (p.cat === "buy") {
    items.push(
      p.possession.startsWith("Ready")
        ? { tone: "badge-success", text: "Ready to move" }
        : { tone: "badge-warning", text: `Under construction${p.possession.includes("· ") ? ` · ${p.possession.split("· ")[1]}` : ""}` }
    );
  }
  if (p.cat === "rent") {
    items.push(p.available === "Immediately" ? { tone: "badge-success", text: "Available now" } : { tone: "badge-info", text: `Available from ${p.available}` });
  }
  if (p.cat === "pg") {
    items.push({ tone: "badge-purple", text: p.gender === "Female" ? "Girls / Women" : p.gender === "Male" ? "Boys / Men" : "Co-living · All genders" });
  }
  if (p.cat === "commercial") items.push({ tone: "badge-info", text: `${p.ctype} · for ${p.txn === "rent" ? "lease" : "sale"}` });
  if (p.cat === "plot") items.push({ tone: "", text: p.plotType });
  items.push({ tone: "", text: sellerLabel(p) });
  items.push({ tone: "", text: `Updated ${daysAgoText(p.updated)}`, icon: "bi-clock-history" });
  return items;
}

// Ported from app.js's vbadges(p, 4) — location, ownership docs (sale
// listings only), identity, phone, in that priority order, capped at 4.
function verifiedBadges(p, isSale, max = 4) {
  const items = [
    p.verif.location && "Location verified",
    isSale && p.verif.docs && "Ownership docs checked",
    p.verif.identity && "Identity verified",
    p.verif.phone && "Phone verified",
  ].filter(Boolean);
  return items.slice(0, max);
}

function specRows(p) {
  if (p.cat === "commercial") {
    return [
      ["Category", p.ctype],
      ["Address", p.loc],
      ["Area", `${num(p.area)} sq.ft`],
      ["Fit-out", p.furnishing],
      ["Floor", p.totalFloors ? (p.floor === 0 ? `Ground of ${p.totalFloors}` : `${p.floor} of ${p.totalFloors}`) : "—"],
      ["Parking", p.parking ? `${p.parking} spaces` : "—"],
      ["Key features", p.features.join(", ")],
      ["Connectivity", p.connectivity],
    ];
  }
  return [
    ["Property type", p.type],
    ["Configuration", `${p.bhk} BHK, ${p.bathrooms} bathrooms, ${p.balcony} balconies`],
    [`${p.cat === "rent" ? "Area" : `${p.areaType} area`}`, `${num(p.area)} sq.ft`],
    ["Floor", p.floor === 0 ? "Ground" : `${p.floor} of ${p.totalFloors}`],
    ["Facing", p.facing],
    ["Furnishing", p.furnishing],
    ["Property age", p.age],
    ["Parking", p.parking ? `${p.parking} covered` : "None"],
    ["Maintenance", p.maintenance ? `${inr(p.maintenance)}/month` : "—"],
    ...(p.cat === "rent"
      ? [["Deposit", inr(p.deposit)], ["Lease", p.lease], ["Preferred tenant", p.tenant]]
      : [["Price per sq.ft", `₹${num(p.price / p.area)}`]]),
  ];
}

function sellerLabelFull(p) {
  const label = sellerLabel(p);
  if (label === "Owner") return "About the owner";
  if (label === "Builder") return "About the builder";
  return `About the ${label.toLowerCase()}`;
}

function highlightsFor(p, adminHighlights) {
  const h = [...adminHighlights];
  if (p.cat === "pg") {
    h.push(`${p.food} included in rent`);
    h.push(`${p.housekeeping} housekeeping`);
    if (p.laundry) h.push("Laundry service available");
    h.push(`${p.occ ? Object.keys(p.occ).length : 1}-tier sharing options`);
  }
  if (p.cat === "commercial") h.push(...p.features.slice(0, 3), p.connectivity);
  return h.slice(0, 8);
}


function priceInsight(p, locality) {
  if (!locality) return null;
  if (p.cat === "buy") {
    const pps = p.price / p.area;
    const diff = Math.round((pps / locality.avg - 1) * 100);
    return (
      <>
        <p className="mb-16">
          This {p.type.toLowerCase()} is priced at <b className="ink">₹{num(pps)}/sq.ft</b> —{" "}
          <b className={diff <= 0 ? "text-success" : "text-warning"}>{Math.abs(diff)}% {diff <= 0 ? "below" : "above"}</b> the {locality.name} average of ₹{num(locality.avg)}/sq.ft.
        </p>
        <div className="data-meta">
          <span><i className="bi bi-house" />{p.type}s in {locality.name}</span>
          <span><i className="bi bi-arrow-clockwise" />{locality.count} listings tracked</span>
        </div>
      </>
    );
  }
  if (p.cat === "rent") {
    const pos = Math.round(((p.rent - locality.rent[0]) / (locality.rent[1] - locality.rent[0])) * 100);
    return (
      <p>
        Asking rent <b className="ink">{inr(p.rent)}/month</b>. Typical rent for homes in {locality.name}: <b className="ink">{inr(locality.rent[0])} – {inr(locality.rent[1])}</b>. This
        listing sits {pos < 35 ? "in the lower" : pos > 65 ? "in the upper" : "around the middle of the"} range.
      </p>
    );
  }
  if (p.cat === "plot") {
    return <p>Asking price works out to <b className="ink">₹{num(p.price / p.orig.value)}/{p.orig.unit}</b> (≈ ₹{num(p.price / p.area)}/sq.ft). Land prices vary strongly with approval status and road access.</p>;
  }
  return null;
}

function localityInsightsBlock(locality) {
  if (!locality) return null;
  const t = locality.trend;
  const min = Math.min(...t) * 0.92;
  const max = Math.max(...t);
  const quarters = ["Q1", "Q2", "Q3", "Q4", "Q5", "Now"];
  return (
    <div className="grid-2" style={{ alignItems: "start" }}>
      <div className="stack" style={{ "--stack": "10px" }}>
        <div className="between">
          <div>
            <div className="h4">{locality.name}</div>
            <div className="small muted">{locality.zone} · {num(locality.count)} listings</div>
          </div>
          <span className="badge"><i className="bi bi-star-fill" style={{ color: "#f5a300" }} />{locality.rating} rating</span>
        </div>
        <div className="spec-list" style={{ gridTemplateColumns: "1fr" }}>
          <div><span className="k">Avg. sale price</span><span className="v">₹{num(locality.avg)}/sq.ft</span></div>
          <div><span className="k">Rent range</span><span className="v">{inr(locality.rent[0])} – {inr(locality.rent[1])}/month</span></div>
          <div><span className="k">1-year change</span><span className="v text-success">+{Math.round((t[5] / t[1] - 1) * 100)}%</span></div>
        </div>
        <Link className="see-all" href={`/locality/${locality.slug}`}>Explore {locality.name} <i className="bi bi-arrow-right" /></Link>
      </div>
      <div>
        <div className="small strong">Average sale price · ₹/sq.ft</div>
        <div className="bar-chart">
          {t.map((v, i) => (
            <div key={i} className={`bar ${i === 5 ? "is-current" : ""}`} title={`${quarters[i]}: ₹${num(v)}/sq.ft`}>
              {(i === 0 || i === 5) && <span className="val">₹{num(v)}</span>}
              <span className="b" style={{ height: `${(((v - min) / (max - min)) * 75 + 10).toFixed(0)}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const categoryKey = getCategoryKeyForProperty(property);
  const p = toTemplateProperty(property, categoryKey);
  const localityRow = getLocalityByName(property.location.city, property.location.locality);
  const locality = localityRow ? toTemplateLocality(localityRow) : null;
  const related = getRelatedProperties(property, 8).map((r) => toTemplateProperty(r, getCategoryKeyForProperty(r)));
  const adminHighlights = deriveHighlights(property);
  const highlights = highlightsFor(p, adminHighlights);
  const isSale = p.cat === "buy" || p.cat === "plot" || (p.cat === "commercial" && p.txn === "sale");
  const title = titleOf(p);
  const fullLoc = `${p.sub ? `${p.sub}, ` : ""}${p.loc}, ${p.city}`;
  const price = p.cat === "buy" || p.cat === "plot" || p.cat === "commercial" ? p.price : p.rent;
  const priceSuffix = p.cat === "rent" || p.cat === "pg" || (p.cat === "commercial" && p.txn === "rent") ? "/month" : "";
  const amenityPool = AMENITY_POOLS[p.cat] ?? AMENITY_POOLS.default;
  const showPlan = p.cat !== "pg" && p.cat !== "commercial";
  const showPriceInsight = p.cat === "buy" || p.cat === "rent" || p.cat === "plot";
  const showSpecs = p.cat === "buy" || p.cat === "rent" || p.cat === "commercial";
  const verifiedBadgeLabels = verifiedBadges(p, isSale, 2);

  return (
    <main className="container">
      <div className="between">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <i className="bi bi-chevron-right" />
          <Link href={CAT_ROUTE[p.cat]}>{CAT_LABEL[p.cat]}</Link>
          <i className="bi bi-chevron-right" />
          <span>{p.loc}</span>
        </nav>
      </div>

      <PropertyGallery images={p.images} title={title} verifiedBadges={verifiedBadgeLabels} />

      <div className="pd-layout">
        <div className="pd-main">
          <section className="pd-summary" id="overview">
            <div className="row-wrap mb-8">
              {statusBadgeItems(p).map((b) => (
                <span key={b.text} className={`badge ${b.tone}`}>{b.icon && <i className={`bi ${b.icon}`} />}{b.text}</span>
              ))}
            </div>
            <h1>{title}</h1>
            <div className="muted mt-4"><i className="bi bi-geo-alt" /> {fullLoc}</div>
            <div className="pd-price-row">
              <span className="price">{inr(price, true)}</span>
              {priceSuffix && <span className="muted" style={{ marginLeft: -10 }}>{priceSuffix}</span>}
              {p.cat === "buy" && <span className="muted">· {num(p.area)} sq.ft</span>}
            </div>
            {p.cat === "pg" && (
              <div className="row-wrap mt-12">
                {Object.entries(p.occ).map(([k, v]) => (
                  <span key={k} className="feat" style={{ fontSize: 13, padding: "6px 10px" }}>{k} sharing <b className="ink" style={{ marginLeft: 4 }}>{inr(v)}</b>/month</span>
                ))}
              </div>
            )}
            {verifiedBadges(p, isSale, 4).length > 0 && (
              <div className="mt-12 vlist">
                {verifiedBadges(p, isSale, 4).map((label) => (
                  <span key={label} className="vbadge"><i className="bi bi-patch-check-fill" />{label}</span>
                ))}
              </div>
            )}
            <SaveShareActions id={p.id} title={title} />
          </section>

          <section className="pd-section" style={{ paddingTop: 24 }}>
            <h2 className="sr-only">Key facts</h2>
            <div className="facts">
              {factsFor(p).filter((f) => f.v).map((f) => (
                <div key={f.k} className="fact">
                  <i className={`bi ${f.icon}`} />
                  <div><div className="k">{f.k}</div><div className="v">{f.v}{f.s && <small>{f.s}</small>}</div></div>
                </div>
              ))}
            </div>
          </section>

          <section className="pd-section" id="trust">
            <h2>Trust &amp; verification</h2>
            <div className="trust-grid">
              {[
                { ok: p.verif.phone, t: "Phone verified", y: "Seller's mobile number confirmed by OTP", n: "Not verified" },
                { ok: p.verif.email, t: "Email verified", y: "Email address confirmed via link", n: "Email not verified" },
                { ok: p.verif.identity, t: "Identity verified", y: `Government ID of the ${sellerLabel(p).toLowerCase()} checked by Estately`, n: "Identity not yet verified" },
                { ok: p.verif.location, t: "Location verified", y: "Map pin confirmed with geo-tagged photos from the property", n: "Location as entered by the seller", nSub: "not verified" },
                ...(isSale ? [{ ok: p.verif.docs, t: "Ownership documents", y: "Sale deed / allotment letter checked against seller identity", n: "Documents not submitted for review" }] : []),
              ].map((r) => (
                <div key={r.t} className={`trust-item ${r.ok ? "" : "is-no"}`}>
                  <span className="ti-ico"><i className={`bi ${r.ok ? "bi-check-lg" : "bi-dash-lg"}`} /></span>
                  <div><div className="t">{r.ok ? r.t : r.n}</div><div className="s">{r.ok ? r.y : (r.nSub ?? "Seller has not completed this check")}</div></div>
                </div>
              ))}
              {p.rera && (
                <div className="trust-item is-info">
                  <span className="ti-ico"><i className="bi bi-file-earmark-text" /></span>
                  <div><div className="t">RERA information</div><div className="s">Reg. no. <b className="ink">{p.rera}</b> as provided by the developer.</div></div>
                </div>
              )}
              <div className="trust-item is-info">
                <span className="ti-ico"><i className="bi bi-clock-history" /></span>
                <div><div className="t">Listing freshness</div><div className="s">Updated {daysAgoText(p.updated)} · Availability confirmed {daysAgoText(p.updated)} · Price confirmed {daysAgoText(p.updated)}</div></div>
              </div>
            </div>
            <HowVerifyLink />
          </section>

          {highlights.length > 0 && (
            <section className="pd-section">
              <h2>Highlights</h2>
              <ul className="highlight-list">
                {highlights.map((h) => (
                  <li key={h}><i className="bi bi-check-circle-fill" /><span>{h}</span></li>
                ))}
              </ul>
              <div className="mt-16">
                <div className="h4 mb-8">About this {p.cat === "pg" ? "PG" : "property"}</div>
                <p style={{ maxWidth: "70ch" }}>{p.description}</p>
              </div>
            </section>
          )}

          <section className="pd-section" id="amenities">
            <h2>Amenities</h2>
            <div className="amen-grid">
              {amenityPool.map((a) => {
                const on = p.amenities.includes(a);
                return (
                  <div key={a} className={`amen ${on ? "" : "is-off"}`} title={on ? undefined : "Not listed by seller"}>
                    <i className={`bi ${AMENITY_ICONS[a] ?? "bi-check2-circle"}`} />{a}
                  </div>
                );
              })}
            </div>
            <p className="xs muted mt-8">Greyed items were not listed by the seller.</p>
          </section>

          {showSpecs && (
            <section className="pd-section">
              <h2>Specifications</h2>
              <div className="spec-list">
                {specRows(p).map(([k, v]) => (
                  <div key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
                ))}
              </div>
            </section>
          )}

          {showPlan && (
            <section className="pd-section" id="plan">
              <h2>{p.cat === "plot" ? "Plot sketch" : "Floor plan"}</h2>
              <div className="floorplan" dangerouslySetInnerHTML={{ __html: floorPlanSvg(p) }} />
              <p className="xs muted mt-8">{p.cat === "plot" ? "Indicative sketch from the dimensions entered by the seller." : "Indicative layout. Ask the seller for the approved floor plan."}</p>
            </section>
          )}

          <section className="pd-section" id="location">
            <h2>Location</h2>
            <p className="mb-16"><i className="bi bi-geo-alt text-primary" /> {fullLoc} <span className="xs muted">· Approximate location as entered by seller</span></p>
            <div className="mini-map">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${fullLoc}`)}&z=15&output=embed`}
                title={`Map of ${fullLoc}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0, width: "100%", height: "100%" }}
              />
            </div>
            <div className="h4 mt-24 mb-8">Nearby</div>
            <NearbyTabs nearby={p.nearby} />
            <p className="xs muted mt-8">Straight-line distances, approximate.</p>
          </section>

          {locality && (
            <section className="pd-section">
              <h2>Locality insights</h2>
              {localityInsightsBlock(locality)}
            </section>
          )}

          {showPriceInsight && locality && (
            <section className="pd-section" id="price">
              <h2>Price insights</h2>
              {priceInsight(p, locality)}
            </section>
          )}

          {isSale && (
            <section className="pd-section" id="emi">
              <h2>EMI calculator</h2>
              <EmiCalculator price={p.price} />
            </section>
          )}

          <section className="pd-section" id="seller">
            <h2>{sellerLabelFull(p)}</h2>
            <div className="seller-card">
              <span className="avatar avatar-lg">{p.seller.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
              <div className="grow">
                <div className="strong" style={{ fontSize: 17 }}>{p.seller.name}</div>
                <div className="small muted">{p.seller.type} · On Estately since {p.seller.since}{p.seller.type !== "Owner" ? ` · ${p.seller.listings} active listings` : ""}</div>
                <div className="vlist mt-8">
                  {p.verif.phone && <span className="vbadge"><i className="bi bi-patch-check-fill" />Phone verified</span>}
                  {p.verif.identity ? <span className="vbadge"><i className="bi bi-patch-check-fill" />Identity verified</span> : <span className="vbadge is-pending"><i className="bi bi-dash-circle" />Identity not verified</span>}
                </div>
                <p className="small muted mt-8"><i className="bi bi-clock" /> {p.seller.responds}</p>
                <ContactActions property={property} variant="seller" />
              </div>
            </div>
          </section>

          <p className="small muted mt-16">Listing ID {p.id} · {p.views ? `${num(p.views)} views` : ""}</p>
        </div>

        <aside className="pd-aside">
          <div className="contact-card">
            <div className="price">{inr(price)}<span className="small muted" style={{ fontWeight: 600 }}>{priceSuffix}</span></div>
            <div className="seller-mini mt-16">
              <span className="avatar">{p.seller.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
              <div><div className="nm">{p.seller.name}</div><div className="xs muted">{sellerLabel(p)} · Updated {daysAgoText(p.updated)}</div></div>
            </div>
            <div className="mt-16">
              <ContactActions property={property} variant="sidebar" />
            </div>
            <p className="xs muted mt-12" style={{ textAlign: "center" }}><i className="bi bi-shield-lock" /> Never pay a token amount before visiting.</p>
          </div>
          <div className="card card-pad small">
            <div className="strong mb-8">Verification summary</div>
            {verifiedBadges(p, isSale, 10).map((label) => (
              <div key={label} className="vbadge" style={{ display: "flex", padding: "3px 0" }}><i className="bi bi-patch-check-fill" />{label}</div>
            ))}
            <div className="xs muted mt-8">Updated {daysAgoText(p.updated)}</div>
            <HowVerifyLink small />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section" id="similar">
          <div className="section-head">
            <div><h2 className="h2">Similar properties</h2><p>Nearby and in a similar price range.</p></div>
            <Link className="see-all" href={CAT_ROUTE[p.cat]}>More in {p.loc} <i className="bi bi-arrow-right" /></Link>
          </div>
          <Scroller>
            {related.map((r) => (
              <PropertyCard key={r.id} property={r} />
            ))}
          </Scroller>
        </section>
      )}

      <MobilePropertyCta property={property} />
    </main>
  );
}
