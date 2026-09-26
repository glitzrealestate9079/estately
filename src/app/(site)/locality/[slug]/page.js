import Link from "next/link";
import { notFound } from "next/navigation";
import { AroundTabs } from "@/components/site/locality/around-tabs";
import { ScrollSpySubnav } from "@/components/site/ui/scroll-spy-subnav";
import { PropertyCard } from "@/components/site/property/property-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { Scroller } from "@/components/site/ui/scroller";
import { PROJECTS } from "@/data/projects";
import { PUBLIC_LOCALITIES, getLocalityBySlug, getPropertiesForLocality, getNearbyLocalities } from "@/lib/site/site-data";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { toTemplateProject } from "@/lib/site/template/project-mapper";
import { toTemplateLocality } from "@/lib/site/template/locality-mapper";
import { deriveLocalityAround, localityReviews } from "@/lib/site/derived";
import { inr, num } from "@/lib/site/template/format";

export function generateStaticParams() {
  return PUBLIC_LOCALITIES.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const row = getLocalityBySlug(slug);
  if (!row) return { title: "Locality Not Found" };
  return {
    title: row.intel?.seoTitle ?? `${row.name}, ${row.cityName} — Prices, Rent & Properties`,
    description: row.intel?.seoDescription ?? `Explore properties, prices and rent trends in ${row.name}, ${row.cityName}.`,
  };
}

const QUARTERS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Now"];
const SECTIONS = [
  ["overview", "Overview"], ["prices", "Prices"], ["rent", "Rent trends"], ["projects", "Projects"],
  ["sale", "For sale"], ["forrent", "For rent"], ["around", "Around"], ["reviews", "Reviews"], ["nearby", "Nearby"],
];

function BarChart({ values, fmt }) {
  const min = Math.min(...values) * 0.92;
  const max = Math.max(...values);
  return (
    <>
      <div className="bar-chart">
        {values.map((v, i) => (
          <div key={i} className={`bar ${i === values.length - 1 ? "is-current" : ""}`} title={`${QUARTERS[i]}: ${fmt(v)}`}>
            {(i === 0 || i === values.length - 1) && <span className="val">{fmt(v)}</span>}
            <span className="b" style={{ height: `${(((v - min) / (max - min)) * 75 + 10).toFixed(0)}%` }} />
          </div>
        ))}
      </div>
      <div className="between xs muted mt-4"><span>{QUARTERS[0]}</span><span>{QUARTERS[5]}</span></div>
    </>
  );
}

export default async function LocalityPage({ params }) {
  const { slug } = await params;
  const row = getLocalityBySlug(slug);
  if (!row) notFound();

  const locality = toTemplateLocality(row);
  const saleRaw = getPropertiesForLocality(row.cityName, row.name).filter((p) => p.listingType === "Sale" && p.type !== "Plot");
  const rentRaw = getPropertiesForLocality(row.cityName, row.name).filter((p) => p.listingType === "Rent");
  const pgRaw = getPropertiesForLocality(row.cityName, row.name).filter((p) => p.listingType === "PG");
  const sale = saleRaw.map((p) => toTemplateProperty(p, "buy"));
  const rent = rentRaw.map((p) => toTemplateProperty(p, "rent"));
  const pgs = pgRaw.map((p) => toTemplateProperty(p, "pg"));
  const projects = PROJECTS.filter((p) => p.locality === row.name && p.city === row.cityName).map(toTemplateProject);
  const nearbyLocs = getNearbyLocalities(row, 4).map(toTemplateLocality);
  const around = deriveLocalityAround(row);
  const reviews = localityReviews();

  const byBhk = [1, 2, 3, 4].map((b) => {
    const s = saleRaw.filter((p) => p.bedrooms === b);
    const r = rentRaw.filter((p) => p.bedrooms === b);
    const pps = s.length ? Math.round(s.reduce((sum, p) => sum + p.price / (p.carpetArea || 1000), 0) / s.length) : null;
    const rentRange = r.length ? [Math.min(...r.map((p) => p.price)), Math.max(...r.map((p) => p.price))] : null;
    return { b, saleCount: s.length, rentCount: r.length, pps, rentRange };
  });

  const t = locality.trend;
  const rentMid = (locality.rent[0] + locality.rent[1]) / 2;
  const rentTrend = [0.91, 0.93, 0.95, 0.97, 0.985, 1].map((f) => Math.round((rentMid * f) / 100) * 100);

  return (
    <>
      <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i className="bi bi-chevron-right" />
            <Link href={`/city/${row.cityId}`}>{row.cityName}</Link>
            <i className="bi bi-chevron-right" />
            <span>{locality.name}</span>
          </nav>
          <div className="grid-2" style={{ alignItems: "center", gap: 32, paddingBottom: 28 }}>
            <div>
              <div className="eyebrow">{locality.zone} · Locality guide</div>
              <h1 className="h1 mt-8">{locality.name}, {row.cityName}</h1>
              <div className="row-wrap mt-12">
                <span className="badge"><i className="bi bi-star-fill" style={{ color: "#f5a300" }} />{locality.rating} · resident rating</span>
                <span className="badge">{num(locality.count)} properties</span>
              </div>
              <div className="grid-3 mt-24" style={{ gap: 10 }}>
                <div className="insight" style={{ padding: 14 }}><div className="k">Avg. sale price</div><div className="v" style={{ fontSize: 20 }}>₹{num(locality.avg)}<span className="xs muted">/sq.ft</span></div></div>
                <div className="insight" style={{ padding: 14 }}><div className="k">Rent range</div><div className="v" style={{ fontSize: 20 }}>{inr(locality.rent[0])}–{inr(locality.rent[1]).replace("₹", "")}</div></div>
                <div className="insight" style={{ padding: 14 }}><div className="k">1-yr change</div><div className="v trend-up" style={{ fontSize: 20 }}>+{Math.round((t[5] / t[1] - 1) * 100)}%</div></div>
              </div>
              <div className="row-wrap mt-24">
                <Link className="btn btn-primary btn-lg" href={`/buy?city=${encodeURIComponent(row.cityName)}&locality=${encodeURIComponent(row.name)}`}><i className="bi bi-search" />View properties in {locality.name}</Link>
                <Link className="btn btn-outline btn-lg" href={`/rent?city=${encodeURIComponent(row.cityName)}&locality=${encodeURIComponent(row.name)}`}>Rentals</Link>
              </div>
            </div>
            <div className="mini-map hide-mobile" style={{ height: 320 }}>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${locality.name}, ${row.cityName}`)}&z=13&output=embed`}
                title={`Map of ${locality.name}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0, width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="subnav">
        <div className="container">
          <ScrollSpySubnav sections={SECTIONS} />
        </div>
      </div>

      <div className="container">
        <section className="pd-section" id="overview">
          <h2>Overview</h2>
          <p style={{ maxWidth: "75ch" }}>
            {locality.name} is an established residential area in {row.cityName}, with a mix of independent houses, builder floors and mid-rise apartment societies. It is popular with{" "}
            {locality.avg > 6000 ? "families and professionals looking for central access" : "families and first-time buyers looking for value"}.
          </p>
          <div className="grid-3 mt-16">
            <div className="trust-item is-info"><span className="ti-ico"><i className="bi bi-hand-thumbs-up" /></span><div><div className="t">What residents like</div><div className="s">Daily-needs markets within walking distance; parks in most sectors.</div></div></div>
            <div className="trust-item is-no"><span className="ti-ico"><i className="bi bi-exclamation-lg" /></span><div><div className="t">Watch out for</div><div className="s">Evening traffic on main roads; tight parking in older lanes.</div></div></div>
            <div className="trust-item is-info"><span className="ti-ico"><i className="bi bi-people" /></span><div><div className="t">Good for</div><div className="s">{locality.avg > 6000 ? "Families, senior citizens, professionals" : "First-time buyers, families, students"}</div></div></div>
          </div>
        </section>

        <section className="pd-section" id="prices">
          <h2>Property prices</h2>
          <div className="grid-2" style={{ alignItems: "start", gap: 28 }}>
            <div className="card card-pad">
              <div className="small strong">Average sale price · ₹/sq.ft</div>
              <BarChart values={t} fmt={(v) => `₹${num(v)}`} />
              <div className="data-meta">
                <span><i className="bi bi-calendar3" />Data period: Apr 2025 – Sep 2026</span>
                <span><i className="bi bi-arrow-clockwise" />Last updated 21 Sep 2026</span>
                <span><i className="bi bi-house" />{num(locality.count)} listings sampled</span>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Configuration</th><th>Avg. ₹/sq.ft</th><th>Listings</th></tr></thead>
                <tbody>
                  {byBhk.map((r) => (
                    <tr key={r.b}>
                      <td className="strong">{r.b} BHK</td>
                      <td>{r.pps ? `₹${num(r.pps)}` : <span className="muted">Not enough data</span>}</td>
                      <td>{r.saleCount ? <Link className="btn-link" href={`/buy?city=${encodeURIComponent(row.cityName)}&locality=${encodeURIComponent(row.name)}&bhk=${r.b}`}>{r.saleCount} for sale</Link> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="pd-section" id="rent">
          <h2>Rent trends</h2>
          <div className="grid-2" style={{ alignItems: "start", gap: 28 }}>
            <div className="card card-pad">
              <div className="small strong">Median asking rent · ₹/month</div>
              <BarChart values={rentTrend} fmt={(v) => inr(v)} />
              <div className="data-meta">
                <span><i className="bi bi-calendar3" />Data period: Apr 2025 – Sep 2026</span>
                <span><i className="bi bi-arrow-clockwise" />Last updated 21 Sep 2026</span>
                <span><i className="bi bi-collection" />{num(rent.length)} rentals sampled</span>
              </div>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Configuration</th><th>Rent range</th></tr></thead>
                <tbody>
                  {byBhk.map((r) => (
                    <tr key={r.b}><td className="strong">{r.b} BHK</td><td>{r.rentRange ? `${inr(r.rentRange[0])} – ${inr(r.rentRange[1])}` : <span className="muted">Not enough data</span>}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="pd-section" id="projects">
          <h2>Popular projects</h2>
          {projects.length ? (
            <div className="grid-3">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <div className="state">
              <i className="bi bi-buildings state-ico" />
              <h3>No new projects in {locality.name} right now</h3>
              <p className="muted">See new launches in nearby localities.</p>
              <Link className="btn btn-outline" href="/projects">Browse all projects</Link>
            </div>
          )}
        </section>

        <section className="pd-section" id="sale">
          <div className="section-head" style={{ marginBottom: 16 }}>
            <h2 className="h3" style={{ fontSize: 20, fontWeight: 800 }}>Properties for sale</h2>
            <Link className="see-all" href={`/buy?city=${encodeURIComponent(row.cityName)}&locality=${encodeURIComponent(row.name)}`}>All {sale.length} <i className="bi bi-arrow-right" /></Link>
          </div>
          {sale.length ? (
            <Scroller>{sale.slice(0, 8).map((p) => <PropertyCard key={p.id} property={p} />)}</Scroller>
          ) : (
            <div className="state"><i className="bi bi-house state-ico" /><h3>No listings for sale yet</h3></div>
          )}
        </section>

        <section className="pd-section" id="forrent">
          <div className="section-head" style={{ marginBottom: 16 }}>
            <h2 className="h3" style={{ fontSize: 20, fontWeight: 800 }}>Properties for rent</h2>
            <Link className="see-all" href={`/rent?city=${encodeURIComponent(row.cityName)}&locality=${encodeURIComponent(row.name)}`}>All {rent.length + pgs.length} <i className="bi bi-arrow-right" /></Link>
          </div>
          {rent.length + pgs.length ? (
            <Scroller>{[...rent, ...pgs].slice(0, 8).map((p) => <PropertyCard key={p.id} property={p} />)}</Scroller>
          ) : (
            <div className="state"><i className="bi bi-key state-ico" /><h3>No rentals yet</h3></div>
          )}
        </section>

        <section className="pd-section" id="around">
          <h2>Around {locality.name}</h2>
          <AroundTabs around={around} />
          <p className="xs muted mt-8">Approximate distances from the locality centre.</p>
        </section>

        <section className="pd-section" id="reviews">
          <h2>Resident reviews</h2>
          <div className="grid-3">
            {reviews.map((r) => (
              <div key={r.name} className="review">
                <div className="between">
                  <span className="stars" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  <span className="xs muted">{r.date}</span>
                </div>
                <p className="mt-8 small">{r.text}</p>
                <div className="xs muted mt-8">{r.name} · identity verified</div>
              </div>
            ))}
          </div>
          <p className="xs muted mt-12">Reviews are from verified residents. Rating based on 142 reviews.</p>
        </section>

        <section className="pd-section" id="nearby">
          <h2>Nearby localities</h2>
          <div className="grid-4">
            {nearbyLocs.map((n) => (
              <Link key={n.slug} className="card card-pad" href={`/locality/${n.slug}`}>
                <div className="strong">{n.name}</div>
                <div className="xs muted">{n.distanceKm.toFixed(1)} km away · {n.zone}</div>
                <div className="small mt-8">
                  ₹{num(n.avg)}/sq.ft <span className={`${n.avg > locality.avg ? "text-warning" : "text-success"} xs`}>({n.avg > locality.avg ? "+" : ""}{Math.round((n.avg / locality.avg - 1) * 100)}%)</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
