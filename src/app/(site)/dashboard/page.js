"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CalendarClock,
  Camera,
  Eye,
  Heart,
  MessageSquare,
  Pause,
  Pencil,
  Play,
  Plus,
  Rocket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PropertyImage } from "@/components/common/property-image";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal, ModalContent, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useSite } from "@/components/site/providers/site-provider";
import { SITE_VISITS } from "@/data/site-visits";
import { formatPrice } from "@/lib/site/format";
import { formatNumber } from "@/lib/utils";

export default function OwnerDashboardPage() {
  const { auth, mounted, myListings, updateListingStatus, removeListing, openAuthGate } = useSite();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [promoteTarget, setPromoteTarget] = useState(null);

  if (!mounted) return null;

  if (!auth.isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <EmptyState
          icon={Building2}
          title="Sign in to view your dashboard"
          description="Track views, enquiries and manage every property you've listed — all in one place."
          action={
            <Button className="mt-2" onClick={() => openAuthGate(null)}>
              Sign In
            </Button>
          }
        />
      </div>
    );
  }

  const totals = myListings.reduce(
    (acc, l) => ({
      views: acc.views + (l.views ?? 0),
      enquiries: acc.enquiries + (l.enquiries ?? 0),
      saves: acc.saves + (l.saves ?? 0),
    }),
    { views: 0, enquiries: 0, saves: 0 }
  );
  const activeCount = myListings.filter((l) => l.status === "Active").length;

  // SITE_VISITS has no listing/owner id — each visit only carries a
  // `propertyTitle` string, same as the agent-profile matching convention
  // (SITE_VISITS.filter((v) => v.agentName === agent.name)), so we match on
  // listing title here too.
  const myListingTitles = new Set(myListings.map((l) => l.title));
  const siteVisitsCount = SITE_VISITS.filter((v) => myListingTitles.has(v.propertyTitle)).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">{greeting}, {auth.user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-foreground-muted">Here&apos;s how your listings are performing.</p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/post-property">
            <Plus className="h-4 w-4" /> Post Property
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard icon={Building2} label="Active Listings" value={activeCount} />
        <StatCard icon={Eye} label="Total Views" value={formatNumber(totals.views)} />
        <StatCard icon={MessageSquare} label="Enquiries" value={formatNumber(totals.enquiries)} />
        <StatCard icon={Heart} label="Saved by Users" value={formatNumber(totals.saves)} />
        <StatCard icon={CalendarClock} label="Site Visits" value={formatNumber(siteVisitsCount)} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-base font-semibold text-foreground">My Listings ({myListings.length})</h2>

        {myListings.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="You haven't posted any properties yet"
            description="List your first property in a few guided steps — it's free for individual owners."
            action={
              <Button asChild className="mt-2">
                <Link href="/post-property">Post Your First Property</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {myListings.map((listing) => (
              <div key={listing.id} className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-4 shadow-card sm:flex-row sm:items-center">
                <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl sm:w-28">
                  <PropertyImage src={listing.images?.[0]} alt={listing.title} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display text-sm font-semibold text-foreground">{listing.title}</p>
                    <StatusBadge status={listing.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {listing.location.locality}, {listing.location.city} · {formatPrice(listing)}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-foreground-muted">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views} views</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {listing.enquiries} enquiries</span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {listing.saves} saved</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => setPromoteTarget(listing)}>
                    <Rocket className="h-3.5 w-3.5" />
                    Promote
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateListingStatus(listing.id, listing.status === "Active" ? "Paused" : "Active");
                      toast.success(listing.status === "Active" ? "Listing paused" : "Listing activated");
                    }}
                  >
                    {listing.status === "Active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {listing.status === "Active" ? "Pause" : "Activate"}
                  </Button>
                  {/* No dedicated site-side edit route exists yet for owner-posted
                      listings — only /post-property (create flow) exists under
                      src/app/(site)/post-property. Routing there until a real
                      edit-by-id flow is built. */}
                  <Button asChild variant="ghost" size="icon" aria-label="Edit listing">
                    <Link href="/post-property">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-foreground-muted hover:text-error-600" onClick={() => setDeleteTarget(listing)} aria-label="Delete listing">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this listing?"
        description={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          removeListing(deleteTarget.id);
          toast.success("Listing deleted");
        }}
      />

      <PromoteListingDialog
        listing={promoteTarget}
        open={!!promoteTarget}
        onOpenChange={(open) => !open && setPromoteTarget(null)}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-card">
      <Icon className="h-4 w-4 text-foreground-muted" />
      <p className="mt-2 font-display text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-foreground-muted">{label}</p>
    </div>
  );
}

function PromoteListingDialog({ listing, open, onOpenChange }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalBody className="pt-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <Rocket className="h-5 w-5" />
          </div>
          <ModalTitle>Promote this listing</ModalTitle>
          <ModalDescription>
            Promote &quot;{listing?.title}&quot; to reach more buyers — contact our team to get started with a featured placement.
          </ModalDescription>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button asChild>
            <Link href="/services" onClick={() => onOpenChange(false)}>
              Explore Promotions
            </Link>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
