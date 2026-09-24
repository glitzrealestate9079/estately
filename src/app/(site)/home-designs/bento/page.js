"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { CityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { getFeaturedProperties, getPopularCities, LIVE_PROPERTIES } from "@/lib/site/site-data";
import { PROJECTS } from "@/data/projects";

// MagicBento drives its spotlight/tilt/particle effects straight off gsap and
// live cursor position against `window`/`document` — it must never run
// during server rendering.
const MagicBento = dynamic(() => import("@/components/site/home-variants/vendor/MagicBento"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto h-[420px] w-full max-w-[54rem] animate-pulse rounded-[20px] bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900" />
  ),
});

function countByType(...types) {
  return LIVE_PROPERTIES.filter((p) => types.includes(p.type)).length;
}

export default function BentoHomeDesign() {
  const featured = getFeaturedProperties(8);
  const popularCities = getPopularCities(8);

  // Real category counts, filtered from the same live-listings dataset the
  // rest of the site uses (see CATEGORIES.matches in @/lib/site/categories
  // and applyFilters()'s `p.type` checks in @/lib/site/site-data).
  const categoryCardData = [
    {
      color: "#161225",
      label: "Buy & Rent",
      title: "Apartments",
      description: `${countByType("Apartment")} live listings — flats, studios and penthouses across India's top cities.`,
    },
    {
      color: "#1a1420",
      label: "Buy",
      title: "Villas",
      description: `${countByType("Villa", "Farmhouse", "Independent House")} live listings — independent villas, bungalows and farmhouses.`,
    },
    {
      color: "#12181f",
      label: "Land",
      title: "Plots",
      description: `${countByType("Plot")} live listings — residential and investment plots, RERA-checked.`,
    },
    {
      color: "#151a12",
      label: "Business",
      title: "Commercial",
      description: `${countByType("Commercial", "Office Space")} live listings — office space, retail and commercial land.`,
    },
    {
      color: "#1c1414",
      label: "Co-living",
      title: "PG / Co-living",
      description: `${countByType("PG / Co-living")} live listings — managed PGs and co-living stays, bills included.`,
    },
    {
      color: "#0f1622",
      label: "New Launches",
      title: "New Projects",
      description: `${PROJECTS.length} projects — new launches and under-construction developments from trusted builders.`,
    },
  ];

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — short, grid-first (the bento grid below is the real hero)   */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[40vh] overflow-hidden bg-navy-950">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-navy-950 via-primary-950 to-navy-950" />

        <div className="relative z-10 mx-auto flex min-h-[40vh] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Link
              href="/home-designs"
              className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all designs
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <LayoutGrid className="h-3.5 w-3.5 text-primary-300" /> Bento Grid — browse India&apos;s homes by category
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Every kind of home, one grid away
            </h1>
            <p className="mt-3 text-sm text-navy-200 sm:text-base">
              Search verified properties for sale, rent, PG, commercial and plots — then explore live
              inventory by category in the glowing grid below.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-6 w-full max-w-4xl">
            <SearchHero className="border border-white/10 bg-white/95 shadow-2xl backdrop-blur dark:bg-navy-950/90" />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Bento grid — the real hero of this variant                       */}
        {/* ---------------------------------------------------------------- */}
        <section className="rounded-3xl bg-navy-950 px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="Browse by category"
            title="Live inventory, at a glance"
            description="Move your cursor over a tile — every count below reflects real, currently-active listings."
            align="center"
            className="text-white [&_p]:text-navy-300 [&_h2]:text-white"
          />
          <div className="mt-10 flex justify-center overflow-x-auto">
            <MagicBento
              cardData={categoryCardData}
              textAutoHide={false}
              enableStars
              enableSpotlight
              enableBorderGlow
              enableTilt
              enableMagnetism
              clickEffect
              spotlightRadius={300}
              particleCount={8}
              glowColor="59, 130, 246"
            />
          </div>
        </section>

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
