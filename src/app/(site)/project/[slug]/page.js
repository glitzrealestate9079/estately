import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CalendarClock, FileText, Layers, MapPin, ShieldCheck } from "lucide-react";
import { PropertyGallery } from "@/components/site/property/gallery";
import { ScheduleVisitModal } from "@/components/site/property/schedule-visit-modal";
import { ProjectCard } from "@/components/site/project/project-card";
import { LocalityInsightsCard } from "@/components/site/locality/locality-insights-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/data/projects";
import { getProjectBySlug, getRelatedProjects, getDeveloperByName, getLocalityByName } from "@/lib/site/site-data";
import { formatIndianCurrency, formatMonthYear } from "@/lib/site/format";
import ProjectEnquiry from "@/components/site/project/project-enquiry";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.projectName} by ${project.developer} — ${project.locality}, ${project.city}`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const developer = getDeveloperByName(project.developer);
  const related = getRelatedProjects(project, 3);
  const locality = getLocalityByName(project.city, project.locality);
  const soldPercent = project.totalUnits > 0 ? Math.round((project.soldUnits / project.totalUnits) * 100) : 0;

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <p className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-foreground">New Projects</Link>
          <span>/</span>
          <span className="truncate text-foreground">{project.projectName}</span>
        </p>

        <PropertyGallery images={project.images} title={project.projectName} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />
                <Badge variant="primary">
                  <Layers className="h-3 w-3" /> {project.projectType}
                </Badge>
                {project.reraNumber && (
                  <Badge>
                    <ShieldCheck className="h-3 w-3" /> RERA Registered
                  </Badge>
                )}
              </div>
              <h1 className="mt-3 font-display text-xl font-bold text-foreground sm:text-2xl">{project.projectName}</h1>
              <p className="mt-1 text-sm text-foreground-muted">by {project.developer}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground-muted">
                <MapPin className="h-4 w-4" /> {project.address}
              </p>
              <p className="mt-4 font-display text-2xl font-bold text-primary-700 dark:text-primary-400">
                {formatIndianCurrency(project.startingPrice)} – {formatIndianCurrency(project.priceRangeMax)}
              </p>
            </section>

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatBox label="Total Units" value={project.totalUnits} />
              <StatBox label="Available" value={project.availableUnits} />
              <StatBox label="Possession" value={formatMonthYear(project.possessionDate)} />
              <StatBox label="RERA No." value={project.reraNumber ?? "Applied for"} small />
            </section>

            <section>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-foreground-muted">{project.soldUnits} of {project.totalUnits} units booked</span>
                <span className="font-semibold text-foreground">{soldPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-primary-600" style={{ width: `${soldPercent}%` }} />
              </div>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base font-semibold text-foreground">About {project.projectName}</h2>
              <p className="text-sm leading-relaxed text-foreground-muted">{project.description}</p>
            </section>

            <section>
              <h2 className="mb-3 font-display text-base font-semibold text-foreground">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {project.amenities.map((amenity) => (
                  <Badge key={amenity}>{amenity}</Badge>
                ))}
              </div>
            </section>

            {developer && (
              <section>
                <h2 className="mb-3 font-display text-base font-semibold text-foreground">About the Developer</h2>
                <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">{developer.name}</p>
                      <p className="text-xs text-foreground-muted">Established {developer.establishedYear} · {developer.projectsCount} projects · {developer.city}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{developer.description}</p>
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 font-display text-base font-semibold text-foreground">Locality Insights</h2>
              <LocalityInsightsCard locality={locality} />
            </section>
          </div>

          <div className="space-y-5 lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
              <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Interested in this project?</h3>
              <div className="space-y-2.5">
                <ScheduleVisitModal
                  property={{ title: project.projectName, location: { locality: project.locality, city: project.city } }}
                  trigger={
                    <Button className="w-full gap-1.5">
                      <CalendarClock className="h-4 w-4" /> Schedule Site Visit
                    </Button>
                  }
                />
                <Button variant="outline" className="w-full gap-1.5">
                  <FileText className="h-4 w-4" /> Get Brochure
                </Button>
              </div>
              <div className="mt-4 border-t border-border-subtle pt-4">
                <ProjectEnquiry project={project} />
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <SectionHeading title="Similar projects" description={`More developments in ${project.city}`} />
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.id}>
                  <ProjectCard project={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, small }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className={small ? "text-sm font-semibold text-foreground" : "font-display text-base font-bold text-foreground"}>{value}</p>
    </div>
  );
}
