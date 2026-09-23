"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  Download,
  FolderPlus,
  LogIn,
  Pencil,
  Plus,
  Search as SearchIcon,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { cn, formatDateTime } from "@/lib/utils";

const PAGE_SIZE = 10;

const TYPE_ICON = {
  login: LogIn,
  update: Pencil,
  create: Plus,
  delete: Trash2,
  approve: CheckCircle2,
  reject: XCircle,
  payment: CreditCard,
  security: ShieldCheck,
  export: Download,
  settings: SettingsIcon,
  notification: Bell,
  project: FolderPlus,
  seo: SearchIcon,
};

const TYPE_COLOR = {
  login: "bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-500",
  update: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
  create: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  delete: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500",
  approve: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  reject: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500",
  payment: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  security: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
  export: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
  settings: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  notification: "bg-featured-50 text-featured-600 dark:bg-featured-500/10 dark:text-featured-500",
  project: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
  seo: "bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-500",
};

const ACTIVITY_LOG = [
  { id: "log-1", type: "login", action: "Signed in to the admin panel", detail: "IP 103.27.114.20 · Chrome on Windows", timestamp: "2026-09-23T09:12:00" },
  { id: "log-2", type: "update", action: "Updated General settings — platform name and support email", detail: "IP 103.27.114.20", timestamp: "2026-09-22T18:44:00" },
  { id: "log-3", type: "approve", action: "Approved property listing — Skyline Residences, Sector 84", detail: "Property #PR-1042", timestamp: "2026-09-22T16:05:00" },
  { id: "log-4", type: "create", action: "Added a new agent — Priya Nair", detail: "Agent #AG-2210", timestamp: "2026-09-22T11:30:00" },
  { id: "log-5", type: "payment", action: "Updated Payment settings — switched gateway to Razorpay", detail: "Test mode enabled", timestamp: "2026-09-21T15:20:00" },
  { id: "log-6", type: "security", action: "Changed account password", detail: "IP 103.27.114.20", timestamp: "2026-09-21T09:02:00" },
  { id: "log-7", type: "reject", action: "Rejected property listing — Green Valley Plot", detail: "Property #PR-0988 · Reason: Incomplete documents", timestamp: "2026-09-20T17:48:00" },
  { id: "log-8", type: "export", action: "Exported Owners report as CSV", detail: "312 records", timestamp: "2026-09-20T12:15:00" },
  { id: "log-9", type: "project", action: "Added a new project — Horizon Business Park", detail: "Developer: Horizon Developers", timestamp: "2026-09-19T14:52:00" },
  { id: "log-10", type: "settings", action: "Enabled Maintenance Mode for 15 minutes", detail: "Platform settings", timestamp: "2026-09-19T08:30:00" },
  { id: "log-11", type: "update", action: "Updated Notification settings — disabled SMS alerts", detail: "IP 103.27.114.20", timestamp: "2026-09-18T19:10:00" },
  { id: "log-12", type: "delete", action: "Removed owner record — Deepak Chawla", detail: "Owner #OW-0512", timestamp: "2026-09-18T13:05:00" },
  { id: "log-13", type: "login", action: "Signed in to the admin panel", detail: "IP 49.36.88.201 · Safari on macOS", timestamp: "2026-09-17T09:40:00" },
  { id: "log-14", type: "seo", action: "Updated SEO settings — meta title and keywords", detail: "Homepage metadata", timestamp: "2026-09-17T08:55:00" },
  { id: "log-15", type: "approve", action: "Approved property listing — Palm Meadows Villa", detail: "Property #PR-0975", timestamp: "2026-09-16T16:22:00" },
  { id: "log-16", type: "create", action: "Created a new subscription plan — Growth Annual", detail: "Plans & Pricing", timestamp: "2026-09-16T11:08:00" },
  { id: "log-17", type: "notification", action: "Sent a weekly digest email to all agents", detail: "148 recipients", timestamp: "2026-09-15T07:30:00" },
  { id: "log-18", type: "update", action: "Updated Email settings — changed SMTP host", detail: "smtp.estately.example", timestamp: "2026-09-14T15:44:00" },
  { id: "log-19", type: "payment", action: "Processed a subscription payment", detail: "Amrapali Estates · ₹24,999", timestamp: "2026-09-14T10:12:00" },
  { id: "log-20", type: "security", action: "Reviewed and confirmed active login sessions", detail: "2 active sessions", timestamp: "2026-09-13T18:02:00" },
  { id: "log-21", type: "reject", action: "Rejected property listing — Sunrise Apartments", detail: "Property #PR-0940 · Reason: Duplicate listing", timestamp: "2026-09-12T14:37:00" },
  { id: "log-22", type: "create", action: "Added a new user — Rahul Sharma", detail: "Role: Sales Manager", timestamp: "2026-09-11T12:20:00" },
  { id: "log-23", type: "export", action: "Exported Payments report as PDF", detail: "September 2026", timestamp: "2026-09-10T17:15:00" },
  { id: "log-24", type: "update", action: "Updated Social Media settings — refreshed Instagram link", detail: "IP 103.27.114.20", timestamp: "2026-09-09T09:48:00" },
  { id: "log-25", type: "login", action: "Signed in to the admin panel", detail: "IP 103.27.114.20 · Chrome on Windows", timestamp: "2026-09-08T09:05:00" },
];

export function ActivityTimeline() {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(ACTIVITY_LOG.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => ACTIVITY_LOG.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page]
  );

  return (
    <Card className="animate-slide-up">
      <div className="p-5">
        <ol className="relative space-y-6 border-l border-border-subtle pl-6">
          {pageRows.map((item) => {
            const Icon = TYPE_ICON[item.type] ?? SettingsIcon;
            return (
              <li key={item.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface",
                    TYPE_COLOR[item.type]
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-foreground-muted">
                    <span>{formatDateTime(item.timestamp)}</span>
                    {item.detail && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{item.detail}</span>
                      </>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        pageSize={PAGE_SIZE}
        total={ACTIVITY_LOG.length}
        onPageChange={setPage}
      />
    </Card>
  );
}
