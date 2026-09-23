"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Bookmark,
  CalendarClock,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody } from "@/components/ui/modal";
import { BUYERS as INITIAL_BUYERS } from "@/data/buyers";
import { cn, formatCurrency, formatDate, formatNumber, initials } from "@/lib/utils";

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

export function BuyersTable({ loading = false }) {
  const [buyers, setBuyers] = useState(INITIAL_BUYERS);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState({ key: "createdDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = buyers;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.includes(q)
      );
    }
    if (type !== "all") rows = rows.filter((b) => b.type === type);
    if (status !== "all") rows = rows.filter((b) => b.status === status);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "createdDate") return mul * (new Date(a.createdDate) - new Date(b.createdDate));
      if (key === "name") return mul * a.name.localeCompare(b.name);
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [buyers, search, type, status, sort]);

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
    setBuyers((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} was removed from your buyers & tenants`);
    setDeleteTarget(null);
  }

  return (
    <Card className="space-y-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, email, phone or buyer ID…"
              value={search}
              onChange={(e) => updateFilter(setSearch)(e.target.value)}
            />
          </div>
          <Select value={type} onValueChange={updateFilter(setType)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Buyer">Buyer</SelectItem>
              <SelectItem value="Tenant">Tenant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={updateFilter(setStatus)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} buyers &amp; tenants found</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No buyers or tenants found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Name" sortKey="name" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Interested In</TableHead>
              <TableHead>
                <SortHeader label="Budget" sortKey="budget" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Created" sortKey="createdDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((buyer) => (
              <TableRow key={buyer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(buyer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{buyer.name}</p>
                      <p className="text-xs text-foreground-muted">{buyer.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Phone className="h-3 w-3" /> {buyer.phone}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Mail className="h-3 w-3" /> {buyer.email}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant={buyer.type === "Buyer" ? "primary" : "default"}>{buyer.type}</Badge>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{buyer.interestedPropertyType}</TableCell>
                <TableCell className="text-sm font-semibold">{formatCurrency(buyer.budget)}</TableCell>
                <TableCell className="text-sm text-foreground-muted">{buyer.preferredLocation}</TableCell>
                <TableCell>
                  <StatusBadge status={buyer.status} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(buyer.createdDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "View", icon: Eye, onClick: () => setViewTarget(buyer) },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(buyer),
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

      <Modal open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <ModalContent size="sm">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback>{viewTarget ? initials(viewTarget.name) : ""}</AvatarFallback>
              </Avatar>
              <div>
                <ModalTitle>{viewTarget?.name}</ModalTitle>
                <ModalDescription>{viewTarget?.id}</ModalDescription>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="space-y-3 text-sm">
            <p className="flex items-center gap-2 text-foreground-muted">
              <Phone className="h-3.5 w-3.5" /> {viewTarget?.phone}
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <Mail className="h-3.5 w-3.5" /> {viewTarget?.email}
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <MapPin className="h-3.5 w-3.5" /> {viewTarget?.preferredLocation}
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <Wallet className="h-3.5 w-3.5" /> Budget: {viewTarget ? formatCurrency(viewTarget.budget) : ""}
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <Bookmark className="h-3.5 w-3.5" /> Interested in {viewTarget?.interestedPropertyType} ·{" "}
              {viewTarget ? formatNumber(viewTarget.savedPropertiesCount) : ""} saved properties
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <CalendarClock className="h-3.5 w-3.5" /> Added {viewTarget ? formatDate(viewTarget.createdDate) : ""}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {viewTarget && <Badge variant={viewTarget.type === "Buyer" ? "primary" : "default"}>{viewTarget.type}</Badge>}
              {viewTarget && <StatusBadge status={viewTarget.status} />}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this record?"
        description={`"${deleteTarget?.name}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
