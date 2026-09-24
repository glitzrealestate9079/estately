import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyResults({ onClearOne, onReset, hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border-subtle bg-surface-muted px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-foreground-muted">
        <SearchX className="h-6 w-6" />
      </span>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-foreground">No exact matches found</p>
        <p className="mx-auto max-w-sm text-sm text-foreground-muted">
          Try increasing your budget, expanding the location, removing a filter, or checking nearby localities.
        </p>
      </div>
      {hasFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {onClearOne && (
            <Button variant="outline" size="sm" onClick={onClearOne}>
              Clear one filter
            </Button>
          )}
          <Button size="sm" onClick={onReset}>
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
}
