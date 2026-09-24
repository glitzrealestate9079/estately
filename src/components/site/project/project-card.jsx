import Link from "next/link";
import { Layers, MapPin } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { formatIndianCurrency, formatMonthYear } from "@/lib/site/format";

export function ProjectCard({ project }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <PropertyImage src={project.images[0]} alt={project.projectName} className="transition-transform duration-500 group-hover:scale-105" />
        <StatusBadge status={project.status} className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate font-display text-base font-semibold text-foreground group-hover:text-primary-600">
          {project.projectName}
        </p>
        <p className="truncate text-xs text-foreground-muted">by {project.developer}</p>
        <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {project.locality}, {project.city}
        </p>
        <p className="font-display text-base font-bold text-primary-700 dark:text-primary-400">
          {formatIndianCurrency(project.startingPrice)}
          <span className="ml-1 text-xs font-normal text-foreground-muted">onwards</span>
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3 text-xs">
          <Badge variant="primary">
            <Layers className="h-3 w-3" /> {project.projectType}
          </Badge>
          <span className="text-foreground-muted">Possession {formatMonthYear(project.possessionDate)}</span>
        </div>
      </div>
    </Link>
  );
}
