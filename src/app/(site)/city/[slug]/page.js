import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/site/project/project-card";
import { Scroller } from "@/components/site/ui/scroller";
import { SoonLink } from "@/components/site/ui/soon-link";
import { PROJECTS } from "@/data/projects";
import { LIVE_PROPERTIES, PUBLIC_CITIES, getCityBySlug, getLocalitiesForCity } from "@/lib/site/site-data";
import { CATEGORY_LIST } from "@/lib/site/categories";
import { toTemplateProject } from "@/lib/site/template/project-mapper";
import { toTemplateLocality } from "@/lib/site/template/locality-mapper";
import { inr, num } from "@/lib/site/template/format";

export function generateStaticParams() {
  return PUBLIC_CITIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: "City Not Found" };
  return { title: `Properties in ${city.name} — Buy, Rent, PG & Commercial`, description: `Explore properties, prices and new projects in ${city.name}.` };
}

const CAT_META = {
  buy: ["bi-house-door", "Homes for sale"],
  rent: ["bi-key", "Flats & houses"],
  pg: ["bi-people", "Beds & co-living"],
  commercial: ["bi-shop", "Offices, shops, warehouses"],
  plots: ["bi-bounding-box", "Residential & land"],
  projects: ["bi-buildings", "Launches & under construction"],
};

// Short tile labels, matching the original prototype's city-cat grid wording
// (distinct from the longer CATEGORIES.label used in nav/search headers).
const CAT_LABEL = { buy: "Buy", rent: "Rent", pg: "PG", commercial: "Commercial", plots: "Plots", projects: "New Projects" };

export default async function CityPage({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const localities = getLocalitiesForCity(city.id).map(toTemplateLocality).sort((a, b) => b.count - a.count);
  const projects = PROJECTS.filter((p) => p.city === city.name).map(toTemplateProject);

  const cityProperties = LIVE_PROPERTIES.filter((p) => p.location.city === city.name);
  const counts = Object.fromEntries(
    CATEGORY_LIST.filter((c) => c.key !== "projects").map((c) => [c.key, cityProperties.filter(c.matches).length])
  );
  counts.projects = city.projectCount;

  const mostAffordable = localities.length ? [...localities].sort((a, b) => a.avg - b.avg)[0] : null;
  const fastestGrowing = localities.length ? [...localities].sort((a, b) => b.trend[5] / b.trend[1] - a.trend[5] / a.trend[1])[0] : null;
  const mostListings = localities[0] ?? null;
  const stateName = city.intel?.stateName ?? "India";
  const guides = [
    [`Buying your first home in ${city.name}`, "A checklist: budget, local approvals, RERA, loan pre-approval.", "bi-journal-check"],
    [`Renting in ${city.name}: deposits & agreements`, "What's normal for deposits, lock-in and notice periods.", "bi-file-earmark-text"],
    [`Understanding land units in ${stateName}`, "Bigha, biswa, sq.yd — and why conversions vary by district.", "bi-rulers"],
  ];

  return (
    <>
      <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", paddingBottom: 28 }}>
        <div className="container">
          <nav className="crumbs"><Link href="/">Home</Link><i className="bi bi-chevron-right" /><span>{city.name}</span></nav>
          <div className="eyebrow">{city.intel?.stateName ?? "India"}</div>
          <h1 className="h1 mt-8">Properties in {city.name}</h1>
          <p className="muted mt-8">{num(city.propertyCount)} listings across {localities.length} localities</p>
          <div className="city-cats mt-24">
            {CATEGORY_LIST.map((c) => (
              <Link key={c.key} className="city-cat" href={`${c.href}?city=${encodeURIComponent(city.name)}`}>
                <i className={`bi ${CAT_META[c.key]?.[0] ?? "bi-house"}`} />
                <span className="t">{CAT_LABEL[c.key] ?? c.label}</span>
                <span className="s">{CAT_META[c.key]?.[1]}</span>
                <span className="xs muted">{num(counts[c.key] ?? 0)} listed</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        {localities.length > 0 && (
          <section className="section">
            <div className="section-head"><div><h2 className="h2">Popular localities</h2><p>Average sale price and rent range.</p></div></div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Locality</th><th>Zone</th><th>Avg. ₹/sq.ft</th><th>1-yr change</th><th>Rent range</th><th>Listings</th><th /></tr></thead>
                <tbody>
                  {localities.map((l) => (
                    <tr key={l.slug}>
                      <td><Link className="strong" href={`/locality/${l.slug}`}>{l.name}</Link></td>
                      <td className="muted">{l.zone}</td>
                      <td>₹{num(l.avg)}</td>
                      <td className="trend-up">+{Math.round((l.trend[5] / l.trend[1] - 1) * 100)}%</td>
                      <td>{inr(l.rent[0])} – {inr(l.rent[1])}</td>
                      <td>{num(l.count)}</td>
                      <td><Link className="btn btn-outline btn-sm" href={`/buy?city=${encodeURIComponent(city.name)}&locality=${encodeURIComponent(l.name)}`}>View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="data-meta" style={{ border: 0 }}>
              <span><i className="bi bi-calendar3" />Data period: Jul–Sep 2026</span>
              <span><i className="bi bi-arrow-clockwise" />Last updated 21 Sep 2026</span>
              <span><i className="bi bi-house" />Residential resale; rent for 1–3 BHK</span>
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="section">
            <div className="section-head"><h2 className="h2">Popular projects</h2><Link className="see-all" href="/projects">All projects <i className="bi bi-arrow-right" /></Link></div>
            <Scroller>{projects.map((p) => <ProjectCard key={p.id} project={p} />)}</Scroller>
          </section>
        )}

        {localities.length > 0 && (
          <section className="section">
            <div className="section-head"><div><h2 className="h2">Price trends &amp; market insights</h2><p>Across all {city.name} localities.</p></div></div>
            <div className="grid-3">
              {[["Most affordable", mostAffordable], ["Fastest growing", fastestGrowing], ["Most listings", mostListings]].filter(([, l]) => l).map(([k, l]) => (
                <Link key={k} className="insight" href={`/locality/${l.slug}`}>
                  <div className="k">{k}</div>
                  <div className="v" style={{ fontSize: 20 }}>{l.name}</div>
                  <div className="small">₹{num(l.avg)}/sq.ft · <span className="trend-up">+{Math.round((l.trend[5] / l.trend[1] - 1) * 100)}% YoY</span></div>
                  <div className="data-meta">
                    <span><i className="bi bi-calendar3" />Jul–Sep 2026</span>
                    <span><i className="bi bi-house" />Residential resale</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-head"><h2 className="h2">Guides</h2></div>
          <div className="grid-3">
            {guides.map(([t, s, icon]) => (
              <SoonLink key={t} className="svc">
                <span className="ico"><i className={`bi ${icon}`} /></span>
                <span><div className="t">{t}</div><div className="s">{s}</div></span>
              </SoonLink>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
