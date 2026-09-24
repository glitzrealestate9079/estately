import { CheckCircle2, Circle, Clock3, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

function StatusIcon({ state }) {
  if (state === true || state === "Verified") {
    return <CheckCircle2 className="h-4 w-4 shrink-0 text-success-600 dark:text-success-500" />;
  }
  if (state === "Rejected") {
    return <XCircle className="h-4 w-4 shrink-0 text-error-600 dark:text-error-500" />;
  }
  if (state === "Pending") {
    return <Clock3 className="h-4 w-4 shrink-0 text-warning-600 dark:text-warning-500" />;
  }
  return <Circle className="h-4 w-4 shrink-0 text-foreground-muted" />;
}

function Row({ label, state, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border-subtle py-2.5 text-sm last:border-0">
      <span className="flex items-center gap-2 text-foreground-muted">
        <StatusIcon state={state} />
        {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

// Read-only verification summary for the property detail page. Phone and
// document status stay visible here to admins only — the public-facing
// TrustBadges component decides what a site visitor actually sees.
export function VerificationChecklist({ property }) {
  if (!property) return null;

  const reraIconState =
    property.reraStatus === "Registered" ? "Verified" : property.reraStatus === "Pending" ? "Pending" : undefined;

  // Staleness: the verification is only good for VERIFICATION_VALIDITY_DAYS
  // (see propertySchema.js) — once verifiedUntil is in the past, flag it so
  // admins know this listing needs re-verifying even though it once passed.
  const isStale = Boolean(property.verifiedUntil) && new Date(property.verifiedUntil) < new Date();

  return (
    <div>
      <Row label="Phone Verified" state={property.phoneVerified} value={property.phoneVerified ? "Verified" : "Not Verified"} />
      <Row label="Identity Verification" state={property.identityVerified} value={property.identityVerified || "Pending"} />
      <Row label="Property Verification" state={property.propertyVerified} value={property.propertyVerified || "Pending"} />
      {property.reraAuthority && <Row label="RERA Authority" state={undefined} value={property.reraAuthority} />}
      {property.reraStatus && <Row label="RERA Status" state={reraIconState} value={property.reraStatus} />}
      {property.verifiedUntil && (
        <Row
          label="Verification Valid Until"
          state={isStale ? "Rejected" : "Verified"}
          value={
            <span className="inline-flex items-center gap-1.5">
              {formatDate(property.verifiedUntil)}
              {isStale && (
                <span className="rounded-full bg-error-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-error-600 dark:bg-error-500/10 dark:text-error-500">
                  Expired
                </span>
              )}
            </span>
          }
        />
      )}
    </div>
  );
}
