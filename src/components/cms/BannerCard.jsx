"use client";

import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PropertyImage } from "@/components/common/property-image";
import { cn } from "@/lib/utils";

export function BannerCard({ banner, isFirst, isLast, onToggleStatus, onMoveUp, onMoveDown, onEdit, onDelete }) {
  const isActive = banner.status === "Active";

  return (
    <Card className="animate-slide-up overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <PropertyImage src={banner.image} alt={banner.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-navy-950/10" />
        <span className="absolute left-4 top-4 rounded-full bg-navy-950/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          #{banner.sortOrder}
        </span>
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
          <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-xl">{banner.title}</h3>
          <p className="max-w-md text-sm text-white/85">{banner.subtitle}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-navy-900 shadow-sm">
            {banner.ctaLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle p-4">
        <div className="flex items-center gap-2.5">
          <Switch checked={isActive} onCheckedChange={() => onToggleStatus(banner)} aria-label="Toggle banner status" />
          <span className={cn("text-sm font-medium", isActive ? "text-success-700 dark:text-success-500" : "text-foreground-muted")}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={isFirst}
            onClick={() => onMoveUp(banner)}
            aria-label="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={isLast}
            onClick={() => onMoveDown(banner)}
            aria-label="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(banner)} aria-label="Edit banner">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-error-600 hover:bg-error-50 hover:text-error-700 dark:hover:bg-error-500/10"
            onClick={() => onDelete(banner)}
            aria-label="Delete banner"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
