"use client";

import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { initials, cn } from "@/lib/utils";

const PERMISSION_LABELS = [
  "Manage Properties",
  "Approve / Reject Listings",
  "Manage Leads & Enquiries",
  "Manage Users & Roles",
  "View Analytics & Reports",
  "Manage Payments & Subscriptions",
  "Manage CMS Content",
  "Platform Settings",
];

// Purely presentational — which of PERMISSION_LABELS (by index) each role is granted.
const ROLE_PERMISSIONS = {
  "Super Admin": [true, true, true, true, true, true, true, true],
  Admin: [true, true, true, true, true, true, true, false],
  "Property Manager": [true, true, false, false, true, false, false, false],
  "Sales Manager": [false, false, true, false, true, true, false, false],
  Agent: [true, false, true, false, false, false, false, false],
  "Content Manager": [false, false, false, false, true, false, true, false],
  Support: [false, false, true, false, false, false, false, false],
};

export function ViewPermissionsModal({ open, onOpenChange, user }) {
  const grants = (user && ROLE_PERMISSIONS[user.role]) || PERMISSION_LABELS.map(() => false);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Role Permissions</ModalTitle>
          <ModalDescription>Read-only overview of what this role can access.</ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-5">
          {user && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                <Badge variant="primary" className="mt-0.5">
                  {user.role}
                </Badge>
              </div>
            </div>
          )}

          <ul className="space-y-2">
            {PERMISSION_LABELS.map((label, index) => {
              const granted = grants[index];
              return (
                <li
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle px-3.5 py-2.5"
                >
                  <span className="text-sm text-foreground">{label}</span>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      granted
                        ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-500/10 dark:text-slate-500"
                    )}
                  >
                    {granted ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                </li>
              );
            })}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
