"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, BellRing, BookmarkCheck, CalendarClock, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SAVED_SEARCHES as INITIAL_SAVED_SEARCHES } from "@/data/saved-searches";
import { cn, formatDate, formatNumber, initials } from "@/lib/utils";

const PAGE_SIZE = 8;

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

export function SavedSearchesTable({ loading = false }) {
  const [searches, setSearches] = useState(INITIAL_SAVED_SEARCHES);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "createdDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = searches;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (s) =>
          s.buyerName.toLowerCase().includes(q) ||
          s.criteriaSummary.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "createdDate") return mul * (new Date(a.createdDate) - new Date(b.createdDate));
      if (key === "buyerName") return mul * a.buyerName.localeCompare(b.buyerName);
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [searches, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function toggleAlerts(item) {
    const next = !item.alertsEnabled;
    setSearches((prev) => prev.map((s) => (s.id === item.id ? { ...s, alertsEnabled: next } : s)));
    toast.success(next ? `Alerts enabled for "${item.buyerName}"'s search` : `Alerts disabled for "${item.buyerName}"'s search`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setSearches((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast.success(`Saved search for "${deleteTarget.buyerName}" was deleted`);
    setDeleteTarget(null);
  }

  return (
    <Card className="space-y-0">
      <div className="space-y-4 p-5">
        <Input
          icon={Search}
          placeholder="Search by buyer name or search criteria…"
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
        />
        <p className="text-xs text-foreground-muted">{filtered.length} saved searches found</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved searches found"
          description="Try adjusting your search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Buyer" sortKey="buyerName" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Search Criteria</TableHead>
              <TableHead>
                <SortHeader label="Matches" sortKey="matchCount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Alerts</TableHead>
              <TableHead>
                <SortHeader label="Created" sortKey="createdDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(item.buyerName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.buyerName}</p>
                      <p className="text-xs text-foreground-muted">{item.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-sm text-sm text-foreground-muted">{item.criteriaSummary}</TableCell>
                <TableCell className="text-sm font-semibold">{formatNumber(item.matchCount)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.alertsEnabled}
                      onCheckedChange={() => toggleAlerts(item)}
                      aria-label={`Toggle alerts for ${item.buyerName}`}
                    />
                    {item.alertsEnabled && <BellRing className="h-3.5 w-3.5 text-primary-600" />}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(item.createdDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        onClick: () => setDeleteTarget(item),
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
        title="Delete this saved search?"
        description={`The saved search for "${deleteTarget?.buyerName}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
