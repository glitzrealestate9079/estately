"use client";

import dynamic from "next/dynamic";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { CityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { formatPrice } from "@/lib/site/format";
import { getFeaturedProperties, getPopularCities, getRecentProperties } from "@/lib/site/site-data";

// Touches window/GSAP timelines directly on mount — must stay client-only,
// so it's loaded via next/dynamic with ssr disabled to avoid a server crash.
const InteractiveListPreview = dynamic(
  () => import("@/components/site/home-variants/vendor/InteractiveListPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] w-full animate-pulse bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
    ),
  }
);

export default function InteractiveListHomePage() {
  const featured = getFeaturedProperties(8);
  const recent = getRecentProperties(8);
  const popularCities = getPopularCities(8);

  const previewItems = featured.map((property) => ({
    client: property.title,
    platform: `${property.location.city}, ${property.location.locality}`,
    services: formatPrice(property),
    img: property.images[0],
  }));

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — clean background, real headline + search                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-border-subtle bg-gradient-to-b from-primary-50 to-surface px-4 py-16 dark:from-primary-500/10 dark:to-surface sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
              Hover Preview design
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Find your next home, one hover at a time
            </h1>
            <p className="mt-4 text-base text-foreground-muted sm:text-lg">
              Search verified properties for sale, rent, PG, commercial and plots — then explore trending
              listings below with a cursor-following photo preview.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-8 max-w-4xl">
            <SearchHero />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Trending — hover-preview list (vendor animation)                */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Trending this week"
            title="Featured properties"
            description="Move your cursor over a row to preview the listing — on touch devices this becomes a simple stacked list."
            action={{ label: "View all in Buy", href: "/buy" }}
          />
          <div className="mt-8 w-full overflow-hidden rounded-3xl border border-border-subtle shadow-card">
            <InteractiveListPreview items={previewItems} imageSize={1} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Recently added                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Just listed"
            title="Recently added properties"
            description="Fresh inventory added by verified owners, agents and builders."
            action={{ label: "View all", href: "/buy?sort=newest" }}
          />
          <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((property) => (
              <RevealItem key={property.id}>
                <PropertyCard property={property} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Explore cities                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading eyebrow="Pan-India coverage" title="Explore cities" />
          <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popularCities.map((city, index) => (
              <RevealItem key={city.id}>
                <CityCard city={city} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      </div>
    </div>
  );
}
