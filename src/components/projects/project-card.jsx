"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Layers, MapPin, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RowActions } from "@/components/common/row-actions";
import { PropertyImage } from "@/components/common/property-image";
import { PROJECT_STATUSES } from "@/schemas/projectSchema";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function ProjectCard({ project, onEdit, onDelete, onStatusChange }) {
  const router = useRouter();
  const soldPercent = project.totalUnits > 0 ? Math.round((project.soldUnits / project.totalUnits) * 100) : 0;

  return (
    <Card hover className="animate-slide-up overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <Link href={`/admin/projects/${project.id}`}>
          <PropertyImage src={project.images[0]} alt={project.projectName} />
        </Link>
        <StatusBadge status={project.status} className="absolute left-3 top-3" />
        <div className="absolute right-2 top-2 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-navy-950/60">
          <RowActions
            actions={[
              { label: "View", icon: Eye, onClick: () => router.push(`/admin/projects/${project.id}`) },
              { label: "Edit", icon: Pencil, onClick: () => onEdit(project) },
              { label: "Delete", icon: Trash2, destructive: true, separatorBefore: true, onClick: () => onDelete(project) },
            ]}
          />
        </div>
      </div>

      <CardContent className="space-y-3">
        <div>
          <Link href={`/admin/projects/${project.id}`}>
            <p className="truncate font-display text-base font-semibold text-foreground hover:text-primary-600">
              {project.projectName}
            </p>
          </Link>
          <p className="truncate text-xs text-foreground-muted">{project.developer}</p>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {project.locality}, {project.city}
        </p>

        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-bold text-primary-700 dark:text-primary-400">
            {formatCurrency(project.startingPrice)}
            <span className="ml-1 text-sm font-normal text-foreground-muted">– {formatCurrency(project.priceRangeMax)}</span>
          </p>
          <Badge variant="primary">
            <Layers className="h-3 w-3" />
            {project.projectType}
          </Badge>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-foreground-muted">
              {project.soldUnits} of {project.totalUnits} units sold
            </span>
            <span className="font-semibold text-foreground">{soldPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className={cn("h-full rounded-full bg-primary-600", soldPercent >= 90 && "bg-success-600")}
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
          <p className="text-xs text-foreground-muted">Possession {formatDate(project.possessionDate)}</p>
          <Select value={project.status} onValueChange={(value) => onStatusChange(project.id, value)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
