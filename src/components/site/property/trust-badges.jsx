import { ShieldCheck, BadgeCheck, Building2, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

// Trust badges are deliberately kept as separate, small concepts — per the
// product spec, "Verified", "RERA" and seller-type are different claims and
// must never be visually merged into one generic green checkmark.
const SELLER_ICON = {
  Owner: UserRound,
  Agent: BadgeCheck,
  "Builder/Developer": Building2,
};

export function TrustBadges({ property, size = "sm", className }) {
  const SellerIcon = SELLER_ICON[property.sellerType] ?? UserRound;
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {property.verified && (
        <span className={cn("inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 font-semibold text-success-700 ring-1 ring-inset ring-success-600/20 dark:bg-success-500/10 dark:text-success-500", textSize)}>
          <ShieldCheck className="h-3 w-3" /> Verified
        </span>
      )}
      {property.rera && (
        <span className={cn("inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 font-semibold text-primary-700 ring-1 ring-inset ring-primary-600/20 dark:bg-primary-500/10 dark:text-primary-400", textSize)}>
          RERA
        </span>
      )}
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 font-semibold text-foreground-muted ring-1 ring-inset ring-border-subtle", textSize)}>
        <SellerIcon className="h-3 w-3" /> {property.sellerType === "Builder/Developer" ? "Builder" : property.sellerType}
      </span>
    </div>
  );
}
