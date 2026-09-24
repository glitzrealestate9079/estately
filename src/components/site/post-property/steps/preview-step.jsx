"use client";

import { useFormContext } from "react-hook-form";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/site/property/property-card";
import { buildListingFromWizard } from "@/lib/site/build-listing";
import { useSite } from "@/components/site/providers/site-provider";
import { formatArea, formatPrice, formatPricePerSqft } from "@/lib/site/format";

export function PreviewStep() {
  const { watch } = useFormContext();
  const { auth } = useSite();
  const values = watch();
  const preview = { id: "preview", ...buildListingFromWizard(values, auth.user), status: "Active", createdAt: new Date().toISOString().slice(0, 10) };

  return (
    <div>
      <p className="mb-4 flex items-center gap-1.5 text-sm text-foreground-muted">
        <Eye className="h-4 w-4" /> This is exactly how buyers will see your listing.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <PropertyCard property={preview} />

        <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface p-5">
          <div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="primary">{values.type}</Badge>
              <Badge>{values.listingType === "Sale" ? "For Sale" : values.listingType === "Rent" ? "For Rent" : "PG"}</Badge>
              {values.reraNumber && <Badge>RERA</Badge>}
            </div>
            <h3 className="mt-2 font-display text-lg font-bold text-foreground">{values.title || "Untitled listing"}</h3>
            <p className="text-sm text-foreground-muted">{values.locality}, {values.city}</p>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(preview)}</span>
            {formatPricePerSqft(preview) && <span className="text-xs text-foreground-muted">{formatPricePerSqft(preview)}</span>}
            {formatArea(preview) && <span className="text-xs text-foreground-muted">· {formatArea(preview)}</span>}
          </div>

          <p className="text-sm leading-relaxed text-foreground-muted">{values.description || "No description added yet."}</p>

          {values.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {values.amenities.map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
            </div>
          )}

          <p className="text-xs text-foreground-muted">{values.images?.length ?? 0} photos attached</p>
        </div>
      </div>
    </div>
  );
}
