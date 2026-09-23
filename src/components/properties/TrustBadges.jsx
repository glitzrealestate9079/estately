import { Clock3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SELLER_TYPE_LABELS = {
  Owner: "Owner",
  Agent: "Certified Agent",
  "Builder/Developer": "Developer",
};

// Distinct, never-combined trust signals for a property: each badge answers a
// different buyer question (is it verified? RERA registered? who's selling?
// is it promoted? is it new?), so they render independently and never merge
// into a single compound badge.
export function TrustBadges({ property, className }) {
  if (!property) return null;

  const sellerLabel = SELLER_TYPE_LABELS[property.sellerType];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {property.verified && (
        <Badge variant="success">
          <ShieldCheck className="h-3 w-3" /> Verified Property
        </Badge>
      )}
      {property.rera && <Badge variant="primary">RERA</Badge>}
      {sellerLabel && <Badge variant="default">{sellerLabel}</Badge>}
      {property.featured && <Badge variant="featured">Featured</Badge>}
      {property.recentlyPosted && (
        <Badge variant="warning">
          <Clock3 className="h-3 w-3" /> Recently Posted
        </Badge>
      )}
    </div>
  );
}
