"use client";

import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { CityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { getFeaturedProperties, getPopularCities } from "@/lib/site/site-data";

// SplitText reads document.fonts and drives a ScrollTrigger tied to window
// scroll, so it's DOM/browser-only — load it client-side only to avoid an
// SSR crash. The fallback repeats the real headline (unanimated) so there's
// no layout shift and the copy is still present before hydration.
const SplitText = dynamic(() => import("@/components/site/home-variants/vendor/SplitText"), {
  ssr: false,
  loading: () => (
    <h1 className="split-parent inline-block text-center font-display text-4xl font-bold text-foreground sm:text-6xl">
      Every home tells a story
    </h1>
  ),
});

export default function SplitTextHomeDesign() {
  const featured = getFeaturedProperties(8);
  const popularCities = getPopularCities(8);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — "Reveal": light, airy, headline animates in word-by-word  */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-white dark:bg-background">
        {/* Soft, plain decorative backdrop — no vendor needed here, the
            vendor component *is* the headline for this variant. */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/70 via-white to-white dark:from-primary-500/5 dark:via-background dark:to-background" />
          <div className="absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-500/10" />
          <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/4 translate-y-1/4 rounded-full bg-primary-200/50 blur-3xl dark:bg-primary-500/10" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-inset ring-primary-200 dark:bg-primary-500/10 dark:text-primary-300 dark:ring-primary-500/20">
              <Sparkles className="h-3.5 w-3.5" /> Homepage concept — Reveal
            </span>

            <div className="mt-6">
              <SplitText
                text="Every home tells a story"
                tag="h1"
                splitType="words"
                className="text-4xl font-display font-bold text-foreground sm:text-6xl"
                delay={80}
                duration={1}
                ease="power3.out"
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
              />
            </div>

            <p className="mx-auto mt-5 max-w-xl text-base text-foreground-muted sm:text-lg">
              Find your next home in India — verified listings for sale, rent, PG and commercial,
              with honest details and no guesswork.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mx-auto mt-10 max-w-4xl">
            <SearchHero />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:space-y-20 sm:px-6 sm:py-20 lg:px-8">
        {/* -------------------------------------------------------------- */}
        {/* Featured properties                                           */}
        {/* -------------------------------------------------------------- */}
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

        {/* -------------------------------------------------------------- */}
        {/* Popular cities                                                */}
        {/* -------------------------------------------------------------- */}
        <section>
          <SectionHeading eyebrow="Pan-India coverage" title="Popular cities" />
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
