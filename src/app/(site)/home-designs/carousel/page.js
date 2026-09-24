"use client";

import dynamic from "next/dynamic";
import { Building2, MapPin, Sparkles } from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { PropertyCard } from "@/components/site/property/property-card";
import { CityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { getFeaturedProperties, getPopularCities } from "@/lib/site/site-data";

// The vendor carousel is drag/motion-driven and reads layout metrics on
// mount, so it must never run during SSR — dynamic-import it client-only
// with a plain gradient placeholder while it loads.
const Carousel = dynamic(
  () => import("@/components/site/home-variants/vendor/Carousel"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] w-[320px] animate-pulse rounded-[24px] border border-white/10 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950" />
    ),
  }
);

export default function HomeDesignCarouselPage() {
  const popularCities = getPopularCities(6);
  const cityRow = getPopularCities(8);
  const featured = getFeaturedProperties(8);

  // Real city data turned into carousel cards visitors can literally drag
  // through — title is the city, description is its live inventory count.
  const cityCarouselItems = popularCities.map((city) => {
    const total = city.propertyCount + city.projectCount;
    return {
      id: city.id,
      title: city.name,
      description: `${total.toLocaleString("en-IN")}+ verified listing${total === 1 ? "" : "s"}`,
      icon:
        city.projectCount >= city.propertyCount ? (
          <Building2 className="h-4 w-4 text-white" />
        ) : (
          <MapPin className="h-4 w-4 text-white" />
        ),
    };
  });

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero — headline + search up top, a draggable city carousel below */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-950">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_18%,rgba(99,102,241,0.28),transparent_45%),radial-gradient(circle_at_82%_0%,rgba(56,189,248,0.2),transparent_42%)]" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-b from-transparent to-background" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary-300" /> Drag through India&rsquo;s most-searched cities
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find your next home in India, one city at a time
            </h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              Search verified properties for sale, rent, PG, commercial and plots — then drag through
              our busiest cities below to jump straight into the search.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="w-full max-w-4xl">
            <SearchHero />
          </Reveal>

          <Reveal delay={0.2} className="flex w-full flex-col items-center gap-5 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-300">
              Drag, or use the dots, to explore popular cities
            </p>
            <Carousel
              items={cityCarouselItems}
              baseWidth={320}
              autoplay
              autoplayDelay={3500}
              pauseOnHover
              loop
              round={false}
            />
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
          <SectionHeading
            eyebrow="Pan-India coverage"
            title="Popular cities"
            description="The cities driving the most searches and enquiries right now."
          />
          <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cityRow.map((city, index) => (
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
