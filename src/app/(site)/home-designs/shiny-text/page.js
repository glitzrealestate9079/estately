"use client";

import ShinyText from "@/components/site/home-variants/vendor/ShinyText";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { CityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import {
  getFeaturedProperties,
  getPopularCities,
} from "@/lib/site/site-data";

export default function ShineHomeDesignPage() {
  const featured = getFeaturedProperties(8);
  const popularCities = getPopularCities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-navy-950">
        {/* Ambient backdrop glow */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-primary-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">
              Estately &middot; Shine
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
              <ShinyText
                text="Shine a light on your next home"
                speed={3}
                color="#5b6b82"
                shineColor="#ffffff"
                spread={110}
                direction="left"
                className="text-4xl font-display font-bold sm:text-6xl"
              />
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-navy-200 sm:text-lg">
              A calm, minimal way to search — verified properties for sale, rent, PG, commercial and
              plots, all across India.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 w-full max-w-4xl">
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
        {/* Popular cities                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Pan-India coverage"
            title="Popular cities"
            description="Explore verified listings across India's most active property markets."
            action={{ label: "Explore all cities", href: "/city/jaipur" }}
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
