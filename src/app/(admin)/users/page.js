"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/users/UsersTable";
import { UserFormModal } from "@/components/users/UserFormModal";
import { USERS as INITIAL_USERS } from "@/data/users";

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [addOpen, setAddOpen] = useState(false);

  function addUser(data) {
    const nextId = `USR-${1000 + users.length + 1}`;
    setUsers((prev) => [
      { id: nextId, ...data, avatar: `https://i.pravatar.cc/80?img=${(prev.length % 70) + 1}`, lastActive: new Date(2026, 8, 23, 9, 0).toISOString() },
      ...prev,
    ]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles"
        subtitle="Manage internal admin users, their access roles and account status."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        }
      />
      <UsersTable users={users} onUsersChange={setUsers} />
      <UserFormModal open={addOpen} onOpenChange={setAddOpen} mode="add" onSave={addUser} />
    </div>
  );
}
