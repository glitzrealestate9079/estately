"use client";

import { useState } from "react";
import {
  Camera,
  Headphones,
  Pencil,
  Power,
  PowerOff,
  Rocket,
  Scale,
  Share2,
  Sofa,
  Star,
  Trash2,
  Video,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { formatCurrency, formatNumber } from "@/lib/utils";

// Icons for mock services aren't serializable, so `services.js` only stores the
// icon's lucide-react name (a string) — resolve it to a component here.
const SERVICE_ICON_MAP = {
  Camera,
  Rocket,
  Scale,
  Video,
  Star,
  Share2,
  Sofa,
  Headphones,
};

export function ServiceCard({ service, onEdit, onToggleStatus, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const Icon = SERVICE_ICON_MAP[service.icon] ?? Wrench;
  const isActive = service.status === "Active";

  return (
    <Card hover className="animate-slide-up">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <Icon className="h-5 w-5" />
          </div>
          <RowActions
            actions={[
              { label: "Edit", icon: Pencil, onClick: () => onEdit(service) },
              isActive
                ? { label: "Deactivate", icon: PowerOff, onClick: () => onToggleStatus(service) }
                : { label: "Activate", icon: Power, onClick: () => onToggleStatus(service) },
              {
                label: "Delete",
                icon: Trash2,
                destructive: true,
                separatorBefore: true,
                onClick: () => setConfirmOpen(true),
              },
            ]}
          />
        </div>

        <div>
          <p className="font-display text-base font-semibold text-foreground">{service.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-foreground-muted">{service.description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle pt-3">
          <p className="font-display text-lg font-bold text-primary-700 dark:text-primary-400">
            {formatCurrency(service.price)}
          </p>
          <StatusBadge status={service.status} />
        </div>

        <p className="text-xs text-foreground-muted">{formatNumber(service.subscribersCount)} subscribers</p>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this service?"
        description={`"${service.name}" will be permanently removed from the catalog. This action cannot be undone.`}
        confirmLabel="Delete Service"
        onConfirm={() => onDelete(service)}
      />
    </Card>
  );
}
