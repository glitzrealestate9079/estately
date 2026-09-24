"use client";

import Link from "next/link";
import { BellRing, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useSite } from "@/components/site/providers/site-provider";
import { getCategory } from "@/lib/site/categories";
import { formatDate } from "@/lib/utils";

function buildHref(search) {
  const params = new URLSearchParams();
  Object.entries(search.filters ?? {}).forEach(([key, value]) => {
    if (value && value !== "any" && value !== false) params.set(key, value);
  });
  const category = getCategory(search.category);
  return `${category.href}?${params.toString()}`;
}

export default function SavedSearchesPage() {
  const { savedSearches, mounted, removeSavedSearch, updateSavedSearchAlert } = useSite();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground sm:text-2xl">
        <BellRing className="h-5 w-5 text-primary-600" /> Saved Searches
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">Get notified the moment a new property matches your criteria.</p>

      <div className="mt-6 space-y-3">
        {!mounted ? null : savedSearches.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No saved searches yet"
            description={'Use "Save Search" on any results page to get alerts for new matching properties.'}
            action={
              <Button asChild className="mt-2">
                <Link href="/buy">Search Properties</Link>
              </Button>
            }
          />
        ) : (
          savedSearches.map((search) => (
            <div key={search.id} className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link href={buildHref(search)} className="truncate font-display text-sm font-semibold text-foreground hover:text-primary-600">
                  {search.label}
                </Link>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  {search.resultCount} results · Saved {formatDate(search.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={search.alertFrequency} onValueChange={(value) => updateSavedSearchAlert(search.id, value)}>
                  <SelectTrigger className="h-9 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground-muted hover:text-error-600"
                  onClick={() => {
                    removeSavedSearch(search.id);
                    toast.success("Saved search removed");
                  }}
                  aria-label="Delete saved search"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
