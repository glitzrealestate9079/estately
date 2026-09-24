import { X } from "lucide-react";
import { formatIndianCurrency } from "@/lib/site/format";

export function SearchChips({ filters, removeFilter, resetFilters }) {
  const chips = buildChips(filters);
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeFilter(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-400"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      {chips.length > 1 && (
        <button onClick={resetFilters} className="text-xs font-medium text-foreground-muted underline-offset-2 hover:underline">
          Clear all
        </button>
      )}
    </div>
  );
}

function buildChips(filters) {
  const chips = [];
  if (filters.city) chips.push({ key: "city", label: filters.city });
  if (filters.locality) chips.push({ key: "locality", label: filters.locality });
  if (filters.propertyType !== "any") chips.push({ key: "propertyType", label: filters.propertyType });
  if (filters.bhk !== "any") chips.push({ key: "bhk", label: `${filters.bhk}${Number(filters.bhk) >= 4 ? "+" : ""} BHK` });
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? formatIndianCurrency(Number(filters.minPrice)) : "₹0";
    const max = filters.maxPrice ? formatIndianCurrency(Number(filters.maxPrice)) : "No limit";
    chips.push({ key: "minPrice", label: `${min} – ${max}` });
  }
  if (filters.minArea || filters.maxArea) {
    chips.push({ key: "minArea", label: `${filters.minArea || "0"} – ${filters.maxArea || "∞"} sq.ft` });
  }
  if (filters.furnishing !== "any") chips.push({ key: "furnishing", label: filters.furnishing });
  if (filters.possession !== "any") chips.push({ key: "possession", label: filters.possession });
  if (filters.ownerOnly) chips.push({ key: "ownerOnly", label: "Owner Only" });
  if (filters.verified) chips.push({ key: "verified", label: "Verified" });
  if (filters.rera) chips.push({ key: "rera", label: "RERA" });
  if (filters.parking) chips.push({ key: "parking", label: "Parking" });
  if (filters.gender !== "any") chips.push({ key: "gender", label: filters.gender });
  if (filters.roomType !== "any") chips.push({ key: "roomType", label: filters.roomType });
  if (filters.commercialCategory !== "any") chips.push({ key: "commercialCategory", label: filters.commercialCategory });
  return chips;
}
