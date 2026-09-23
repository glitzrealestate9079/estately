"use client";

import { ChevronRight, MapPin, Building2, Home, Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/common/row-actions";
import { cn, formatNumber } from "@/lib/utils";

const LEVEL_ICON = [MapPin, Building2, Home];
const LEVEL_ICON_COLOR = ["text-primary-600", "text-accent-600", "text-foreground-muted"];

// level: 0 = state, 1 = city, 2 = locality
export function LocationRow({
  level,
  name,
  propertyCount,
  meta,
  expanded,
  hasChildren,
  onToggle,
  onEdit,
  onEditSeo,
  onDelete,
}) {
  const Icon = LEVEL_ICON[level];

  return (
    <div
      className="flex items-center justify-between gap-3 border-b border-border-subtle py-3 pr-3 last:border-b-0 hover:bg-surface-muted/60"
      style={{ paddingLeft: `${1 + level * 1.75}rem` }}
    >
      <button
        type="button"
        onClick={hasChildren ? onToggle : undefined}
        disabled={!hasChildren}
        className={cn(
          "flex flex-1 items-center gap-2.5 text-left focus-visible:outline-none",
          hasChildren ? "cursor-pointer" : "cursor-default"
        )}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-150",
              expanded && "rotate-90"
            )}
          />
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <Icon className={cn("h-4 w-4 shrink-0", LEVEL_ICON_COLOR[level])} />
        <span
          className={cn(
            "truncate text-sm",
            level === 0 && "font-semibold text-foreground",
            level === 1 && "font-medium text-foreground",
            level === 2 && "text-foreground"
          )}
        >
          {name}
        </span>
        {meta && <span className="shrink-0 text-xs text-foreground-muted">{meta}</span>}
      </button>

      <div className="flex shrink-0 items-center gap-3">
        <Badge variant={level === 0 ? "primary" : "default"} className="hidden sm:inline-flex">
          {formatNumber(propertyCount)} properties
        </Badge>
        <span className="text-xs font-semibold text-foreground-muted sm:hidden">
          {formatNumber(propertyCount)}
        </span>
        <RowActions
          actions={[
            { label: "Edit Name", icon: Pencil, onClick: onEdit },
            ...(level === 2 ? [{ label: "Edit SEO", icon: Search, onClick: onEditSeo }] : []),
            { label: "Delete", icon: Trash2, destructive: true, separatorBefore: true, onClick: onDelete },
          ]}
        />
      </div>
    </div>
  );
}
