"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { PropertyCard } from "@/components/site/property/property-card";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useSite } from "@/components/site/providers/site-provider";
import { PROPERTIES } from "@/data/properties";

export default function SavedPage() {
  const { savedIds, mounted } = useSite();
  const properties = mounted ? savedIds.map((id) => PROPERTIES.find((p) => p.id === id)).filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground sm:text-2xl">
        <Heart className="h-5 w-5 text-error-600" /> Saved Properties
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {mounted ? `${properties.length} ${properties.length === 1 ? "property" : "properties"} saved` : "Loading your shortlist…"}
      </p>

      <div className="mt-6">
        {!mounted ? null : properties.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            description="Tap the heart icon on any property card to shortlist it here — it's instant and works without signing in."
            action={
              <Button asChild className="mt-2">
                <Link href="/buy">Start Browsing</Link>
              </Button>
            }
          />
        ) : (
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <RevealItem key={property.id}>
                <PropertyCard property={property} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
