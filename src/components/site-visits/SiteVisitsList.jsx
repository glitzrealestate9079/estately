"use client";

import { useMemo, useState } from "react";
import {
  Ban,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  List,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SiteVisitFormModal } from "@/components/site-visits/SiteVisitFormModal";
import { RescheduleVisitModal } from "@/components/site-visits/RescheduleVisitModal";
import { SITE_VISITS as INITIAL_VISITS, SITE_VISIT_AGENTS, SITE_VISIT_CITIES } from "@/data/site-visits";
import { SITE_VISIT_STATUSES } from "@/schemas/siteVisitSchema";
import { STATUS_STYLES, DEFAULT_STATUS_STYLE } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

const DEFAULT_FILTERS = { search: "", status: "all", agent: "all", dateFrom: "", dateTo: "" };
const ACTIVE_STATUSES = new Set(["Completed", "Cancelled"]);
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_CHIPS = 2;

function timeToMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec((time || "").trim());
  if (!match) return 0;
  let hours = parseInt(match[1], 10) % 12;
  if (/pm/i.test(match[3])) hours += 12;
  return hours * 60 + parseInt(match[2], 10);
}

function FilterSelect({ value, onChange, placeholder, options, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function VisitRow({ visit, onConfirm, onComplete, onReschedule, onCancel, onEdit }) {
  const active = !ACTIVE_STATUSES.has(visit.status);
  const actions = [];
  if (active) {
    if (visit.status !== "Confirmed") {
      actions.push({ label: "Confirm", icon: CheckCircle2, onClick: () => onConfirm(visit) });
    }
    actions.push({ label: "Reschedule", icon: RotateCcw, onClick: () => onReschedule(visit) });
    actions.push({ label: "Mark Completed", icon: CalendarCheck, onClick: () => onComplete(visit) });
  }
  actions.push({ label: "Edit Details", icon: Pencil, separatorBefore: !active, onClick: () => onEdit(visit) });
  if (active) {
    actions.push({ label: "Cancel Visit", icon: Ban, destructive: true, separatorBefore: true, onClick: () => onCancel(visit) });
  }

  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{visit.buyerName}</p>
          <p className="truncate text-sm text-foreground-muted">{visit.propertyTitle}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {visit.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {visit.city}
            </span>
            <span className="flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" />
              {visit.agentName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <StatusBadge status={visit.status} />
        <RowActions actions={actions} />
      </div>
    </div>
  );
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateKey(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

// Builds a full 7-column month grid (in whole weeks), padding with the
// trailing days of the previous/next month so every row stays complete.
function buildMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    cells.push({ key: dateKey(y, m, day), day, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: dateKey(year, month, day), day, inMonth: true });
  }
  let trailDay = 1;
  while (cells.length % 7 !== 0) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    cells.push({ key: dateKey(y, m, trailDay), day: trailDay, inMonth: false });
    trailDay++;
  }
  return cells;
}

// Derived once from the static seed data (never from Date.now()) so the
// month grid's initial view is identical on the server and client render.
const INITIAL_CALENDAR_MONTH = (() => {
  const earliest = [...INITIAL_VISITS].sort((a, b) => a.date.localeCompare(b.date))[0]?.date;
  if (!earliest) return { year: 2026, month: 8 };
  const [year, month] = earliest.split("-").map(Number);
  return { year, month: month - 1 };
})();

// Month-grid alternative to the agenda list. Day cells stay lightweight
// (a status-colored chip per visit); opening a day reuses the same
// VisitRow + RowActions used by the agenda view via `onSelectDay`.
function SiteVisitCalendar({ groups, onSelectDay }) {
  const [cursor, setCursor] = useState(INITIAL_CALENDAR_MONTH);

  const visitsByDate = useMemo(() => new Map(groups.map((g) => [g.date, g.items])), [groups]);
  const cells = useMemo(() => buildMonthCells(cursor.year, cursor.month), [cursor]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
        new Date(cursor.year, cursor.month, 1)
      ),
    [cursor]
  );

  function goToMonth(delta) {
    setCursor((prev) => {
      let month = prev.month + delta;
      let year = prev.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      } else if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  }

  function goToToday() {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  }

  return (
    <Card className="animate-slide-up overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border-subtle bg-surface-muted/60 px-5 py-3">
        <p className="font-display text-sm font-semibold text-foreground">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goToMonth(1)} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-border-subtle text-center text-xs font-medium text-foreground-muted">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell) => {
          const items = visitsByDate.get(cell.key) ?? [];
          const visible = items.slice(0, MAX_VISIBLE_CHIPS);
          const extra = items.length - visible.length;
          return (
            <button
              key={cell.key}
              type="button"
              disabled={items.length === 0}
              onClick={() => onSelectDay(cell.key)}
              className={cn(
                "flex min-h-[92px] flex-col items-stretch gap-1 border-b border-r border-border-subtle p-1.5 text-left transition-colors [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40 disabled:cursor-default disabled:hover:bg-transparent sm:min-h-[108px]",
                !cell.inMonth && "bg-surface-muted/40"
              )}
            >
              <span className={cn("text-xs font-medium", cell.inMonth ? "text-foreground" : "text-foreground-muted/60")}>
                {cell.day}
              </span>
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                {visible.map((visit) => (
                  <span
                    key={visit.id}
                    className={cn(
                      "truncate rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                      STATUS_STYLES[visit.status?.toLowerCase()] ?? DEFAULT_STATUS_STYLE
                    )}
                  >
                    {visit.time} · {visit.buyerName}
                  </span>
                ))}
                {extra > 0 && <span className="text-[10px] font-medium text-foreground-muted">+{extra} more</span>}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function SiteVisitsList() {
  const [visits, setVisits] = useState(INITIAL_VISITS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingVisit, setEditingVisit] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [view, setView] = useState("agenda");
  const [selectedDate, setSelectedDate] = useState(null);

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== "all" && !(key === "search")
  ).length;

  const groups = useMemo(() => {
    let rows = visits;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (v) => v.buyerName.toLowerCase().includes(q) || v.propertyTitle.toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") rows = rows.filter((v) => v.status === filters.status);
    if (filters.agent !== "all") rows = rows.filter((v) => v.agentName === filters.agent);
    if (filters.dateFrom) rows = rows.filter((v) => v.date >= filters.dateFrom);
    if (filters.dateTo) rows = rows.filter((v) => v.date <= filters.dateTo);

    const sorted = [...rows].sort(
      (a, b) => a.date.localeCompare(b.date) || timeToMinutes(a.time) - timeToMinutes(b.time)
    );

    const map = new Map();
    for (const visit of sorted) {
      if (!map.has(visit.date)) map.set(visit.date, []);
      map.get(visit.date).push(visit);
    }
    return [...map.entries()].map(([date, items]) => ({ date, items }));
  }, [visits, filters]);

  const totalCount = groups.reduce((sum, g) => sum + g.items.length, 0);
  const selectedDayItems = useMemo(
    () => groups.find((g) => g.date === selectedDate)?.items ?? [],
    [groups, selectedDate]
  );

  function updateFilters(next) {
    setFilters(next);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function nextId() {
    const max = visits.reduce((m, v) => Math.max(m, parseInt(v.id.split("-")[1], 10) || 0), 2000);
    return `SV-${max + 1}`;
  }

  function openAdd() {
    setFormMode("add");
    setEditingVisit(null);
    setFormOpen(true);
  }

  function openEdit(visit) {
    setFormMode("edit");
    setEditingVisit(visit);
    setFormOpen(true);
  }

  function handleFormSubmit(data) {
    if (formMode === "edit" && editingVisit) {
      setVisits((prev) => prev.map((v) => (v.id === editingVisit.id ? { ...v, ...data } : v)));
      toast.success(`Visit for ${data.buyerName} updated successfully`);
    } else {
      const visit = { ...data, id: nextId(), agentAvatar: null, createdAt: data.date };
      setVisits((prev) => [visit, ...prev]);
      toast.success(`Site visit scheduled for ${data.buyerName}`);
    }
    setFormOpen(false);
  }

  function confirmVisit(visit) {
    setVisits((prev) => prev.map((v) => (v.id === visit.id ? { ...v, status: "Confirmed" } : v)));
    toast.success(`Visit confirmed for ${visit.buyerName}`);
  }

  function completeVisit(visit) {
    setVisits((prev) => prev.map((v) => (v.id === visit.id ? { ...v, status: "Completed" } : v)));
    toast.success(`Visit with ${visit.buyerName} marked as completed`);
  }

  function handleReschedule({ date, time }) {
    if (!rescheduleTarget) return;
    setVisits((prev) =>
      prev.map((v) => (v.id === rescheduleTarget.id ? { ...v, date, time, status: "Rescheduled" } : v))
    );
    toast.success(`Visit rescheduled to ${formatDate(date)} at ${time}`);
    setRescheduleTarget(null);
  }

  function handleCancelVisit() {
    if (!cancelTarget) return;
    setVisits((prev) => prev.map((v) => (v.id === cancelTarget.id ? { ...v, status: "Cancelled" } : v)));
    toast.warning(`Visit for ${cancelTarget.buyerName} has been cancelled`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="sm:w-64">
                <Input
                  icon={Search}
                  placeholder="Search by buyer or property…"
                  value={filters.search}
                  onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <FilterSelect
                value={filters.status}
                onChange={(v) => updateFilters({ ...filters, status: v })}
                placeholder="Status"
                options={SITE_VISIT_STATUSES}
                className="w-full sm:w-40"
              />
              <FilterSelect
                value={filters.agent}
                onChange={(v) => updateFilters({ ...filters, agent: v })}
                placeholder="Agent"
                options={SITE_VISIT_AGENTS}
                className="w-full sm:w-44"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  aria-label="From date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full sm:w-40"
                />
                <span className="text-foreground-muted">–</span>
                <Input
                  type="date"
                  aria-label="To date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full sm:w-40"
                />
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Schedule Visit
            </Button>
          </div>
          <p className="text-xs text-foreground-muted">{totalCount} visits found</p>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="agenda">
            <List className="h-3.5 w-3.5" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-3.5 w-3.5" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-6">
          {groups.length === 0 ? (
            <Card>
              <EmptyState
                icon={CalendarX2}
                title="No site visits found"
                description="Try adjusting your filters, or schedule a new site visit to get started."
                action={
                  <Button onClick={openAdd}>
                    <Plus className="h-4 w-4" />
                    Schedule Visit
                  </Button>
                }
              />
            </Card>
          ) : (
            groups.map((group) => (
              <Card key={group.date} className="animate-slide-up overflow-hidden">
                <div className="flex items-center justify-between border-b border-border-subtle bg-surface-muted/60 px-5 py-3">
                  <p className="font-display text-sm font-semibold text-foreground">
                    {formatDate(group.date, { weekday: "long" })}
                  </p>
                  <span className="text-xs font-medium text-foreground-muted">
                    {group.items.length} visit{group.items.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="divide-y divide-border-subtle">
                  {group.items.map((visit) => (
                    <VisitRow
                      key={visit.id}
                      visit={visit}
                      onConfirm={confirmVisit}
                      onComplete={completeVisit}
                      onReschedule={setRescheduleTarget}
                      onCancel={setCancelTarget}
                      onEdit={openEdit}
                    />
                  ))}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="calendar">
          {groups.length === 0 ? (
            <Card>
              <EmptyState
                icon={CalendarX2}
                title="No site visits found"
                description="Try adjusting your filters, or schedule a new site visit to get started."
                action={
                  <Button onClick={openAdd}>
                    <Plus className="h-4 w-4" />
                    Schedule Visit
                  </Button>
                }
              />
            </Card>
          ) : (
            <SiteVisitCalendar groups={groups} onSelectDay={setSelectedDate} />
          )}
        </TabsContent>
      </Tabs>

      <SiteVisitFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={editingVisit}
        onSubmit={handleFormSubmit}
      />

      <RescheduleVisitModal
        open={!!rescheduleTarget}
        onOpenChange={(open) => !open && setRescheduleTarget(null)}
        visit={rescheduleTarget}
        onSubmit={handleReschedule}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel this site visit?"
        description={`The visit for "${cancelTarget?.buyerName}" at "${cancelTarget?.propertyTitle}" will be marked as cancelled.`}
        confirmLabel="Cancel Visit"
        onConfirm={handleCancelVisit}
      />

      {/* Day detail — opened from a calendar day or visit chip. Reuses VisitRow
          (and therefore RowActions) exactly as the agenda view does, so no
          detail/actions logic is duplicated for the calendar. */}
      <Modal open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <ModalContent size="lg" className="p-0">
          <ModalHeader>
            <ModalTitle>{selectedDate ? formatDate(selectedDate, { weekday: "long" }) : ""}</ModalTitle>
            <ModalDescription>
              {selectedDayItems.length} visit{selectedDayItems.length !== 1 ? "s" : ""} scheduled
            </ModalDescription>
          </ModalHeader>
          <div className="max-h-[60vh] divide-y divide-border-subtle overflow-y-auto">
            {selectedDayItems.map((visit) => (
              <VisitRow
                key={visit.id}
                visit={visit}
                onConfirm={confirmVisit}
                onComplete={completeVisit}
                onReschedule={(v) => {
                  setSelectedDate(null);
                  setRescheduleTarget(v);
                }}
                onCancel={(v) => {
                  setSelectedDate(null);
                  setCancelTarget(v);
                }}
                onEdit={(v) => {
                  setSelectedDate(null);
                  openEdit(v);
                }}
              />
            ))}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
