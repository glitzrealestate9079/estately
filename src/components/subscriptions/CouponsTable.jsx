"use client";

import { useMemo, useState } from "react";
import { BadgePercent, Pencil, Power, PowerOff, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { CouponFormModal } from "@/components/subscriptions/CouponFormModal";
import { COUPONS as INITIAL_COUPONS } from "@/data/subscriptions";
import { COUPON_APPLICABLE_PLANS, COUPON_STATUSES } from "@/schemas/couponSchema";
import { formatCurrency, formatDate } from "@/lib/utils";

const DEFAULT_FILTERS = { search: "", plan: "all", status: "all" };

const PLAN_BADGE_VARIANT = {
  "All Plans": "default",
  Basic: "default",
  Pro: "primary",
  Premium: "featured",
  Enterprise: "success",
};

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// `coupons`/`onCouponsChange` let a parent (e.g. the Subscriptions page) lift
// and share this list with its own "New Coupon" flow. When omitted, the table
// is fully self-contained and seeds its own state from the mock COUPONS data.
export function CouponsTable({ coupons: controlledCoupons, onCouponsChange }) {
  const [internalCoupons, setInternalCoupons] = useState(INITIAL_COUPONS);
  const coupons = controlledCoupons ?? internalCoupons;
  const setCoupons = onCouponsChange ?? setInternalCoupons;

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = coupons;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((c) => c.code.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    if (filters.plan !== "all") rows = rows.filter((c) => c.applicablePlan === filters.plan);
    if (filters.status !== "all") rows = rows.filter((c) => c.status === filters.status);
    return rows;
  }, [coupons, filters]);

  function updateFilters(next) {
    setFilters(next);
  }

  function handleEditSave(data) {
    setCoupons((prev) => prev.map((c) => (c.id === editTarget.id ? { ...c, ...data } : c)));
  }

  function toggleStatus(coupon) {
    const next = coupon.status === "Disabled" ? "Active" : "Disabled";
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, status: next } : c)));
    toast.success(`"${coupon.code}" was ${next === "Disabled" ? "disabled" : "enabled"}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.code}" was deleted`);
    setDeleteTarget(null);
  }

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return (
    <Card className="space-y-0">
      <div className="space-y-3 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by coupon code…"
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <FilterSelect
            value={filters.plan}
            onChange={(v) => updateFilters({ ...filters, plan: v })}
            placeholder="Plan"
            options={COUPON_APPLICABLE_PLANS}
          />
          <FilterSelect
            value={filters.status}
            onChange={(v) => updateFilters({ ...filters, status: v })}
            placeholder="Status"
            options={COUPON_STATUSES}
          />
          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={() => updateFilters(DEFAULT_FILTERS)}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} coupons found</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BadgePercent}
          title="No coupons found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Applicable Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <p className="text-sm font-semibold text-foreground">{coupon.code}</p>
                  <p className="text-xs text-foreground-muted">{coupon.id}</p>
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">
                  {coupon.discountType === "Percentage"
                    ? `${coupon.discountValue}%`
                    : formatCurrency(coupon.discountValue)}
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">
                  {formatDate(coupon.validFrom)} – {formatDate(coupon.validUntil)}
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">
                  {coupon.timesUsed} / {coupon.usageLimit == null ? "Unlimited" : coupon.usageLimit}
                </TableCell>
                <TableCell>
                  <Badge variant={PLAN_BADGE_VARIANT[coupon.applicablePlan] ?? "default"}>
                    {coupon.applicablePlan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={coupon.status} />
                </TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => setEditTarget(coupon),
                      },
                      {
                        label: coupon.status === "Disabled" ? "Enable" : "Disable",
                        icon: coupon.status === "Disabled" ? Power : PowerOff,
                        onClick: () => toggleStatus(coupon),
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(coupon),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CouponFormModal
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        coupon={editTarget}
        onSave={handleEditSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this coupon?"
        description={`"${deleteTarget?.code}" will be permanently removed and can no longer be redeemed.`}
        confirmLabel="Delete Coupon"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
