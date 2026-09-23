"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Eye, Pencil, Search, ShieldCheck, ShieldOff, Trash2, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { UserFormModal } from "@/components/users/UserFormModal";
import { ViewPermissionsModal } from "@/components/users/ViewPermissionsModal";
import { USER_ROLES } from "@/lib/constants";
import { USER_STATUSES } from "@/schemas/userSchema";
import { cn, formatDateTime, initials } from "@/lib/utils";

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

export function UsersTable({ users, onUsersChange }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ key: "lastActive", dir: "desc" });
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [permissionsTarget, setPermissionsTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = users;
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") rows = rows.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") rows = rows.filter((u) => u.status === statusFilter);

    const sorted = [...rows].sort((a, b) => {
      const { key, dir } = sort;
      const mul = dir === "asc" ? 1 : -1;
      if (key === "lastActive") return mul * (new Date(a.lastActive) - new Date(b.lastActive));
      return mul * String(a[key]).localeCompare(String(b[key]));
    });

    return sorted;
  }, [users, search, roleFilter, statusFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function resetToFirstPage(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  function saveEdit(data) {
    onUsersChange((prev) => prev.map((u) => (u.id === editTarget.id ? { ...u, ...data } : u)));
  }

  function toggleStatus(user) {
    const nextStatus = user.status === "Active" ? "Inactive" : "Active";
    onUsersChange((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    toast.success(`${user.name} ${nextStatus === "Active" ? "activated" : "deactivated"}`);
  }

  function deleteUser() {
    onUsersChange((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} removed from the team`);
  }

  return (
    <Card className="space-y-0">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => resetToFirstPage(setSearch)(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={resetToFirstPage(setRoleFilter)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {USER_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={resetToFirstPage(setStatusFilter)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {USER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {pageRows.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description="Try adjusting your search or filters to find the team member you're looking for."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortHeader label="User" sortKey="name" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortHeader label="Role" sortKey="role" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <SortHeader label="Last Active" sortKey="lastActive" activeSort={sort} onSort={handleSort} />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-foreground-muted">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="primary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "success" : "default"}>{user.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDateTime(user.lastActive)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "Edit", icon: Pencil, onClick: () => setEditTarget(user) },
                      {
                        label: user.status === "Active" ? "Deactivate" : "Activate",
                        icon: user.status === "Active" ? ShieldOff : ShieldCheck,
                        onClick: () => toggleStatus(user),
                      },
                      { label: "View Permissions", icon: Eye, onClick: () => setPermissionsTarget(user) },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(user),
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

      <UserFormModal
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        mode="edit"
        user={editTarget}
        onSave={saveEdit}
      />

      <ViewPermissionsModal
        open={!!permissionsTarget}
        onOpenChange={(open) => !open && setPermissionsTarget(null)}
        user={permissionsTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove this user?"
        description={`"${deleteTarget?.name}" will lose access to the admin panel immediately. This action cannot be undone.`}
        confirmLabel="Delete User"
        onConfirm={deleteUser}
      />
    </Card>
  );
}
