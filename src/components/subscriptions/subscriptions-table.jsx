"use client";

import { useMemo, useState } from "react";
import { addMonths, addYears } from "date-fns";
import { ArrowUpDown, BadgePercent, Eye, RefreshCw, Search, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SUBSCRIPTIONS as INITIAL_SUBSCRIPTIONS } from "@/data/subscriptions";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 8;
const STATUSES = ["Active", "Expired", "Cancelled"];
const PLANS = ["Basic", "Pro", "Premium", "Enterprise"];

const PLAN_BADGE_VARIANT = {
  Basic: "default",
  Pro: "primary",
  Premium: "featured",
  Enterprise: "success",
};

const DEFAULT_FILTERS = { search: "", status: "all", plan: "all" };

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

function SortHeader({ label, sortKey, activeSort, onSort }) {
  const active = activeSort.key === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn("flex items-center gap-1 hover:text-foreground", active && "text-foreground")}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

export function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState({ key: "renewalDate", dir: "asc" });
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = subscriptions;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (s) =>
          s.subscriberName.toLowerCase().includes(q) ||
          s.invoiceId.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") rows = rows.filter((s) => s.status === filters.status);
    if (filters.plan !== "all") rows = rows.filter((s) => s.plan === filters.plan);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "renewalDate") return mul * (new Date(a.renewalDate) - new Date(b.renewalDate));
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [subscriptions, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function renewSubscription(subscription) {
    const nextRenewal =
      subscription.billingCycle === "Monthly" ? addMonths(new Date(), 1) : addYears(new Date(), 1);
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscription.id ? { ...s, status: "Active", renewalDate: nextRenewal.toISOString() } : s
      )
    );
    toast.success(`${subscription.subscriberName}'s subscription renewed successfully`);
  }

  function cancelSubscription(subscription) {
    setSubscriptions((prev) => prev.map((s) => (s.id === subscription.id ? { ...s, status: "Cancelled" } : s)));
    toast.success(`${subscription.subscriberName}'s subscription cancelled`);
  }

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return (
    <Card className="space-y-0">
      <div className="space-y-3 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by subscriber name or invoice ID…"
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <FilterSelect
            value={filters.plan}
            onChange={(v) => updateFilters({ ...filters, plan: v })}
            placeholder="Plan"
            options={PLANS}
          />
          <FilterSelect
            value={filters.status}
            onChange={(v) => updateFilters({ ...filters, status: v })}
            placeholder="Status"
            options={STATUSES}
          />
          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={() => updateFilters(DEFAULT_FILTERS)}>
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} subscriptions found</p>
      </div>

      {pageRows.length === 0 ? (
        <EmptyState
          icon={BadgePercent}
          title="No subscriptions found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>
                <SortHeader label="Amount" sortKey="amount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Renewal Date" sortKey="renewalDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <p className="text-sm font-medium text-foreground">{subscription.subscriberName}</p>
                  <Badge variant="default" className="mt-1">
                    {subscription.subscriberType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={PLAN_BADGE_VARIANT[subscription.plan] ?? "default"}>{subscription.plan}</Badge>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{subscription.billingCycle}</TableCell>
                <TableCell className="text-sm font-semibold">{formatCurrency(subscription.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={subscription.status} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(subscription.renewalDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      {
                        label: "Renew",
                        icon: RefreshCw,
                        onClick: () => renewSubscription(subscription),
                      },
                      {
                        label: "View Invoice",
                        icon: Eye,
                        onClick: () => toast.info(`Viewing invoice ${subscription.invoiceId}`),
                      },
                      ...(subscription.status === "Active"
                        ? [
                            {
                              label: "Cancel",
                              icon: XCircle,
                              destructive: true,
                              separatorBefore: true,
                              onClick: () => setCancelTarget(subscription),
                            },
                          ]
                        : []),
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {pageRows.length > 0 && (
        <Pagination page={page} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel this subscription?"
        description={`"${cancelTarget?.subscriberName}"'s subscription will be cancelled at the end of the current billing cycle.`}
        confirmLabel="Cancel Subscription"
        onConfirm={() => cancelTarget && cancelSubscription(cancelTarget)}
      />
    </Card>
  );
}
