"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { formatIndianCurrency } from "@/lib/site/format";
import { cn } from "@/lib/utils";

// Google's free "Embed a map" iframe (maps.google.com/maps?...&output=embed)
// needs no API key, unlike the Maps JavaScript/Embed APIs — but being a
// cross-origin iframe, the page can't draw custom per-property pins on it or
// listen for clicks inside it. So the real map handles "where", and this
// locality list (grouped exactly like the old pin-cluster map did) handles
// "which one, and let me filter to it" — same outcome, no JS API needed.
function buildEmbedSrc(query, zoom) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
}

export function ResultsMap({ properties, onFocusLocality }) {
  const [focusedKey, setFocusedKey] = useState(null);

  const clusters = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      const key = `${p.location.locality}, ${p.location.city}`;
      if (!map.has(key)) {
        map.set(key, { key, locality: p.location.locality, city: p.location.city, items: [] });
      }
      map.get(key).items.push(p);
    });
    return [...map.values()]
      .map((cluster) => {
        const prices = cluster.items.map((p) => p.price);
        return { ...cluster, minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
      })
      .sort((a, b) => b.items.length - a.items.length);
  }, [properties]);

  const focused = clusters.find((c) => c.key === focusedKey) ?? null;

  const { embedSrc, scopeLabel } = useMemo(() => {
    if (focused) {
      return {
        embedSrc: buildEmbedSrc(`${focused.locality}, ${focused.city}, India`, 14),
        scopeLabel: `${focused.locality}, ${focused.city}`,
      };
    }
    const cities = new Set(properties.map((p) => p.location.city));
    if (cities.size === 1) {
      const [city] = cities;
      return { embedSrc: buildEmbedSrc(`${city}, India`, 11), scopeLabel: city };
    }
    return { embedSrc: buildEmbedSrc("India", 5), scopeLabel: "across India" };
  }, [focused, properties]);

  return (
    <div className="relative flex h-[560px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-navy-50 dark:bg-navy-950 lg:h-full lg:min-h-[560px]">
      <div className="relative flex-1">
        <iframe
          key={embedSrc}
          src={embedSrc}
          title={`Map of properties ${scopeLabel}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <p className="absolute right-3 top-3 z-10 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground-muted shadow-card">
          {properties.length} {properties.length === 1 ? "property" : "properties"} {scopeLabel}
        </p>

        {focused && (
          <button
            type="button"
            onClick={() => setFocusedKey(null)}
            className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-foreground shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <MapPin className="h-3 w-3" /> Back to all localities
          </button>
        )}
      </div>

      <div className="max-h-56 shrink-0 overflow-y-auto border-t border-border-subtle bg-surface">
        {clusters.map((cluster) => {
          const isFocused = cluster.key === focusedKey;
          return (
            <div
              key={cluster.key}
              className={cn(
                "flex items-center gap-2.5 border-b border-border-subtle px-3 py-2 last:border-b-0",
                isFocused && "bg-primary-50 dark:bg-primary-500/10"
              )}
            >
              <button
                type="button"
                onClick={() => setFocusedKey(isFocused ? null : cluster.key)}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-md"
              >
                <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                  <PropertyImage src={cluster.items[0].images[0]} alt={cluster.locality} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {cluster.locality}, {cluster.city}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {cluster.items.length} {cluster.items.length === 1 ? "listing" : "listings"} ·{" "}
                    {formatIndianCurrency(cluster.minPrice)}
                    {cluster.items.length > 1 && `–${formatIndianCurrency(cluster.maxPrice)}`}
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => onFocusLocality?.(cluster.locality, cluster.city)}
                title={`Filter results to ${cluster.locality}`}
                className="shrink-0 rounded-full p-1.5 text-foreground-muted hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
