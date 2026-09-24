"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { TrustBadges } from "@/components/site/property/trust-badges";
import { useSite } from "@/components/site/providers/site-provider";
import { formatArea, formatPrice, formatPricePerSqft } from "@/lib/site/format";
import { derivePossession } from "@/lib/site/derived";

const ROWS = [
  { label: "Price", render: (p) => formatPrice(p) },
  { label: "Price / sq.ft", render: (p) => formatPricePerSqft(p) ?? "—" },
  { label: "Area", render: (p) => formatArea(p) ?? "—" },
  { label: "BHK", render: (p) => (p.bedrooms ? `${p.bedrooms} BHK` : "—") },
  { label: "Bathrooms", render: (p) => p.bathrooms ?? "—" },
  { label: "Status", render: (p) => derivePossession(p) },
  { label: "Furnishing", render: (p) => p.furnishing ?? "—" },
  { label: "Parking", render: (p) => (p.parking ? "Available" : "Not available") },
  { label: "Facing", render: (p) => p.facing ?? "—" },
  { label: "Floor", render: (p) => (p.floor ? `${p.floor} of ${p.totalFloors}` : "—") },
  { label: "Seller Type", render: (p) => p.sellerType },
  { label: "RERA", render: (p) => (p.rera ? p.rera : "Not applicable") },
  { label: "Location", render: (p) => `${p.location.locality}, ${p.location.city}` },
];

export function CompareTable({ properties }) {
  const { toggleCompare } = useSite();

  function differs(row) {
    const values = properties.map((p) => String(row.render(p)));
    return new Set(values).size > 1;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface shadow-card">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-border-subtle p-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Attribute
            </th>
            {properties.map((property) => (
              <th key={property.id} className="border-b border-border-subtle p-4 text-left align-top">
                <div className="relative w-48">
                  <button
                    onClick={() => toggleCompare(property.id)}
                    className="absolute -right-1 -top-1 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-foreground-muted shadow-card hover:text-error-600"
                    aria-label="Remove from compare"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <Link href={`/property/${property.slug}`} className="block">
                    <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg">
                      <PropertyImage src={property.images[0]} alt={property.title} />
                    </div>
                    <p className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary-600">
                      {property.bedrooms ? `${property.bedrooms} BHK ` : ""}
                      {property.type}
                    </p>
                  </Link>
                  <div className="mt-1.5">
                    <TrustBadges property={property} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className={differs(row) ? "bg-primary-50/40 dark:bg-primary-500/5" : ""}>
              <td className="border-b border-border-subtle p-4 text-xs font-semibold text-foreground-muted">{row.label}</td>
              {properties.map((property) => (
                <td key={property.id} className="border-b border-border-subtle p-4 text-foreground">
                  {row.render(property)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
