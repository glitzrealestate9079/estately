"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import { CompareTable } from "@/components/site/compare/compare-table";
import { EmptyResults } from "@/components/site/search/empty-results";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";
import { PROPERTIES } from "@/data/properties";

export default function ComparePage() {
  const { compareIds, mounted, clearCompare } = useSite();
  const properties = mounted ? compareIds.map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground sm:text-2xl">
            <Scale className="h-5 w-5 text-primary-600" /> Compare Properties
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">Comparing up to 4 properties side by side — differences are highlighted.</p>
        </div>
        {properties.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearCompare}>
            Clear all
          </Button>
        )}
      </div>

      {!mounted ? null : properties.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface">
          <EmptyResults hasFilters={false} onReset={() => {}} />
          <div className="border-t border-border-subtle p-6 text-center">
            <p className="mb-3 text-sm text-foreground-muted">
              Tap &quot;Compare&quot; on any property card to add it here — compare up to 4 at once.
            </p>
            <Button asChild>
              <Link href="/buy">Browse Properties</Link>
            </Button>
          </div>
        </div>
      ) : (
        <CompareTable properties={properties} />
      )}
    </div>
  );
}
