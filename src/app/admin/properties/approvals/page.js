"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ClipboardCheck, Eye, Flag, MapPin, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PropertyImage } from "@/components/common/property-image";
import { RejectReasonModal } from "@/components/properties/reject-reason-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PENDING_APPROVALS as INITIAL_PENDING } from "@/data/properties";
import { PROPERTY_REPORTS as INITIAL_REPORTS } from "@/data/property-reports";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PropertyApprovalsPage() {
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reports, setReports] = useState(INITIAL_REPORTS);

  function approve(property) {
    setPending((prev) => prev.filter((p) => p.id !== property.id));
    toast.success(`${property.title} approved successfully`);
  }

  function confirmReject(reason) {
    // Persist the reason onto the property record (not just the toast) so it
    // survives past this interaction and can be shown wherever the record is
    // read from later, e.g. ListingStatusPanel on the property detail page.
    const rejectedProperty = { ...rejectTarget, status: "Rejected", rejectionReason: reason };
    setPending((prev) => prev.filter((p) => p.id !== rejectedProperty.id));
    toast.warning(`${rejectedProperty.title} rejected`, {
      description: rejectedProperty.rejectionReason || "No reason provided.",
    });
    setRejectTarget(null);
  }

  const openReports = reports.filter((r) => r.status === "Open");

  function resolveReport(report) {
    setReports((prev) => prev.filter((r) => r.id !== report.id));
    toast.success(`Report on "${report.propertyTitle}" marked resolved`);
  }

  function dismissReport(report) {
    setReports((prev) => prev.filter((r) => r.id !== report.id));
    toast.info(`Report on "${report.propertyTitle}" dismissed`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Approvals"
        subtitle={`${pending.length} listings awaiting review before going live.`}
      />

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="reported" className="gap-1.5">
            Reported Listings
            {openReports.length > 0 && (
              <Badge variant="error" className="px-1.5 py-0">
                {openReports.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pending.length === 0 ? (
            <Card>
              <EmptyState
                icon={ClipboardCheck}
                title="All caught up!"
                description="There are no properties pending approval right now."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {pending.map((property) => (
                <Card key={property.id} hover>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                    <PropertyImage src={property.images[0]} alt={property.title} />
                    <Badge variant="warning" className="absolute left-3 top-3">
                      Under Review
                    </Badge>
                  </div>
                  <CardContent>
                    <p className="truncate font-display text-base font-semibold text-foreground">{property.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-foreground-muted">
                      <MapPin className="h-3.5 w-3.5" />
                      {property.location.locality}, {property.location.city}
                    </p>
                    <p className="mt-2 font-display text-lg font-bold text-primary-700 dark:text-primary-400">
                      {formatCurrency(property.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-foreground-muted">
                      <span>{property.type}</span>
                      <span>·</span>
                      <span>Submitted {formatDate(property.createdAt)}</span>
                      {property.rera && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> RERA
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" asChild className="col-span-1">
                        <Link href={`/admin/properties/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" className="col-span-1" onClick={() => approve(property)}>
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="col-span-1" onClick={() => setRejectTarget(property)}>
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reported">
          {openReports.length === 0 ? (
            <Card>
              <EmptyState
                icon={Flag}
                title="No open reports"
                description="There are no reported listings awaiting moderation right now."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {openReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/properties/${report.propertyId}`}
                          className="truncate font-display text-sm font-semibold text-foreground hover:underline"
                        >
                          {report.propertyTitle}
                        </Link>
                        <p className="text-xs text-foreground-muted">{report.id}</p>
                      </div>
                      <Badge variant={report.reason === "Fraud / Suspicious" ? "error" : "warning"} className="shrink-0">
                        {report.reason}
                      </Badge>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium text-foreground">{report.reporterName}</p>
                      <p className="mt-0.5 text-foreground-muted">{report.note}</p>
                    </div>

                    <p className="text-xs text-foreground-muted">Reported {formatDate(report.reportedAt)}</p>

                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => resolveReport(report)}>
                        <CheckCircle2 className="h-4 w-4" />
                        Resolve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => dismissReport(report)}>
                        <XCircle className="h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RejectReasonModal
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject property"
        description={`Let ${rejectTarget?.owner.name ?? "the owner"} know why this listing was rejected.`}
        confirmLabel="Reject Property"
        onConfirm={confirmReject}
      />
    </div>
  );
}
