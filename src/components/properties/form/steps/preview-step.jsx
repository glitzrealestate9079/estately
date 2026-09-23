"use client";

import { useFormContext } from "react-hook-form";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { formatAreaWithUnit } from "@/lib/area-units";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-2.5 text-sm last:border-0">
      <span className="text-foreground-muted">{label}</span>
      <span className="font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

export function PreviewStep() {
  const { watch } = useFormContext();
  const values = watch();

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-border-subtle">
        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-900">
          {values.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={values.images[0].url} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <p className="text-sm text-foreground-muted">No image uploaded</p>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{values.title || "Untitled property"}</h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-foreground-muted">
                <MapPin className="h-3.5 w-3.5" />
                {[values.locality, values.city, values.state].filter(Boolean).join(", ") || "Location not set"}
              </p>
            </div>
            <Badge variant="primary">{values.verificationStatus}</Badge>
          </div>

          <p className="font-display text-xl font-bold text-primary-700 dark:text-primary-400">
            {values.price ? formatCurrency(Number(values.price)) : "Price not set"}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
            {values.bedrooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" /> {values.bedrooms} Beds
              </span>
            )}
            {values.bathrooms && (
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" /> {values.bathrooms} Baths
              </span>
            )}
            {values.carpetArea && (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4" /> {formatAreaWithUnit(values.carpetArea, values.areaUnit || "sqft")}
              </span>
            )}
          </div>

          {values.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {values.amenities.map((a) => (
                <Badge key={a} variant="default">
                  {a}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Owner Information</p>
        <Row label="Owner Name" value={values.ownerName} />
        <Row label="Seller Type" value={values.sellerType} />
        <Row label="Phone" value={values.ownerPhone} />
        <Row label="Email" value={values.ownerEmail} />
        <Row label="RERA Number" value={values.reraNumber} />
        <Row label="RERA Authority" value={values.reraAuthority} />
        <Row label="RERA Status" value={values.reraStatus} />
        <Row label="Phone Verified" value={values.phoneVerified ? "Yes" : "No"} />
        <Row label="Identity Verification" value={values.identityVerified} />
        <Row label="Property Verification" value={values.propertyVerified} />
      </div>
    </div>
  );
}
