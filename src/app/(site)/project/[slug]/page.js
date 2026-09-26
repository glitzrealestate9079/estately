import Link from "next/link";
import { notFound } from "next/navigation";
import { EmiCalculator } from "@/components/site/property/emi-calculator";
import { NearbyTabs } from "@/components/site/property/nearby-tabs";
import { UnitsTable } from "@/components/site/project/units-table";
import { FloorPlanTabs } from "@/components/site/project/floor-plan-tabs";
import { Masterplan } from "@/components/site/project/masterplan";
import { ProjectContactActions } from "@/components/site/project/project-contact-actions";
import { SaveProjectButton } from "@/components/site/project/save-project-button";
import { ScrollSpySubnav } from "@/components/site/ui/scroll-spy-subnav";
import { ProjectCard } from "@/components/site/project/project-card";
import { PropertyCard } from "@/components/site/property/property-card";
import { Scroller } from "@/components/site/ui/scroller";
import { PROJECTS } from "@/data/projects";
import { getProjectBySlug, getRelatedProjects, getDeveloperByName, getPropertiesForCategory, getLocalityByName } from "@/lib/site/site-data";
import { toTemplateProject } from "@/lib/site/template/project-mapper";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { deriveNearby } from "@/lib/site/derived";
import { inr, num } from "@/lib/site/template/format";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.projectName} by ${project.developer}, ${project.locality} — New Project`,
    description: project.description,
  };
}

const STATUS_BADGE = { "New Launch": "badge-purple", Upcoming: "badge-info", "Under Construction": "badge-warning", "Ready to Move": "badge-success" };

const SECTIONS = [
  ["overview", "Overview"],
  ["units", "Units"],
  ["amenities", "Amenities"],
  ["masterplan", "Masterplan"],
  ["floorplans", "Floor Plans"],
  ["pricing", "Pricing"],
  ["location", "Location"],
];

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const p = toTemplateProject(project);
  const developer = getDeveloperByName(project.developer);
  const ongoingCount = PROJECTS.filter((pr) => pr.developer === project.developer && pr.status !== "Ready to Move").length;
  const localityRow = getLocalityByName(project.city, project.locality);
  const others = getRelatedProjects(project, 6).map(toTemplateProject);
  const nearby = deriveNearby(project);
  const buyListings = getPropertiesForCategory("buy")
    .filter((x) => x.location.city === project.city && x.location.locality === project.locality)
    .slice(0, 4)
    .map((x) => toTemplateProperty(x, "buy"));

  return (
    <main className="container">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <i className="bi bi-chevron-right" />
        <Link href="/projects">New Projects</Link>
        <i className="bi bi-chevron-right" />
        {localityRow ? <Link href={`/locality/${localityRow.id}`}>{p.loc}</Link> : <span>{p.loc}</span>}
        <i className="bi bi-chevron-right" />
        <span>{p.name}</span>
      </nav>

      <section className="proj-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0]} alt={p.name} />
        <div className="inner">
          <div>
            <div className="row-wrap mb-8">
              <span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span>
              <span className="badge badge-dark"><i className="bi bi-images" />{p.images.length} photos</span>
            </div>
            <h1>{p.name}</h1>
            <p style={{ color: "#d8e0ec", marginTop: 6 }}><i className="bi bi-geo-alt" /> {p.sub}, {p.city} · by <b style={{ color: "#fff" }}>{p.developer}</b></p>
          </div>
          <div className="row-wrap hide-mobile">
            <SaveProjectButton id={p.id} />
            <ProjectContactActions project={p} layout="inline" />
          </div>
        </div>
      </section>

      <div className="proj-facts">
        <div><div className="k">Price</div><div className="v">{inr(p.minPrice)} – {inr(p.maxPrice)}</div></div>
        <div><div className="k">Configuration</div><div className="v">{p.bhk.join(", ")} BHK {p.ptype === "Villa" ? "Villas" : "Apts"}</div></div>
        <div><div className="k">Possession</div><div className="v">{p.possession}</div></div>
        <div><div className="k">RERA</div><div className="v" style={{ fontSize: 13.5 }}>{p.rera || <span className="text-warning">Awaited</span>}</div></div>
        <div><div className="k">Developer</div><div className="v">{p.developer}</div></div>
        <div><div className="k">Project size</div><div className="v">{p.units} units · {p.acres} acres</div></div>
      </div>

      <div className="subnav mt-16">
        <ScrollSpySubnav sections={SECTIONS} />
      </div>

      <div className="pd-layout" style={{ marginTop: 8 }}>
        <div>
          <section className="pd-section" id="overview">
            <h2>Overview</h2>
            <p style={{ maxWidth: "70ch" }}>
              {p.name} is a {p.status.toLowerCase()} {p.ptype === "Villa" ? "gated villa community" : "residential project"} by {p.developer} spread over {p.acres} acres at{" "}
              {p.sub}, {p.city}. It offers {p.bhk.join(", ")} BHK {p.ptype === "Villa" ? "villas" : "apartments"} from {num(p.sizes[0])} to {num(p.sizes[1])} sq.ft
              {p.towers ? ` across ${p.towers} towers` : ""}. {p.status === "Upcoming" ? `Launch expected ${p.launched}.` : `Launched ${p.launched}.`}
            </p>
            <div className="trust-grid mt-16">
              <div className="trust-item is-info">
                <span className="ti-ico"><i className="bi bi-file-earmark-text" /></span>
                <div><div className="t">RERA information</div><div className="s">{p.rera ? <>Registration no. <b className="ink">{p.rera}</b>, as provided by the developer.</> : "The developer has not provided a RERA registration yet. Do not pay booking amounts for unregistered projects."}</div></div>
              </div>
              <div className="trust-item is-info">
                <span className="ti-ico"><i className="bi bi-building-check" /></span>
                <div><div className="t">Developer</div><div className="s">{p.developer}{developer ? ` · since ${developer.establishedYear} · ${developer.projectsCount} projects delivered (as declared)` : ""}</div></div>
              </div>
              <div className="trust-item is-info">
                <span className="ti-ico"><i className="bi bi-flag" /></span>
                <div><div className="t">Project status</div><div className="s">{p.status} · possession {p.possession}{p.status === "Under Construction" ? " (developer estimate)" : ""}</div></div>
              </div>
              <div className="trust-item is-info">
                <span className="ti-ico"><i className="bi bi-clock-history" /></span>
                <div><div className="t">Last updated</div><div className="s">Prices and availability updated {p.updated} days ago by the developer</div></div>
              </div>
            </div>
          </section>

          <section className="pd-section" id="units">
            <h2>Units</h2>
            <UnitsTable units={p.unitTypes} project={p} />
          </section>

          <section className="pd-section" id="amenities">
            <h2>Amenities</h2>
            <div className="amen-grid">
              {p.amenities.map((a) => (
                <div key={a} className="amen"><i className="bi bi-check2-circle" />{a}</div>
              ))}
            </div>
          </section>

          <section className="pd-section" id="masterplan">
            <h2>Masterplan</h2>
            <div className="masterplan">
              <Masterplan towerNames={p.towerNames} unitTypeNames={p.unitTypes.map((u) => u.name).join(", ")} />
            </div>
            <p className="xs muted mt-8">Indicative site layout. Refer to the RERA-approved layout before booking.</p>
          </section>

          <section className="pd-section" id="floorplans">
            <h2>Floor plans</h2>
            <FloorPlanTabs units={p.unitTypes} />
          </section>

          <section className="pd-section" id="pricing">
            <h2>Pricing</h2>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Unit</th><th>Base price</th><th>₹ / sq.ft</th><th>Est. EMI*</th></tr></thead>
                <tbody>
                  {p.unitTypes.map((u) => (
                    <tr key={u.name}><td className="strong">{u.name}</td><td>{inr(u.price)}</td><td>₹{num(u.price / u.size)}</td><td>₹{num(estimateEmi(u.price))}/mo</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="xs muted mt-8">Prices as listed by the developer on 23 Sep 2026. Excludes stamp duty, registration, parking and other charges. *EMI at 8.5% for 20 years with 20% down payment.</p>
            <div className="mt-24">
              <div className="h4 mb-12">EMI calculator</div>
              <EmiCalculator price={p.minPrice} />
            </div>
          </section>

          <section className="pd-section" id="location">
            <h2>Location</h2>
            <p className="mb-16"><i className="bi bi-geo-alt text-primary" /> {p.sub}, {p.city}</p>
            <div className="mini-map">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${p.sub}, ${p.city}`)}&z=15&output=embed`}
                title={`Map of ${p.name}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0, width: "100%", height: "100%" }}
              />
            </div>
            <div className="h4 mt-24 mb-8">Nearby</div>
            <NearbyTabs nearby={nearby} />
          </section>

          {buyListings.length > 0 && (
            <section className="pd-section">
              <h2>Resale &amp; new listings in this project</h2>
              <div className="results-list">
                {buyListings.map((l) => (
                  <PropertyCard key={l.id} property={l} layout="list" />
                ))}
              </div>
            </section>
          )}

          <section className="pd-section">
            <h2>About the developer</h2>
            <div className="seller-card">
              <span className="avatar avatar-lg">{p.developer.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
              <div>
                <div className="strong" style={{ fontSize: 17 }}>{p.developer}</div>
                <div className="small muted">
                  {developer ? `Established ${developer.establishedYear} · ${developer.projectsCount} delivered · ${ongoingCount} on Estately` : "Details as declared by the developer."}
                </div>
                {developer?.description && <p className="small mt-8">{developer.description}</p>}
              </div>
            </div>
          </section>
        </div>

        <aside className="pd-aside">
          <div className="contact-card">
            <div className="xs muted">Price range</div>
            <div className="price">{inr(p.minPrice)} – {inr(p.maxPrice)}</div>
            <div className="small muted">{p.bhk.join(", ")} BHK · {num(p.sizes[0])}–{num(p.sizes[1])} sq.ft</div>
            <ProjectContactActions project={p} />
            <p className="xs muted mt-12" style={{ textAlign: "center" }}>{p.rera ? `RERA ${p.rera}` : "RERA registration awaited"}</p>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="h2">Other projects in {p.city}</h2>
            <Link className="see-all" href="/projects">All projects <i className="bi bi-arrow-right" /></Link>
          </div>
          <Scroller>
            {others.map((o) => (
              <ProjectCard key={o.id} project={o} />
            ))}
          </Scroller>
        </section>
      )}
    </main>
  );
}

function estimateEmi(price) {
  const principal = price * 0.8;
  const r = 8.5 / 1200;
  const n = 240;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}
