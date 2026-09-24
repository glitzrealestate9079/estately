import Link from "next/link";
import {
  Building2,
  Compass,
  FileSearch,
  Landmark,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SearchHero } from "@/components/site/search/search-hero";
import { HeroSlider } from "@/components/site/home/hero-slider";
import { OwnerCtaCard } from "@/components/site/home/owner-cta-card";
import { PropertyCard } from "@/components/site/property/property-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { LocalityCard, CityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/data/projects";
import { SEARCH_CATEGORY_LIST } from "@/lib/site/categories";
import {
  getFeaturedProperties,
  getOwnerProperties,
  getPopularCities,
  getPopularLocalities,
  getRecentProperties,
} from "@/lib/site/site-data";

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "Verification you can trust",
    description:
      "Verified, RERA and owner badges are separate, honest signals — never one generic green tick. You always know what's actually been checked.",
  },
  {
    icon: Compass,
    title: "Locality intelligence, not guesswork",
    description:
      "Price trends, rent ranges and nearby infrastructure for every locality — with the data period and last-updated date shown up front.",
  },
  {
    icon: MessageCircleHeart,
    title: "Low-friction enquiry",
    description:
      "One enquiry, pre-filled with listing context. No retyping details the platform already knows about the property.",
  },
  {
    icon: FileSearch,
    title: "Built for real decisions",
    description:
      "Compare up to 4 homes side-by-side, save shortlists instantly, and schedule visits without losing your place in the search.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProperties(8);
  const recent = getRecentProperties(8);
  const ownerProperties = getOwnerProperties(6);
  const popularLocalities = getPopularLocalities(8);
  const popularCities = getPopularCities(10);
  const newProjects = [...PROJECTS].slice(0, 6);

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/60 to-navy-950/90" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary-300" /> Trusted by 12,000+ verified listings across India
            </span>
            <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Find your next place, with confidence
            </h1>
            <p className="mt-4 text-base text-navy-200 sm:text-lg">
              Search verified properties for sale, rent, PG, commercial and plots — compare, save and
              connect directly with owners, agents and builders.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-8 max-w-4xl">
            <SearchHero />
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
        {/* Category quick links                                            */}
        {/* ---------------------------------------------------------------- */}
        <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SEARCH_CATEGORY_LIST.map((category) => (
            <RevealItem key={category.key}>
              <Link
                href={category.href}
                className="flex h-full flex-col items-center gap-2.5 rounded-2xl border border-border-subtle bg-surface p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  <category.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-foreground">{category.label}</span>
              </Link>
            </RevealItem>
          ))}
          <RevealItem>
            <Link
              href="/services"
              className="flex h-full flex-col items-center gap-2.5 rounded-2xl border border-dashed border-border-subtle bg-surface-muted p-5 text-center transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-foreground-muted">
                <Landmark className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-foreground">Services</span>
            </Link>
          </RevealItem>
        </RevealGroup>

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
        {/* New projects                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Fresh inventory"
            title="New & upcoming projects"
            description="Launch-stage and under-construction developments from trusted builders."
            action={{ label: "View all projects", href: "/projects" }}
          />
          <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {newProjects.map((project) => (
              <RevealItem key={project.id}>
                <ProjectCard project={project} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Why Estately                                                    */}
        {/* ---------------------------------------------------------------- */}
        <section className="rounded-3xl bg-navy-950 px-6 py-14 sm:px-10">
          <SectionHeading
            eyebrow="Why Estately"
            title="Decision support, not just more listings"
            description="We compete on trust and clarity — not on who shows the most properties."
            align="center"
            className="text-white [&_p]:text-navy-300 [&_h2]:text-white"
          />
          <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIFFERENTIATORS.map((item) => (
              <RevealItem key={item.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-300">{item.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Recently added                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section>
          <SectionHeading
            eyebrow="Just listed"
            title="Recently added properties"
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
        {/* Owner properties + CTA                                          */}
        {/* ---------------------------------------------------------------- */}
        <section className="grid grid-cols-1 relative gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="No brokerage" title="Direct from owners" action={{ label: "See all", href: "/buy?ownerOnly=true" }} />
            <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {ownerProperties.slice(0, 4).map((property) => (
                <RevealItem key={property.id}>
                  <PropertyCard property={property} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal direction="right" className="h-full relative">
            <OwnerCtaCard />
          </Reveal>
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

        {/* ---------------------------------------------------------------- */}
        {/* Tools teaser                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Reveal className="flex flex-col items-center gap-6 rounded-3xl border border-border-subtle bg-surface p-10 text-center shadow-card sm:flex-row sm:text-left">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <Building2 className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="font-display text-lg font-bold text-foreground">Plan your purchase with our free tools</p>
            <p className="mt-1 text-sm text-foreground-muted">
              EMI calculator, rent-vs-buy comparison and locality price insights — all in one place.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">Explore tools</Link>
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
