"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowUpDown, CheckCircle2, Eye, Pencil, ShieldCheck, Trash2, XCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { RowActions } from "@/components/common/row-actions";
import { PropertyImage } from "@/components/common/property-image";
import { PropertyFilters } from "@/components/properties/property-filters";
import { BulkActionsBar } from "@/components/properties/bulk-actions-bar";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PROPERTIES as INITIAL_PROPERTIES } from "@/data/properties";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const PAGE_SIZE = 8;

const DEFAULT_FILTERS = {
  search: "",
  type: "all",
  listingType: "all",
  status: "all",
  city: "all",
  verification: "all",
  minPrice: "",
  maxPrice: "",
};

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

export function PropertiesTable({ loading = false }) {
  const router = useRouter();
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const filtered = useMemo(() => {
    let rows = properties;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.location.locality.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") rows = rows.filter((p) => p.type === filters.type);
    if (filters.listingType !== "all") rows = rows.filter((p) => p.listingType === filters.listingType);
    if (filters.status !== "all") rows = rows.filter((p) => p.status === filters.status);
    if (filters.city !== "all") rows = rows.filter((p) => p.location.city === filters.city);
    if (filters.verification !== "all")
      rows = rows.filter((p) => (filters.verification === "Verified" ? p.verified : !p.verified));
    if (filters.minPrice) rows = rows.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) rows = rows.filter((p) => p.price <= Number(filters.maxPrice));

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "createdAt") return mul * (new Date(a.createdAt) - new Date(b.createdAt));
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [properties, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function toggleAll(checked) {
    setSelected(checked ? new Set(pageRows.map((p) => p.id)) : new Set());
  }

  function toggleRow(id, checked) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function updateStatus(ids, status, message) {
    setProperties((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p)));
    toast.success(message);
    setSelected(new Set());
  }

  function deleteProperties(ids, message) {
    setProperties((prev) => prev.filter((p) => !ids.includes(p.id)));
    toast.success(message);
    setSelected(new Set());
  }

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((p) => selected.has(p.id));

  return (
    <Card className="space-y-0">
      <div className="space-y-4 p-5">
        <PropertyFilters filters={filters} onChange={updateFilters} resultCount={filtered.length} />
        <BulkActionsBar
          count={selected.size}
          onApprove={() => updateStatus([...selected], "Active", `${selected.size} properties approved`)}
          onReject={() => updateStatus([...selected], "Rejected", `${selected.size} properties rejected`)}
          onDelete={() => setBulkDeleteOpen(true)}
          onClear={() => setSelected(new Set())}
        />
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox checked={allOnPageSelected} onCheckedChange={toggleAll} aria-label="Select all" />
              </TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <SortHeader label="Price" sortKey="price" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>
                <SortHeader label="Views" sortKey="views" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Leads" sortKey="enquiries" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Created" sortKey="createdAt" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(property.id)}
                    onCheckedChange={(checked) => toggleRow(property.id, checked === true)}
                    aria-label={`Select ${property.title}`}
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/properties/${property.id}`} className="flex items-center gap-3">
                    <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg">
                      <PropertyImage src={property.images[0]} alt={property.title} />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                        {property.title}
                        {property.featured && <Badge variant="featured">Featured</Badge>}
                        {property.verified && (
                          <ShieldCheck
                            className="h-3.5 w-3.5 shrink-0 text-success-600 dark:text-success-500"
                            aria-label="Verified"
                          />
                        )}
                        {property.rera && (
                          <span className="inline-flex shrink-0 items-center rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                            RERA
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {property.id}
                        {property.sellerType && <span> · {property.sellerType}</span>}
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{property.type}</TableCell>
                <TableCell className="text-sm text-foreground-muted">
                  {property.location.locality}, {property.location.city}
                </TableCell>
                <TableCell className="text-sm font-semibold">{formatCurrency(property.price)}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{property.owner.name}</TableCell>
                <TableCell className="text-sm">{formatNumber(property.views)}</TableCell>
                <TableCell className="text-sm">{formatNumber(property.enquiries)}</TableCell>
                <TableCell>
                  <StatusBadge status={property.status} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(property.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "View", icon: Eye, onClick: () => router.push(`/properties/${property.id}`) },
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => router.push(`/properties/${property.id}/edit`),
                      },
                      {
                        label: "Approve",
                        icon: CheckCircle2,
                        onClick: () => updateStatus([property.id], "Active", `${property.title} approved successfully`),
                      },
                      {
                        label: "Reject",
                        icon: XCircle,
                        onClick: () => updateStatus([property.id], "Rejected", `${property.title} rejected`),
                      },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(property),
                      },
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
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this property?"
        description={`"${deleteTarget?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Property"
        onConfirm={() => deleteTarget && deleteProperties([deleteTarget.id], "Property deleted successfully")}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selected.size} properties?`}
        description="These properties will be permanently removed. This action cannot be undone."
        confirmLabel="Delete All"
        onConfirm={() => deleteProperties([...selected], `${selected.size} properties deleted successfully`)}
      />
    </Card>
  );
}
