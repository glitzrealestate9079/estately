"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { ArrowUpDown, Eye, HardHat, Mail, Pencil, Phone, Power, PowerOff, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DeveloperFormModal } from "@/components/developers/DeveloperFormModal";
import { DEVELOPERS as INITIAL_DEVELOPERS } from "@/data/developers";
import { DEVELOPER_DEFAULT_VALUES } from "@/schemas/developerSchema";
import { cn, formatDate, formatNumber, initials } from "@/lib/utils";

const PAGE_SIZE = 8;

const DEVELOPER_CITIES = [...new Set(INITIAL_DEVELOPERS.map((d) => d.city))].sort((a, b) => a.localeCompare(b));

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

export const DevelopersTable = forwardRef(function DevelopersTable({ loading = false }, ref) {
  const router = useRouter();
  const [developers, setDevelopers] = useState(INITIAL_DEVELOPERS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState({ key: "createdDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingDeveloper, setEditingDeveloper] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useImperativeHandle(ref, () => ({
    openAdd() {
      setFormMode("add");
      setEditingDeveloper(null);
      setFormOpen(true);
    },
  }));

  const filtered = useMemo(() => {
    let rows = developers;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.city.toLowerCase().includes(q)
      );
    }
    if (status !== "all") rows = rows.filter((d) => d.status === status);
    if (city !== "all") rows = rows.filter((d) => d.city === city);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "createdDate") return mul * (new Date(a.createdDate) - new Date(b.createdDate));
      if (key === "name") return mul * a.name.localeCompare(b.name);
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [developers, search, status, city, sort]);

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

  function openEdit(developer) {
    setFormMode("edit");
    setEditingDeveloper(developer);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (formMode === "edit" && editingDeveloper) {
      setDevelopers((prev) => prev.map((d) => (d.id === editingDeveloper.id ? { ...d, ...data } : d)));
      toast.success(`${data.name}'s profile was updated successfully`);
    } else {
      const newDeveloper = {
        ...data,
        id: `DEV-${1000 + developers.length + 100}`,
        projectsCount: 0,
        totalUnits: 0,
        leadsCount: 0,
        status: "Active",
        projects: [],
        createdDate: new Date().toISOString().slice(0, 10),
      };
      setDevelopers((prev) => [newDeveloper, ...prev]);
      toast.success(`${data.name} was added as a new developer`);
    }
  }

  function toggleStatus(developer) {
    const next = developer.status === "Active" ? "Inactive" : "Active";
    setDevelopers((prev) => prev.map((d) => (d.id === developer.id ? { ...d, status: next } : d)));
    toast.success(`${developer.name} marked as ${next}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setDevelopers((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} was removed from your developers`);
    setDeleteTarget(null);
  }

  return (
    <Card className="space-y-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, email, phone or developer ID…"
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
              {DEVELOPER_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} developers found</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={HardHat}
          title="No developers found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Developer" sortKey="name" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <SortHeader label="Projects" sortKey="projectsCount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Total Units" sortKey="totalUnits" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Leads" sortKey="leadsCount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Created" sortKey="createdDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((developer) => (
              <TableRow key={developer.id}>
                <TableCell>
                  <Link href={`/developers/${developer.id}`} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(developer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{developer.name}</p>
                      <p className="text-xs text-foreground-muted">{developer.city}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Phone className="h-3 w-3" /> {developer.phone}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Mail className="h-3 w-3" /> {developer.email}
                  </p>
                </TableCell>
                <TableCell className="text-sm font-semibold">{formatNumber(developer.projectsCount)}</TableCell>
                <TableCell className="text-sm">{formatNumber(developer.totalUnits)}</TableCell>
                <TableCell className="text-sm">{formatNumber(developer.leadsCount)}</TableCell>
                <TableCell>
                  <StatusBadge status={developer.status} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(developer.createdDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "View", icon: Eye, onClick: () => router.push(`/developers/${developer.id}`) },
                      { label: "Edit", icon: Pencil, onClick: () => openEdit(developer) },
                      developer.status === "Active"
                        ? { label: "Deactivate", icon: PowerOff, onClick: () => toggleStatus(developer) }
                        : { label: "Activate", icon: Power, onClick: () => toggleStatus(developer) },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(developer),
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

      <DeveloperFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={formMode === "edit" && editingDeveloper ? editingDeveloper : DEVELOPER_DEFAULT_VALUES}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this developer?"
        description={`"${deleteTarget?.name}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Developer"
        onConfirm={confirmDelete}
      />
    </Card>
  );
});
