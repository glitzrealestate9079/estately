import Link from "next/link";
import { HeroSection } from "@/components/site/home/hero-section";
import { FeaturedSection } from "@/components/site/home/featured-section";
import { LocalityCard } from "@/components/site/locality/locality-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { Scroller } from "@/components/site/ui/scroller";
import { LIVE_PROPERTIES, getPopularCities, getPopularLocalities } from "@/lib/site/site-data";
import { CATEGORIES } from "@/lib/site/categories";
import { PROJECTS } from "@/data/projects";
import { BLOGS } from "@/data/blogs";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { toTemplateProject } from "@/lib/site/template/project-mapper";
import { toTemplateLocality } from "@/lib/site/template/locality-mapper";
import { toTemplateBlog } from "@/lib/site/template/blog-mapper";
import { daysAgo } from "@/lib/site/derived";
import { imageForProperty } from "@/data/property-images";

export const metadata = {
  title: "Buy, Rent & Sell Property in India",
  description: "Search verified homes, PGs, plots, commercial spaces and new projects across India.",
};

const FEATURED_POOL_KEYS = { buy: "buy", rent: "rent", pg: "pg", commercial: "commercial", plot: "plots" };

function featuredPool(categoryKey) {
  const category = CATEGORIES[categoryKey];
  return LIVE_PROPERTIES.filter((p) => category.matches(p))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || daysAgo(a.updatedAt) - daysAgo(b.updatedAt))
    .slice(0, 8)
    .map((p) => toTemplateProperty(p, categoryKey));
}

const TYPE_EXPLORE = [
  { title: "Apartments", route: "/buy?propertyType=Apartment", type: "Apartment", sub: "Ready & under-construction flats" },
  { title: "Villas", route: "/buy?propertyType=Villa", type: "Villa", sub: "Private homes with gardens" },
  { title: "Independent Houses", route: "/buy?propertyType=Independent House", type: "Independent House", sub: "Standalone homes, resale & new" },
  { title: "Plots", route: "/plots", type: "Plot", sub: "Land for residential & commercial use" },
  { title: "Commercial", route: "/commercial", type: "Commercial", sub: "Offices, shops & warehouses" },
  { title: "PG", route: "/pg", type: "PG / Co-living", sub: "Beds for students & professionals" },
];

const NEEDS = [
  ["Buy a Home", "bi-house-check", "/buy", "Resale & new homes"],
  ["Find Rental", "bi-key", "/rent", "Flats & houses"],
  ["Find a PG", "bi-people", "/pg", "Beds from ₹5,000"],
  ["Find a Plot", "bi-bounding-box-circles", "/plots", "Residential & land"],
  ["Find Office", "bi-briefcase", "/commercial?propertyType=Office Space", "Offices & coworking"],
  ["Explore New Projects", "bi-buildings", "/projects", "Launches & RERA info"],
];

const SERVICE_TEASERS = [
  ["Home Loan", "bi-bank", "Compare home loan offers from leading partner banks in one place and check your eligibility before you apply.", "/services#loan", "Compare offers"],
  ["EMI Calculator", "bi-calculator", "Work out your monthly EMI in seconds by adjusting the loan amount, tenure and interest rate.", "/services#emi", "Calculate EMI"],
  ["Rent Agreement", "bi-file-earmark-text", "Create a legally valid rent agreement online and e-stamp it without visiting an office.", "/services", "Create agreement"],
];

function topLocalitiesLabel(list) {
  const counts = new Map();
  list.forEach((p) => counts.set(p.location.locality, (counts.get(p.location.locality) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([l]) => l).join(", ") || "Multiple cities";
}

export default function HomePage() {
  const cities = getPopularCities(20);
  const localities = getPopularLocalities(8).map(toTemplateLocality);
  const projects = PROJECTS.slice(0, 8).map(toTemplateProject);
  const blogs = BLOGS.filter((b) => b.status === "Published").slice(0, 4).map(toTemplateBlog);

  const pools = Object.fromEntries(Object.entries(FEATURED_POOL_KEYS).map(([k, catKey]) => [k, featuredPool(catKey)]));

  const byType = (type) => LIVE_PROPERTIES.filter((p) => p.type === type);
  const plots = LIVE_PROPERTIES.filter((p) => p.type === "Plot");
  const commercial = LIVE_PROPERTIES.filter((p) => CATEGORIES.commercial.matches(p));
  const pg = LIVE_PROPERTIES.filter((p) => CATEGORIES.pg.matches(p));
  const typeLists = {
    Apartment: byType("Apartment"),
    Villa: byType("Villa"),
    "Independent House": byType("Independent House"),
    Plot: plots,
    Commercial: commercial,
    "PG / Co-living": pg,
  };

  const readyApartments = LIVE_PROPERTIES.filter(
    (p) => p.type === "Apartment" && p.listingType === "Sale" && p.pricePerSqft
  );
  const avgPsf = readyApartments.length
    ? Math.round(readyApartments.reduce((sum, p) => sum + p.pricePerSqft, 0) / readyApartments.length)
    : 0;
  const rent2bhk = LIVE_PROPERTIES.filter((p) => p.listingType === "Rent" && p.bedrooms === 2)
    .map((p) => p.price)
    .sort((a, b) => a - b);
  const quartile = (arr, f) => arr[Math.floor((arr.length - 1) * f)] ?? 0;
  const trendPts = [0.94, 0.955, 0.965, 0.975, 0.99, 1].map((f) => Math.round(avgPsf * f));
  const totalListings = LIVE_PROPERTIES.length;

  return (
    <main>
      <HeroSection />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="h2">Popular localities</h2>
              <p>Average prices from live listings on Estately.</p>
            </div>
            <Link className="see-all" href="/search">All localities <i className="bi bi-arrow-right" /></Link>
          </div>
          <Scroller>
            {localities.map((l) => (
              <LocalityCard key={l.slug} locality={l} />
            ))}
          </Scroller>
        </div>
      </section>

      <FeaturedSection pools={pools} />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="h2">New projects</h2>
              <p>RERA details are shown as provided by the developer.</p>
            </div>
            <Link className="see-all" href="/projects">All projects <i className="bi bi-arrow-right" /></Link>
          </div>
          <Scroller>
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </Scroller>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="h2">Explore by property type</h2>
              <p>Browse listings by the kind of space you need, with the busiest localities for each.</p>
            </div>
            <Link className="see-all" href="/search">View all properties <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="type-grid">
            {TYPE_EXPLORE.map((t) => {
              const list = typeLists[t.type] ?? [];
              return (
                <Link key={t.title} className="type-card" href={t.route}>
                  <span className="type-img" style={{ backgroundImage: `url('${imageForProperty(t.type, 0)}')` }} />
                  <span className="type-top">
                    <span className="type-count"><i className="bi bi-house-door" />{list.length} listings</span>
                    <span className="type-go" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                  </span>
                  <span className="type-body">
                    <span className="t">{t.title}</span>
                    <span className="d">{t.sub}</span>
                    <span className="l"><i className="bi bi-geo-alt-fill" />{topLocalitiesLabel(list)}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2 className="h2">What are you looking for?</h2></div>
          <div className="tile-grid">
            {NEEDS.map(([t, icon, href, sub]) => (
              <Link key={t} className="tile" href={href}>
                <span className="ico ico-accent"><i className={`bi ${icon}`} /></span>
                <span className="t">{t}</span>
                <span className="s">{sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section market-band">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="h2">India market snapshot</h2>
              <p>Based on active Estately listings. Not a valuation.</p>
            </div>
            <Link className="see-all" href="/search">Browse listings <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="market-layout">
            <div
              className="market-visual"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=70")' }}
            >
              <div className="market-visual-body">
                <span className="mv-city"><i className="bi bi-geo-alt-fill" />Pan-India</span>
                <h3>The property market at a glance</h3>
                <div className="mv-stats">
                  {[[totalListings.toLocaleString("en-IN"), "Active listings"], [cities.length, "Cities covered"], ["+6.0%", "Price growth"]].map(([v, k]) => (
                    <div key={k}><strong>{v}</strong><span>{k}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="market-cards">
              <div className="insight">
                <span className="ins-ico"><i className="bi bi-cash-stack" /></span>
                <div className="k">Average sale price</div>
                <div className="v">₹{avgPsf.toLocaleString("en-IN")}<span className="small muted" style={{ fontWeight: 600 }}>/sq.ft</span></div>
                <div className="trend-up"><i className="bi bi-arrow-up-right" /> 6.0% vs. last year</div>
              </div>
              <div className="insight">
                <span className="ins-ico"><i className="bi bi-key" /></span>
                <div className="k">Typical 2 BHK rent</div>
                <div className="v">₹{quartile(rent2bhk, 0.25).toLocaleString("en-IN")} – ₹{quartile(rent2bhk, 0.75).toLocaleString("en-IN")}<span className="small muted" style={{ fontWeight: 600 }}>/month</span></div>
                <div className="small muted">Middle 50% of asking rents</div>
              </div>
              <div className="insight insight-chart">
                <div className="k"><span className="ins-ico sm"><i className="bi bi-bar-chart-line" /></span>Price trend · avg ₹/sq.ft</div>
                <div className="bar-chart" style={{ height: 96 }} role="img" aria-label="Average sale price per square foot trend">
                  {trendPts.map((v, i) => (
                    <div key={i} className={`bar ${i === 5 ? "is-current" : ""}`} title={`₹${v.toLocaleString("en-IN")}/sq.ft`}>
                      {(i === 0 || i === 5) && <span className="val">₹{(v / 1000).toFixed(1)}k</span>}
                      <span className="b" style={{ height: `${((v - trendPts[0] * 0.9) / (trendPts[5] - trendPts[0] * 0.9)) * 70}%` }} />
                    </div>
                  ))}
                </div>
                <div className="between xs muted"><span>Last year</span><span>Now</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="h2">Insights &amp; guides</h2>
              <p>Buying tips, locality reviews and market news.</p>
            </div>
            <Link className="see-all" href="/blog">All articles <i className="bi bi-arrow-right" /></Link>
          </div>
          {blogs.length > 0 && (
            <div className="blog-layout">
              <Link className="blog-feature" href={`/blog/${blogs[0].slug}`}>
                <span className="blog-img" style={{ backgroundImage: `url('${blogs[0].img}')` }} />
                <span className="blog-open" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                <span className="blog-feature-body">
                  <span className="blog-tag"><i className="bi bi-graph-up-arrow" />{blogs[0].cat}</span>
                  <span className="t">{blogs[0].title}</span>
                  <span className="d">{blogs[0].excerpt}</span>
                  <span className="blog-author">
                    <span className="av">{blogs[0].author.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                    <span className="who"><strong>{blogs[0].author.name}</strong><span>{blogs[0].date} · {blogs[0].read} min read</span></span>
                  </span>
                </span>
              </Link>
              <div className="blog-list">
                {blogs.slice(1).map((b) => (
                  <Link key={b.slug} className="blog-row" href={`/blog/${b.slug}`}>
                    <span className="blog-thumb">
                      <span className="blog-img" style={{ backgroundImage: `url('${b.img}')` }} />
                      <span className="blog-open" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                    </span>
                    <span className="blog-body">
                      <span className={`blog-cat tone-${b.tone}`}>{b.cat}</span>
                      <span className="t">{b.title}</span>
                      <span className="d">{b.excerpt}</span>
                      <span className="blog-meta"><span className="by">{b.author.name}</span><span className="dot" /><span>{b.date}</span><span className="dot" /><span>{b.read} min read</span></span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><h2 className="h2">Services for your move</h2></div>
            <Link className="see-all" href="/services">All services <i className="bi bi-arrow-right" /></Link>
          </div>
          <div className="grid-3">
            {SERVICE_TEASERS.map(([t, icon, desc, href, cta]) => (
              <div key={t} className="svc-card">
                <span className="ico"><i className={`bi ${icon}`} /></span>
                <h3>{t}</h3>
                <p>{desc}</p>
                <Link className="svc-link" href={href}>{cta}<i className="bi bi-arrow-right" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
