"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Contact, LayoutGrid, Table2, TrendingUp, XCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadFormModal } from "@/components/leads/LeadFormModal";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadsKanban } from "@/components/leads/LeadsKanban";
import { LeadDetailDrawer } from "@/components/leads/LeadDetailDrawer";
import { LeadFilters, DEFAULT_LEAD_FILTERS } from "@/components/leads/LeadFilters";
import { LEADS as INITIAL_LEADS } from "@/data/leads";
import { formatCompactNumber } from "@/lib/utils";

const TODAY = "2026-09-23";
const TERMINAL_STATUSES = new Set(["Converted", "Lost"]);

function StatCard({ icon: Icon, label, value, accent }) {
  const accents = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
    success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
    accent: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
    error: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500",
  };
  return (
    <Card className="flex items-center gap-3 p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-foreground-muted">{label}</p>
      </div>
    </Card>
  );
}

function LeadsPageInner() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [filters, setFilters] = useState(DEFAULT_LEAD_FILTERS);
  const [view, setView] = useState("table");
  const [modalOpen, setModalOpen] = useState(searchParams.get("new") === "1");
  const [openLeadId, setOpenLeadId] = useState(null);

  const filtered = useMemo(() => {
    let rows = leads;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.interestedProperty.toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") rows = rows.filter((l) => l.status === filters.status);
    if (filters.source !== "all") rows = rows.filter((l) => l.source === filters.source);
    if (filters.agent !== "all") rows = rows.filter((l) => l.assignedAgent === filters.agent);
    return rows;
  }, [leads, filters]);

  const totals = useMemo(() => {
    const converted = leads.filter((l) => l.status === "Converted").length;
    const lost = leads.filter((l) => l.status === "Lost").length;
    const active = leads.filter((l) => !TERMINAL_STATUSES.has(l.status)).length;
    return { total: leads.length, active, converted, lost };
  }, [leads]);

  const openLead = useMemo(() => leads.find((l) => l.id === openLeadId) ?? null, [leads, openLeadId]);

  function handleAddLead(data) {
    const id = `LD-${3000 + leads.length}`;
    const newLead = { ...data, id, createdDate: TODAY, timeline: [{ id: `${id}-t0`, status: data.status, label: "Lead captured", time: "Today" }] };
    setLeads((prev) => [newLead, ...prev]);
    toast.success(`${data.name} added to your leads pipeline`);
  }

  function handleDelete(lead) {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    if (openLeadId === lead.id) setOpenLeadId(null);
    toast.success(`${lead.name} was removed from your leads`);
  }

  function handleAdvance(lead, nextStatus) {
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l)));
    toast.success(
      nextStatus === "Lost" ? `${lead.name} marked as Lost` : `${lead.name} moved to ${nextStatus}`
    );
  }

  function handleStatusChange(leadId, status) {
    const lead = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    toast.success(`${lead?.name ?? "Lead"} status updated to ${status}`);
  }

  function handleReassign(leadId, agent) {
    const lead = leads.find((l) => l.id === leadId);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, assignedAgent: agent } : l)));
    toast.success(`${lead?.name ?? "Lead"} reassigned to ${agent}`);
  }

  function handleSaveNotes(leadId, notes) {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, notes } : l)));
  }

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Leads"
        subtitle="Track and convert enquiries into closed deals."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Contact} label="Total Leads" value={formatCompactNumber(totals.total)} accent="primary" />
        <StatCard icon={TrendingUp} label="In Progress" value={formatCompactNumber(totals.active)} accent="accent" />
        <StatCard icon={CheckCircle2} label="Converted" value={formatCompactNumber(totals.converted)} accent="success" />
        <StatCard icon={XCircle} label="Lost" value={formatCompactNumber(totals.lost)} accent="error" />
      </div>

      <LeadFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="table">
            <Table2 className="h-3.5 w-3.5" />
            Table
          </TabsTrigger>
          <TabsTrigger value="kanban">
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <LeadsTable leads={filtered} onOpen={(lead) => setOpenLeadId(lead.id)} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="kanban">
          <LeadsKanban leads={filtered} onAdvance={handleAdvance} onOpen={(lead) => setOpenLeadId(lead.id)} />
        </TabsContent>
      </Tabs>

      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={handleAddLead} />

      <LeadDetailDrawer
        lead={openLead}
        onOpenChange={(open) => !open && setOpenLeadId(null)}
        onStatusChange={handleStatusChange}
        onReassign={handleReassign}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={null}>
      <LeadsPageInner />
    </Suspense>
  );
}
