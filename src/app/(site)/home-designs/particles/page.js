"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Moon, Sparkles } from "lucide-react";
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

// WebGL particle field (uses `ogl` + canvas) — must never run during SSR.
const Particles = dynamic(
  () => import("@/components/site/home-variants/vendor/Particles"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gradient-to-b from-navy-950 via-navy-900 to-black" />
    ),
  }
);

export default function MidnightParticlesHomeDesign() {
  const featured = getFeaturedProperties(8);
  const popularLocalities = getPopularLocalities(8);
  const popularCities = getPopularCities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — night-sky particle field backdrop                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[92vh] overflow-hidden bg-navy-950">
        <div className="absolute inset-0 z-0">
          <Particles
            particleColors={["#60a5fa", "#818cf8", "#f5f7ff"]}
            particleCount={260}
            particleSpread={12}
            speed={0.08}
            particleBaseSize={110}
            moveParticlesOnHover
            alphaParticles
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-navy-950/40 via-navy-950/10 to-navy-950" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <Moon className="h-3.5 w-3.5 text-primary-300" /> Midnight Particles — a premium after-hours search
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Discover premium listings after hours
            </h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              A calmer way to search verified homes, plots and commercial spaces — curated
              listings drifting into view, whenever inspiration strikes.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-8 w-full max-w-4xl">
            <SearchHero className="shadow-2xl shadow-black/40 ring-1 ring-white/10" />
          </Reveal>

          <Reveal delay={0.2} className="mx-auto mt-10 flex items-center gap-2 text-xs font-medium text-navy-300 sm:text-sm">
            <Sparkles className="h-4 w-4 text-primary-300" />
            12,800+ verified listings across 35+ cities — searchable day or night
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Real content sections                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20 lg:px-8">
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

        <Reveal className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-surface p-10 text-center shadow-card">
          <p className="font-display text-lg font-bold text-foreground">
            Prefer a different look? Browse the other homepage concepts.
          </p>
          <Link
            href="/home-designs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            View all 10 designs
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
