"use client";

import dynamic from "next/dynamic";
import { MapPin, Sparkles } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { LocalityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Card } from "@/components/site/home-variants/vendor/CardSwap";
import { getFeaturedProperties, getPopularLocalities } from "@/lib/site/site-data";
import { formatPrice } from "@/lib/site/format";

// CardSwap drives its stacked-deck animation with gsap against window/timers on
// mount — it has no server-renderable output, so it must never run during SSR.
const CardSwap = dynamic(
  () => import("@/components/site/home-variants/vendor/CardSwap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
    ),
  }
);

export default function CardSwapHomeDesignPage() {
  const showcaseProperties = getFeaturedProperties(5);
  const featured = getFeaturedProperties(8);
  const popularLocalities = getPopularLocalities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-primary-950">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-y-1/3 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
          {/* Left: headline + search */}
          <Reveal className="lg:pr-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary-300" /> Featured listings, live in 3D
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Step into your next home
            </h1>
            <p className="mt-4 max-w-lg text-base text-navy-200 sm:text-lg">
              Watch our top featured properties cycle through, then search verified listings for
              sale, rent, PG, commercial and plots across India.
            </p>
            <div className="mt-8">
              <SearchHero />
            </div>
          </Reveal>

          {/* Right: CardSwap showcase of featured listings */}
          <div className="relative min-h-[420px] w-full lg:min-h-[480px]">
            <CardSwap
              width={380}
              height={260}
              cardDistance={55}
              verticalDistance={65}
              delay={2600}
              pauseOnHover
              skewAmount={5}
              easing="elastic"
            >
              {showcaseProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden shadow-2xl">
                  <img
                    src={property.images?.[0]}
                    alt={property.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  {property.featured && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-featured-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Featured
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="truncate font-display text-base font-bold text-white">{property.title}</p>
                    <p className="mt-1 text-sm font-semibold text-primary-300">{formatPrice(property)}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-navy-200">
                      <MapPin className="h-3 w-3 shrink-0" /> {property.location.locality}, {property.location.city}
                    </p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
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
      </div>
    </div>
  );
}
