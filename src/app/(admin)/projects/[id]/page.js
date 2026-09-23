import { notFound } from "next/navigation";
import { Building2, Home, Layers, MapPin, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { PropertyImage } from "@/components/common/property-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { getProjectById, PROJECTS } from "@/data/projects";
import { formatCurrency, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = getProjectById(id);
  return { title: project ? project.projectName : "Project" };
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2.5">
      <Icon className="h-4 w-4 text-foreground-muted" />
      <div>
        <p className="text-xs text-foreground-muted">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  const soldPercent = Math.round((project.soldUnits / project.totalUnits) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.projectName}
        subtitle={`${project.id} · by ${project.developer} · Listed ${formatDate(project.createdAt)}`}
        actions={<StatusBadge status={project.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="grid grid-cols-2 gap-1 p-1 sm:grid-cols-4">
              {project.images.map((src, i) => (
                <div
                  key={i}
                  className={
                    i === 0
                      ? "relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-lg sm:aspect-auto"
                      : "relative aspect-square overflow-hidden rounded-lg"
                  }
                >
                  <PropertyImage src={src} alt={`${project.projectName} ${i + 1}`} />
                </div>
              ))}
            </div>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">
                  <Layers className="h-3 w-3" />
                  {project.projectType}
                </Badge>
                {project.reraNumber && (
                  <Badge variant="success">
                    <ShieldCheck className="h-3 w-3" /> RERA Registered
                  </Badge>
                )}
              </div>
              <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
                <MapPin className="h-4 w-4" />
                {project.address}
              </p>
              <p className="mt-3 font-display text-2xl font-bold text-primary-700 dark:text-primary-400">
                {formatCurrency(project.startingPrice)}
                <span className="ml-1 text-base font-normal text-foreground-muted">
                  – {formatCurrency(project.priceRangeMax)}
                </span>
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={Building2} label="Total Units" value={project.totalUnits} />
                <Stat icon={Home} label="Available" value={project.availableUnits} />
                <Stat icon={Home} label="Sold" value={project.soldUnits} />
                <Stat icon={Building2} label="Possession" value={formatDate(project.possessionDate)} />
              </div>

              <h3 className="mb-2 mt-6 font-display text-base font-semibold text-foreground">About this project</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{project.description}</p>

              <h3 className="mb-2 mt-6 font-display text-base font-semibold text-foreground">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {project.amenities.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                Inventory Status
              </p>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-foreground-muted">{project.soldUnits} of {project.totalUnits} units sold</span>
                <span className="font-semibold text-foreground">{soldPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className={`h-full rounded-full ${soldPercent >= 90 ? "bg-success-600" : "bg-primary-600"}`}
                  style={{ width: `${soldPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                Developer
              </p>
              <p className="text-sm font-medium text-foreground">{project.developer}</p>
              {project.reraNumber && (
                <>
                  <p className="mt-3 text-xs text-foreground-muted">RERA Number</p>
                  <p className="text-sm font-medium text-foreground">{project.reraNumber}</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
