"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { CityCard, LocalityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import {
  getFeaturedProperties,
  getPopularCities,
  getPopularLocalities,
} from "@/lib/site/site-data";

// RippleGrid renders an interactive WebGL canvas via `ogl` and reaches for
// `window`/canvas at module-eval time — it must never run during SSR/static
// generation, so it's loaded client-only with a plain gradient placeholder
// shown until it mounts.
const RippleGrid = dynamic(
  () => import("@/components/site/home-variants/vendor/RippleGrid"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gradient-to-br from-navy-950 via-primary-950 to-navy-950" />
    ),
  }
);

export default function RippleGridHomeDesignPage() {
  const featured = getFeaturedProperties(8);
  const popularCities = getPopularCities(8);
  const popularLocalities = getPopularLocalities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-950">
        {/* Vendor animation backdrop */}
        <div className="absolute inset-0 z-0">
          <RippleGrid
            gridColor="#3b82f6"
            rippleIntensity={0.06}
            gridSize={12}
            gridThickness={13}
            opacity={0.55}
            mouseInteraction
            mouseInteractionRadius={1.2}
            lightMode={false}
          />
        </div>

        {/* Legibility scrim over the grid */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-navy-950/70 via-navy-950/35 to-navy-950/85" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary-300" /> Estately &middot; Ripple Grid
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Search smarter. Move the market.
            </h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              Move your cursor and watch the grid respond — then search verified properties for
              sale, rent, PG, commercial and plots across India, just as responsively.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-8 w-full max-w-4xl">
            <SearchHero />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Featured properties                                            */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Featured properties"
            description="Sponsored placements — clearly labelled, never mixed up with verification."
            action={{ label: "View all in Buy", href: "/buy" }}
          />
          <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((property) => (
              <RevealItem key={property.id}>
                <PropertyCard property={property} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Popular localities                                              */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Where people are looking"
            title="Popular localities"
            description="Real demand hotspots based on live search and enquiry activity."
            action={{ label: "Explore all cities", href: "/city/jaipur" }}
          />
          <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {popularLocalities.map((locality) => (
              <RevealItem key={locality.id}>
                <LocalityCard locality={locality} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Popular cities                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Pan-India coverage"
            title="Popular cities"
            description="Explore verified listings across India's most active property markets."
          />
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
