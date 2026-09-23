"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Building2,
  CalendarClock,
  Eye,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldX,
  Trash2,
  UserRound,
} from "lucide-react";
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
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody } from "@/components/ui/modal";
import { Search } from "lucide-react";
import { OWNER_CITIES, OWNERS as INITIAL_OWNERS } from "@/data/owners";
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

export function OwnersTable({ loading = false }) {
  const [owners, setOwners] = useState(INITIAL_OWNERS);
  const [search, setSearch] = useState("");
  const [verification, setVerification] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState({ key: "joinedDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = owners;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }
    if (verification !== "all") rows = rows.filter((o) => o.verificationStatus === verification);
    if (city !== "all") rows = rows.filter((o) => o.city === city);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "joinedDate") return mul * (new Date(a.joinedDate) - new Date(b.joinedDate));
      if (key === "name") return mul * a.name.localeCompare(b.name);
      return mul * ((a[key] ?? 0) - (b[key] ?? 0));
    });

    return sorted;
  }, [owners, search, verification, city, sort]);

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

  function toggleVerification(owner) {
    const next = owner.verificationStatus === "Verified" ? "Unverified" : "Verified";
    setOwners((prev) => prev.map((o) => (o.id === owner.id ? { ...o, verificationStatus: next } : o)));
    toast.success(`${owner.name} marked as ${next}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setOwners((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} was removed from your owners`);
    setDeleteTarget(null);
  }

  return (
    <Card className="space-y-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name, email, phone or owner ID…"
              value={search}
              onChange={(e) => updateFilter(setSearch)(e.target.value)}
            />
          </div>
          <Select value={verification} onValueChange={updateFilter(setVerification)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verification</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={updateFilter(setCity)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {OWNER_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} owners found</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : pageRows.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="No owners found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="Owner" sortKey="name" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>City</TableHead>
              <TableHead>
                <SortHeader label="Properties Owned" sortKey="propertiesOwnedCount" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>
                <SortHeader label="Joined" sortKey="joinedDate" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials(owner.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{owner.name}</p>
                      <p className="text-xs text-foreground-muted">{owner.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Phone className="h-3 w-3" /> {owner.phone}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
                    <Mail className="h-3 w-3" /> {owner.email}
                  </p>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{owner.city}</TableCell>
                <TableCell className="text-sm font-semibold">{formatNumber(owner.propertiesOwnedCount)}</TableCell>
                <TableCell>
                  <StatusBadge status={owner.verificationStatus} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(owner.joinedDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "View", icon: Eye, onClick: () => setViewTarget(owner) },
                      owner.verificationStatus === "Verified"
                        ? { label: "Mark Unverified", icon: ShieldX, onClick: () => toggleVerification(owner) }
                        : { label: "Mark Verified", icon: ShieldCheck, onClick: () => toggleVerification(owner) },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(owner),
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
              <MapPin className="h-3.5 w-3.5" /> {viewTarget?.city}
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <Building2 className="h-3.5 w-3.5" /> {viewTarget?.propertiesOwnedCount} properties owned
            </p>
            <p className="flex items-center gap-2 text-foreground-muted">
              <CalendarClock className="h-3.5 w-3.5" /> Joined {viewTarget ? formatDate(viewTarget.joinedDate) : ""}
            </p>
            <div className="pt-1">{viewTarget && <StatusBadge status={viewTarget.verificationStatus} />}</div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this owner?"
        description={`"${deleteTarget?.name}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Owner"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
