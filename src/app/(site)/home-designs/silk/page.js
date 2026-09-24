"use client";

import dynamic from "next/dynamic";
import { Gem, Sparkles } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { LocalityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { getFeaturedProperties, getPopularLocalities } from "@/lib/site/site-data";

// Silk touches WebGL/Canvas via react-three-fiber — it must never render on
// the server, so it's loaded client-only with a plain gradient placeholder
// shown until it mounts.
const Silk = dynamic(() => import("@/components/site/home-variants/vendor/Silk"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#3c2f1a] to-navy-950" />,
});

export default function SilkHomeDesignPage() {
  const featured = getFeaturedProperties(8);
  const popularLocalities = getPopularLocalities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — Liquid Silk                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-950">
        <div className="absolute inset-0 z-0 h-full w-full">
          <Silk speed={2.4} scale={1} color="#8a6a35" noiseIntensity={1.1} rotation={0.15} />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-navy-950/70 via-navy-950/40 to-navy-950" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-b from-transparent to-background" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-inset ring-white/20 backdrop-blur">
              <Gem className="h-3.5 w-3.5" /> Curated for discerning homeowners
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Luxury addresses, woven for you
            </h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              Step into a handpicked collection of premium homes, penthouses and estates — verified,
              exclusive and ready for a life well lived.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-8 w-full max-w-4xl">
            <SearchHero />
          </Reveal>

          <Reveal delay={0.2} className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 text-center sm:gap-4">
            {[
              { value: "1,200+", label: "Premium Listings" },
              { value: "98%", label: "Verified Owners" },
              { value: "15+", label: "Luxury Micro-markets" },
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
            description="A selection of premium listings from trusted owners and builders."
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
        {/* Design note                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-surface p-10 text-center shadow-card">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <Sparkles className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-foreground">Liquid Silk — homepage concept</p>
            <p className="mt-1 text-sm text-foreground-muted">
              One of 10 experimental homepage designs.{" "}
              <a href="/home-designs" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                Browse all designs
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
