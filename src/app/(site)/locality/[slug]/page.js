import Link from "next/link";
import { notFound } from "next/navigation";
import { FolderKanban, Info, MapPin } from "lucide-react";
import { PropertyCard } from "@/components/site/property/property-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { LocalityInsightsCard } from "@/components/site/locality/locality-insights-card";
import { LocalityCard } from "@/components/site/locality/locality-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/data/projects";
import {
  PUBLIC_LOCALITIES,
  getLocalityBySlug,
  getPropertiesForLocality,
  getNearbyLocalities,
} from "@/lib/site/site-data";

export function generateStaticParams() {
  return PUBLIC_LOCALITIES.map((l) => ({ slug: l.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locality = getLocalityBySlug(slug);
  if (!locality) return { title: "Locality Not Found" };
  return {
    title: locality.intel?.seoTitle ?? `Properties in ${locality.name}, ${locality.cityName}`,
    description: locality.intel?.seoDescription ?? `Explore properties for sale and rent in ${locality.name}, ${locality.cityName}.`,
  };
}

export default async function LocalityPage({ params }) {
  const { slug } = await params;
  const locality = getLocalityBySlug(slug);
  if (!locality) notFound();

  const forSale = getPropertiesForLocality(locality.cityName, locality.name).filter((p) => p.listingType === "Sale");
  const forRent = getPropertiesForLocality(locality.cityName, locality.name).filter((p) => p.listingType === "Rent");
  const projects = PROJECTS.filter((p) => p.locality === locality.name && p.city === locality.cityName);
  const nearby = getNearbyLocalities(locality, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="mb-2 flex items-center gap-1.5 text-xs text-foreground-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/city/${slugCity(locality)}`} className="hover:text-foreground">{locality.cityName}</Link>
        <span>/</span>
        <span className="text-foreground">{locality.name}</span>
      </p>
      <h1 className="flex flex-wrap items-center gap-2 font-display text-xl font-bold text-foreground sm:text-2xl">
        <MapPin className="h-5 w-5 text-primary-600" /> {locality.name}, {locality.cityName}
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">{locality.propertyCount} active listings in this locality</p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Properties for Sale ({forSale.length})</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/buy?city=${encodeURIComponent(locality.cityName)}&locality=${encodeURIComponent(locality.name)}`}>View all</Link>
              </Button>
            </div>
            {forSale.length === 0 ? (
              <EmptyNote text="No active sale listings here yet." />
            ) : (
              <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {forSale.slice(0, 4).map((property) => (
                  <RevealItem key={property.id}>
                    <PropertyCard property={property} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Properties for Rent ({forRent.length})</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/rent?city=${encodeURIComponent(locality.cityName)}&locality=${encodeURIComponent(locality.name)}`}>View all</Link>
              </Button>
            </div>
            {forRent.length === 0 ? (
              <EmptyNote text="No active rental listings here yet." />
            ) : (
              <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {forRent.slice(0, 4).map((property) => (
                  <RevealItem key={property.id}>
                    <PropertyCard property={property} />
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </section>

          {projects.length > 0 && (
            <section>
              <SectionHeading title="Popular Projects" description={`New developments in ${locality.name}`} />
              <RevealGroup className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {projects.map((project) => (
                  <RevealItem key={project.id}>
                    <ProjectCard project={project} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          )}

          <section className="rounded-2xl border border-dashed border-border-subtle bg-surface-muted p-5 text-sm text-foreground-muted">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <Info className="h-4 w-4" /> Schools, hospitals &amp; connectivity
            </p>
            <p className="mt-1">Detailed nearby-infrastructure data for {locality.name} is being verified and will be added soon.</p>
          </section>
        </div>

        <div className="space-y-6">
          <LocalityInsightsCard locality={locality} />

          {nearby.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Nearby Localities</p>
              <div className="space-y-3">
                {nearby.map((item) => (
                  <LocalityCard key={item.id} locality={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyNote({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border-subtle bg-surface-muted px-4 py-6 text-sm text-foreground-muted">
      <FolderKanban className="h-4 w-4" /> {text}
    </div>
  );
}

function slugCity(locality) {
  return locality.cityId;
}
