"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowUpDown, Eye, Mail, Pencil, Phone, Power, PowerOff, Search, Trash2, UserRoundCog } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { AGENT_CITIES } from "@/data/agents";
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

export function AgentsTable({ agents, onEdit, onDelete, onToggleStatus, loading = false }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState({ key: "joinedDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = agents;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.agency.toLowerCase().includes(q) ||
          a.phone.includes(q)
      );
    }
    if (status !== "all") rows = rows.filter((a) => a.status === status);
    if (city !== "all") rows = rows.filter((a) => a.city === city);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "joinedDate") return mul * (new Date(a.joinedDate) - new Date(b.joinedDate));
      if (key === "name") return mul * a.name.localeCompare(b.name);
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [agents, search, status, city, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    toast.success(`${deleteTarget.name} was removed from your agents`);
    setDeleteTarget(null);
  }

  return (
    <Card className="space-y-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, agency, email, phone or agent ID…"
              value={search}
              onChange={(e) => updateFilter(setSearch)(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={updateFilter(setStatus)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={updateFilter(setCity)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {AGENT_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} agents found</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={UserRoundCog}
          title="No agents found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Agent" sortKey="name" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Agency</TableHead>
              <TableHead>City</TableHead>
              <TableHead>
                <SortHeader label="Properties" sortKey="propertiesCount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Leads" sortKey="leadsCount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Conversions" sortKey="conversions" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Joined" sortKey="joinedDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <Link href={`/admin/agents/${agent.id}`} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{initials(agent.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-foreground-muted">{agent.id}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Phone className="h-3 w-3" /> {agent.phone}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Mail className="h-3 w-3" /> {agent.email}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{agent.agency}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{agent.city}</TableCell>
                <TableCell className="text-sm font-semibold">{formatNumber(agent.propertiesCount)}</TableCell>
                <TableCell className="text-sm">{formatNumber(agent.leadsCount)}</TableCell>
                <TableCell className="text-sm">{formatNumber(agent.conversions)}</TableCell>
                <TableCell>
                  <StatusBadge status={agent.status} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(agent.joinedDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "View Profile", icon: Eye, onClick: () => router.push(`/admin/agents/${agent.id}`) },
                      { label: "Edit", icon: Pencil, onClick: () => onEdit(agent) },
                      agent.status === "Active"
                        ? {
                            label: "Deactivate",
                            icon: PowerOff,
                            onClick: () => onToggleStatus(agent.id, "Inactive"),
                          }
                        : {
                            label: "Activate",
                            icon: Power,
                            onClick: () => onToggleStatus(agent.id, "Active"),
                          },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(agent),
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
        title="Delete this agent?"
        description={`"${deleteTarget?.name}" will be permanently removed from your agent roster. This action cannot be undone.`}
        confirmLabel="Delete Agent"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
