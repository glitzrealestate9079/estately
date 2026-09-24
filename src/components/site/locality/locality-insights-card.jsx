import { Info, TrendingUp } from "lucide-react";

export function LocalityInsightsCard({ locality }) {
  const intel = locality?.intel;

  if (!intel) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-surface-muted p-5 text-sm text-foreground-muted">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <Info className="h-4 w-4" /> Locality data not yet available
        </p>
        <p className="mt-1">We don&apos;t have enough verified transactions in {locality?.name ?? "this area"} yet to show reliable price trends.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
      <p className="mb-4 flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
        <TrendingUp className="h-4 w-4 text-primary-600" /> Price Intelligence — {locality.name}
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-foreground-muted">Avg. Price</p>
          <p className="font-display text-base font-bold text-foreground">₹{new Intl.NumberFormat("en-IN").format(intel.avgPricePerSqft)}/sq.ft</p>
        </div>
        <div>
          <p className="text-xs text-foreground-muted">Rent Range</p>
          <p className="font-display text-base font-bold text-foreground">
            ₹{new Intl.NumberFormat("en-IN").format(intel.rentRangeMin)}–{new Intl.NumberFormat("en-IN").format(intel.rentRangeMax)}
          </p>
        </div>
        <div>
          <p className="text-xs text-foreground-muted">Listings Tracked</p>
          <p className="font-display text-base font-bold text-foreground">{intel.propertyCount}</p>
        </div>
      </div>
      <p className="mt-4 border-t border-border-subtle pt-3 text-[11px] text-foreground-muted">
        Data period: {intel.dataPeriod} · Last updated {intel.lastUpdated}
      </p>
    </div>
  );
}
