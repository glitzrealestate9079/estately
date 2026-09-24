import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPinned } from "lucide-react";
import { PropertyCard } from "@/components/site/property/property-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { LocalityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { SEARCH_CATEGORY_LIST } from "@/lib/site/categories";
import { PROJECTS } from "@/data/projects";
import { PUBLIC_CITIES, getCityBySlug, getLocalitiesForCity, getPropertiesForCity } from "@/lib/site/site-data";

export function generateStaticParams() {
  return PUBLIC_CITIES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return { title: "City Not Found" };
  return {
    title: `Properties in ${city.name} — Buy, Rent, PG & Commercial`,
    description: `Explore ${city.propertyCount} verified properties and ${city.projectCount} new projects in ${city.name}.`,
  };
}

export default async function CityPage({ params }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const localities = getLocalitiesForCity(city.id).sort((a, b) => b.propertyCount - a.propertyCount);
  const properties = getPropertiesForCity(city.name, 8);
  const projects = PROJECTS.filter((p) => p.city === city.name).slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-950 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Properties in {city.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-navy-200">
            {city.propertyCount} active listings and {city.projectCount} new projects across {localities.length} localities.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {SEARCH_CATEGORY_LIST.map((category) => (
              <Link
                key={category.key}
                href={`${category.href}?city=${encodeURIComponent(city.name)}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
              >
                <category.icon className="h-4 w-4" /> {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <SectionHeading eyebrow="Localities" title={`Popular areas in ${city.name}`} />
          <RevealGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {localities.map((locality) => (
              <RevealItem key={locality.id}>
                <LocalityCard locality={locality} />
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {properties.length > 0 && (
          <section>
            <SectionHeading
              eyebrow="Live inventory"
              title="Featured properties"
              action={{ label: `View all in ${city.name}`, href: `/buy?city=${encodeURIComponent(city.name)}` }}
            />
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {properties.map((property) => (
                <RevealItem key={property.id}>
                  <PropertyCard property={property} />
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <SectionHeading eyebrow="New launches" title="Popular projects" action={{ label: "View all projects", href: "/projects" }} />
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <RevealItem key={project.id}>
                  <ProjectCard project={project} />
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        )}

        <section className="flex flex-col items-center gap-4 rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-card sm:flex-row sm:text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <MapPinned className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-foreground">Have a property in {city.name}?</p>
            <p className="mt-1 text-sm text-foreground-muted">List it for free and reach thousands of active buyers and tenants searching in this city.</p>
          </div>
          <Link
            href="/post-property"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            <Building2 className="h-4 w-4" /> Post Property
          </Link>
        </section>
      </div>
    </div>
  );
}
