"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  CheckCheck,
  CreditCard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  CalendarClock,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { NOTIFICATIONS as INITIAL_NOTIFICATIONS } from "@/data/notifications";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const TYPE_META = {
  property: { label: "Property", icon: Building2, color: "bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-500" },
  lead: { label: "Leads", icon: UserPlus, color: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400" },
  visit: { label: "Site Visits", icon: CalendarClock, color: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500" },
  approval: { label: "Approvals", icon: ClipboardCheck, color: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" },
  payment: { label: "Payments", icon: CreditCard, color: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500" },
  review: { label: "Reviews", icon: MessageSquareText, color: "bg-featured-50 text-featured-600 dark:bg-featured-500/10 dark:text-featured-500" },
  system: { label: "System", icon: Sparkles, color: "bg-accent-500/10 text-accent-600 dark:text-accent-400" },
  verification: { label: "Verification", icon: ShieldCheck, color: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500" },
};

const DEFAULT_META = { label: "Notification", icon: Bell, color: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400" };

export function NotificationsList() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);

  const types = useMemo(() => {
    const seen = new Set(notifications.map((n) => n.type));
    return Object.keys(TYPE_META).filter((key) => seen.has(key));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    if (tab === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === tab);
  }, [notifications, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeTab(value) {
    setTab(value);
    setPage(1);
  }

  function markAsRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    toast.success("Notification marked as read");
  }

  function deleteNotification(id, title) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success(`"${title}" removed`);
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="animate-slide-up space-y-0">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={tab} onValueChange={changeTab} className="min-w-0">
            <TabsList className="h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              {types.map((type) => (
                <TabsTrigger key={type} value={type}>
                  {TYPE_META[type].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="shrink-0">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        {pageRows.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up — nothing to see in this filter right now."
          />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {pageRows.map((notification) => {
              const meta = TYPE_META[notification.type] ?? DEFAULT_META;
              const Icon = meta.icon;
              return (
                <li
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3.5 px-5 py-4 transition-colors",
                    !notification.read && "bg-primary-50/40 dark:bg-primary-500/5"
                  )}
                >
                  <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full", meta.color)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={cn("text-sm leading-snug text-foreground", !notification.read && "font-semibold")}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-primary-500 align-middle" aria-hidden="true" />
                        )}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-foreground-muted">{notification.description}</p>
                    <p className="mt-1 text-xs text-foreground-muted/70">{notification.time}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!notification.read && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mark as read</TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-error-600 hover:bg-error-50 hover:text-error-700 dark:hover:bg-error-500/10"
                          onClick={() => deleteNotification(notification.id, notification.title)}
                          aria-label="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {pageRows.length > 0 && (
          <Pagination page={page} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
        )}
      </Card>
    </TooltipProvider>
  );
}
