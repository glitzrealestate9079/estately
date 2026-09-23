"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Contact, Eye, Mail, Phone, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { getAgentByName } from "@/data/leads";
import { cn, formatCurrency, formatDate, initials } from "@/lib/utils";

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

export function LeadsTable({ leads, onOpen, onDelete, loading = false }) {
  const [sort, setSort] = useState({ key: "createdDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sorted = useMemo(() => {
    const rows = [...leads];
    rows.sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "createdDate") return mul * (new Date(a.createdDate) - new Date(b.createdDate));
      if (key === "name") return mul * a.name.localeCompare(b.name);
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });
    return rows;
  }, [leads, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function handlePageChange(next) {
    setPage(Math.min(Math.max(next, 1), pageCount));
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onDelete(deleteTarget);
    setDeleteTarget(null);
  }

  return (
    <Card className="space-y-0">
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={Contact}
          title="No leads found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Lead" sortKey="name" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Interested Property</TableHead>
              <TableHead>
                <SortHeader label="Budget" sortKey="budget" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Created" sortKey="createdDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((lead) => {
              const agent = getAgentByName(lead.assignedAgent);
              return (
                <TableRow key={lead.id}>
                  <TableCell>
                    <button className="flex items-center gap-3 text-left" onClick={() => onOpen(lead)}>
                      <Avatar>
                        <AvatarFallback>{initials(lead.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
                        <p className="flex items-center gap-1 text-xs text-foreground-muted">
                          <Phone className="h-3 w-3" /> {lead.phone}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-foreground-muted">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </p>
                      </div>
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[220px]">
                    <p className="truncate text-sm text-foreground">{lead.interestedProperty}</p>
                    <p className="text-xs text-foreground-muted">{lead.location}</p>
                  </TableCell>
                  <TableCell className="text-sm font-semibold">{formatCurrency(lead.budget)}</TableCell>
                  <TableCell>
                    <Badge variant="default">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        {agent?.avatar && <AvatarImage src={agent.avatar} alt={lead.assignedAgent} />}
                        <AvatarFallback>{initials(lead.assignedAgent)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground-muted">{lead.assignedAgent}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-sm text-foreground-muted">{formatDate(lead.createdDate)}</TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      actions={[
                        { label: "Open", icon: Eye, onClick: () => onOpen(lead) },
                        {
                          label: "Delete",
                          icon: Trash2,
                          destructive: true,
                          separatorBefore: true,
                          onClick: () => setDeleteTarget(lead),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {pageRows.length > 0 && (
        <Pagination page={page} pageCount={pageCount} pageSize={PAGE_SIZE} total={sorted.length} onPageChange={handlePageChange} />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this lead?"
        description={`"${deleteTarget?.name}" will be permanently removed from your pipeline. This action cannot be undone.`}
        confirmLabel="Delete Lead"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
