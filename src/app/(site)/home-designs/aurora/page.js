"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { LocalityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import {
  getFeaturedProperties,
  getPopularLocalities,
} from "@/lib/site/site-data";

// Aurora renders a full-bleed WebGL scene (via `ogl`) that touches the canvas
// directly on mount — it must never run during server rendering.
const Aurora = dynamic(() => import("@/components/site/home-variants/vendor/Aurora"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gradient-to-br from-navy-950 via-primary-950 to-navy-950" />,
});

export default function AuroraHomeDesign() {
  const featured = getFeaturedProperties(8);
  const popularLocalities = getPopularLocalities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — Aurora Dreams                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-950">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Aurora
            colorStops={["#8b5cf6", "#3b82f6", "#f472b6"]}
            amplitude={1.2}
            blend={0.55}
            speed={0.8}
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-navy-950/30 via-navy-950/50 to-navy-950" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link
              href="/home-designs"
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all designs
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary-300" /> Aurora Dreams — a dreamy homepage concept
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find your next home in India
            </h1>
            <p className="mt-4 text-base text-navy-100 sm:text-lg">
              Search verified properties for sale, rent, PG, commercial and plots — compare, save and
              connect directly with owners, agents and builders.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-8 w-full max-w-4xl">
            <SearchHero className="border border-white/10 bg-white/95 shadow-2xl backdrop-blur dark:bg-navy-950/90" />
          </Reveal>

          <Reveal delay={0.2} className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 text-center sm:gap-4">
            {[
              { value: "12,800+", label: "Properties" },
              { value: "2,400+", label: "Agents & Builders" },
              { value: "35+", label: "Cities Covered" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/15 bg-white/10 px-2 py-4 backdrop-blur-md sm:px-4 sm:py-5"
              >
                <p className="font-display text-xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-medium text-navy-100 sm:text-sm">{stat.label}</p>
              </div>
            ))}
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
      </div>
    </div>
  );
}
