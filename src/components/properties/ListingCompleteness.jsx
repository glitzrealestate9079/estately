"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Every check reads a field that already exists on the property object —
// nothing here is randomized or fetched, so the same property always yields
// the same completeness score.
const CHECKS = [
  { key: "location", label: "Location added", check: (p) => Boolean(p.location?.locality && p.location?.city) },
  { key: "price", label: "Price set", check: (p) => Number(p.price) > 0 },
  { key: "details", label: "Property details added", check: (p) => Boolean(p.description && p.carpetArea) },
  { key: "photos", label: "5 or more photos uploaded", check: (p) => (p.images?.length ?? 0) >= 5 },
  { key: "floorPlan", label: "Floor plan uploaded", check: (p) => Boolean(p.floorPlan) },
  { key: "amenities", label: "Amenities added", check: (p) => (p.amenities?.length ?? 0) > 0 },
];

export function ListingCompleteness({ property }) {
  if (!property) return null;

  const results = CHECKS.map((item) => ({ ...item, done: item.check(property) }));
  const doneCount = results.filter((item) => item.done).length;
  const percent = Math.round((doneCount / results.length) * 100);
  const firstMissing = results.find((item) => !item.done);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Completeness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-display text-lg font-bold text-foreground">{percent}%</span>
            <span className="text-xs text-foreground-muted">
              {doneCount} of {results.length} complete
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-navy-800">
            <div
              className={cn("h-full rounded-full transition-all", percent === 100 ? "bg-success-500" : "bg-primary-500")}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <ul className="space-y-2">
          {results.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600 dark:text-success-500" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-foreground-muted" />
              )}
              <span className={item.done ? "text-foreground" : "text-foreground-muted"}>{item.label}</span>
            </li>
          ))}
        </ul>

        <p className="border-t border-border-subtle pt-3 text-xs text-foreground-muted">
          {firstMissing
            ? `Add "${firstMissing.label.replace(/ (added|uploaded|set)$/, "")}" to improve this listing's visibility.`
            : "This listing is complete and fully optimized."}
        </p>
      </CardContent>
    </Card>
  );
}
