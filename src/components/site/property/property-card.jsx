"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, Camera, Car, Heart, MapPin, Ruler, Scale, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PropertyImage } from "@/components/common/property-image";
import { TrustBadges } from "@/components/site/property/trust-badges";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";
import { formatArea, formatPrice, formatPricePerSqft, timeAgoLabel } from "@/lib/site/format";
import { derivePossession, derivePgGender, derivePgRoomType } from "@/lib/site/derived";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, className }) {
  const { isSaved, toggleSave, isComparing, toggleCompare, maxCompare, mounted } = useSite();
  const [imageIndex] = useState(0);
  const saved = mounted && isSaved(property.id);
  const comparing = mounted && isComparing(property.id);
  const isPg = property.listingType === "PG";

  function handleSave(e) {
    e.preventDefault();
    toggleSave(property.id);
    toast.success(saved ? "Removed from saved" : "Saved to your shortlist", {
      description: !saved ? "Find it anytime under Saved." : undefined,
    });
  }

  function handleCompare(e) {
    e.preventDefault();
    const result = toggleCompare(property.id);
    if (result.atLimit) {
      toast.error(`You can compare up to ${maxCompare} properties at a time`);
      return;
    }
    if (result.didAdd) toast.success("Added to compare");
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }} className={className}>
      <div className="group h-full overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-card transition-shadow duration-300 hover:shadow-card-hover">
        <Link href={`/property/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden">
          <PropertyImage
            src={property.images[imageIndex]}
            alt={property.title}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            <div className="flex flex-col gap-1.5">
              {property.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-featured-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  <Sparkles className="h-2.5 w-2.5" /> Featured
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              aria-label={saved ? "Remove from saved" : "Save property"}
              aria-pressed={saved}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors",
                saved ? "bg-error-600 text-white" : "bg-white/85 text-navy-700 hover:bg-white"
              )}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
          </div>
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
              <Camera className="h-3 w-3" /> {property.images.length} Photos
            </span>
            <button
              onClick={handleCompare}
              aria-pressed={comparing}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors",
                comparing ? "bg-primary-600 text-white" : "bg-black/45 text-white hover:bg-black/60"
              )}
            >
              <Scale className="h-3 w-3" /> {comparing ? "Comparing" : "Compare"}
            </button>
          </div>
        </Link>

        <div className="flex flex-col gap-2.5 p-4">
          <Link href={`/property/${property.slug}`}>
            <p className="truncate font-display text-sm font-semibold text-foreground group-hover:text-primary-600 sm:text-base">
              {property.bedrooms ? `${property.bedrooms} BHK ${property.type}` : property.type}
            </p>
          </Link>

          <div className="flex items-baseline gap-2">
            <p className="font-display text-lg font-bold text-primary-700 dark:text-primary-400">
              {formatPrice(property)}
            </p>
            {formatPricePerSqft(property) && (
              <p className="text-xs text-foreground-muted">{formatPricePerSqft(property)}</p>
            )}
          </div>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground-muted">
            {property.bedrooms && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms} Bed
              </span>
            )}
            {formatArea(property) && (
              <span className="inline-flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" /> {formatArea(property)}
              </span>
            )}
            {property.parking && (
              <span className="inline-flex items-center gap-1">
                <Car className="h-3.5 w-3.5" /> Parking
              </span>
            )}
            <span className="text-foreground-muted/70">•</span>
            <span>
              {isPg ? `${derivePgGender(property)} · ${derivePgRoomType(property)}` : derivePossession(property)}
            </span>
          </p>

          <p className="flex items-center gap-1.5 truncate text-xs text-foreground-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {property.location.locality}, {property.location.city}
          </p>

          <TrustBadges property={property} />

          <div className="flex items-center justify-between border-t border-border-subtle pt-3">
            <span className="text-[11px] text-foreground-muted">{timeAgoLabel(property.createdAt)}</span>
            <Button asChild size="sm" variant="outline" className="h-8 px-3 text-xs">
              <Link href={`/property/${property.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
