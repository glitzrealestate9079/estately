"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, CheckCircle2, Eye, Receipt, Search, X } from "lucide-react";
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
import { PaymentStatCards } from "@/components/payments/payment-stat-cards";
import { PAYMENTS as INITIAL_PAYMENTS } from "@/data/payments";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 8;
const STATUSES = ["Success", "Pending", "Failed"];
const PURPOSES = ["Subscription", "Featured Listing", "Service"];

const DEFAULT_FILTERS = { search: "", status: "all", purpose: "all" };

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-44">
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

export function PaymentsTable() {
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);

  const stats = useMemo(() => {
    const successful = payments.filter((p) => p.status === "Success");
    const pending = payments.filter((p) => p.status === "Pending");
    const failed = payments.filter((p) => p.status === "Failed");
    const totalRevenue = successful.reduce((sum, p) => sum + p.amount, 0);
    return {
      totalRevenue: formatCurrency(totalRevenue),
      successCount: successful.length,
      pendingCount: pending.length,
      failedCount: failed.length,
    };
  }, [payments]);

  const filtered = useMemo(() => {
    let rows = payments;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (p) =>
          p.payerName.toLowerCase().includes(q) ||
          p.invoiceId.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") rows = rows.filter((p) => p.status === filters.status);
    if (filters.purpose !== "all") rows = rows.filter((p) => p.purpose === filters.purpose);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "date") return mul * (new Date(a.date) - new Date(b.date));
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [payments, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function markAsPaid(payment) {
    setPayments((prev) => prev.map((p) => (p.id === payment.id ? { ...p, status: "Success" } : p)));
    toast.success(`${payment.invoiceId} marked as paid`);
  }

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return (
    <div className="space-y-6">
      <PaymentStatCards {...stats} />

      <Card className="space-y-0">
        <div className="space-y-3 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search by payer name or invoice ID…"
                value={filters.search}
                onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <FilterSelect
              value={filters.status}
              onChange={(v) => updateFilters({ ...filters, status: v })}
              placeholder="Status"
              options={STATUSES}
            />
            <FilterSelect
              value={filters.purpose}
              onChange={(v) => updateFilters({ ...filters, purpose: v })}
              placeholder="Purpose"
              options={PURPOSES}
            />
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={() => updateFilters(DEFAULT_FILTERS)}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-foreground-muted">{filtered.length} transactions found</p>
        </div>

        {pageRows.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions found"
            description="Try adjusting your filters or search terms to find what you're looking for."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payer</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>
                  <SortHeader label="Amount" sortKey="amount" activeSort={sort} onSort={handleSort} />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <SortHeader label="Date" sortKey="date" activeSort={sort} onSort={handleSort} />
                </TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <p className="text-sm font-medium text-foreground">{payment.payerName}</p>
                    <Badge variant="default" className="mt-1">
                      {payment.payerType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted">{payment.purpose}</TableCell>
                  <TableCell className="text-sm font-semibold">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted">{formatDate(payment.date)}</TableCell>
                  <TableCell className="text-sm text-foreground-muted">{payment.invoiceId}</TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      actions={[
                        {
                          label: "View Invoice",
                          icon: Eye,
                          onClick: () => toast.info(`Viewing invoice ${payment.invoiceId}`),
                        },
                        ...(payment.status === "Pending"
                          ? [
                              {
                                label: "Mark as Paid",
                                icon: CheckCircle2,
                                onClick: () => markAsPaid(payment),
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
      </Card>
    </div>
  );
}
