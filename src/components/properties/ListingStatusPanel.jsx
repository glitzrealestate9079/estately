"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { STATUS_STYLES, DEFAULT_STATUS_STYLE } from "@/lib/constants";
import { LISTING_STATUS_META } from "@/lib/listing-status";
import { cn } from "@/lib/utils";

// "default" here means "use the Button component's own default look"
// (variant="primary"), so it's mapped to undefined rather than a literal
// Button variant name.
function toButtonVariant(variant) {
  return variant === "default" ? undefined : variant;
}

// Local, self-contained pill that replicates <StatusBadge /> styling rather
// than reusing that component: StatusBadge is shared with Leads, Site Visits
// and Subscriptions, which each have their own status vocabulary, so it is
// left untouched.
export function ListingStatusPanel({ property }) {
  const [status, setStatus] = useState((property.status || "").toLowerCase());
  const meta = LISTING_STATUS_META[status];
  const style = STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;

  if (!meta) return null;

  function handleAction(action) {
    const nextMeta = LISTING_STATUS_META[action.target];
    setStatus(action.target);
    toast.success(`"${property.title}" moved to ${nextMeta?.label ?? action.target}`);
  }

  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-border-subtle bg-surface-muted/40 px-3.5 py-3 sm:items-end">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
          style
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        {meta.label}
      </span>
      <p className="max-w-xs text-left text-xs text-foreground-muted sm:text-right">{meta.description}</p>
      {meta.actions?.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {meta.actions.map((action) => (
            <Button
              key={action.target}
              type="button"
              size="sm"
              variant={toButtonVariant(action.variant)}
              onClick={() => handleAction(action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
