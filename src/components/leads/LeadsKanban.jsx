"use client";

import { ArrowRight, Contact, IndianRupee, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { getAgentByName } from "@/data/leads";
import { LEAD_STATUSES } from "@/schemas/leadSchema";
import { cn, formatCurrency, initials } from "@/lib/utils";

// Linear "forward progress" pipeline — Lost is a separate terminal state that
// a lead can drop into from any of these stages, not a step in the sequence.
const FORWARD_STATUSES = LEAD_STATUSES.filter((status) => status !== "Lost");

const COLUMN_ACCENTS = {
  New: "border-t-info-500",
  Contacted: "border-t-info-500",
  "Follow-up": "border-t-warning-500",
  Interested: "border-t-info-500",
  "Site Visit": "border-t-info-500",
  Negotiation: "border-t-info-500",
  Converted: "border-t-success-500",
  Lost: "border-t-error-500",
};

function LeadCard({ lead, onAdvance, onOpen }) {
  const agent = getAgentByName(lead.assignedAgent);
  const forwardIndex = FORWARD_STATUSES.indexOf(lead.status);
  const nextStatus = forwardIndex >= 0 ? FORWARD_STATUSES[forwardIndex + 1] : undefined;
  const canAdvance = !!nextStatus;
  const canMarkLost = lead.status !== "Lost" && lead.status !== "Converted";

  return (
    <Card hover className="animate-fade-in space-y-3 p-4">
      <button className="w-full text-left" onClick={() => onOpen(lead)}>
        <p className="truncate text-sm font-semibold text-foreground">{lead.name}</p>
        <p className="mt-0.5 truncate text-xs text-foreground-muted">{lead.interestedProperty}</p>
      </button>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <IndianRupee className="h-3.5 w-3.5 text-foreground-muted" />
          {formatCurrency(lead.budget).replace("₹", "")}
        </span>
        <div className="flex items-center gap-1.5">
          <Avatar className="h-6 w-6">
            {agent?.avatar && <AvatarImage src={agent.avatar} alt={lead.assignedAgent} />}
            <AvatarFallback className="text-[10px]">{initials(lead.assignedAgent)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={!canAdvance}
          onClick={() => canAdvance && onAdvance(lead, nextStatus)}
        >
          {canAdvance ? nextStatus : "Final stage"}
          {canAdvance && <ArrowRight className="h-3.5 w-3.5" />}
        </Button>
        {canMarkLost && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-error-600 hover:bg-error-50 hover:text-error-700 dark:hover:bg-error-500/10"
            aria-label="Mark as lost"
            onClick={() => onAdvance(lead, "Lost")}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}

export function LeadsKanban({ leads, onAdvance, onOpen }) {
  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Contact}
          title="No leads found"
          description="Try adjusting your filters or search terms to find what you're looking for."
        />
      </Card>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {LEAD_STATUSES.map((status) => {
        const columnLeads = leads.filter((lead) => lead.status === status);
        return (
          <div key={status} className="w-72 shrink-0">
            <div className={cn("flex items-center justify-between rounded-t-xl border-t-2 bg-surface-muted/60 px-3 py-2.5", COLUMN_ACCENTS[status])}>
              <p className="text-sm font-semibold text-foreground">{status}</p>
              <Badge variant="default">{columnLeads.length}</Badge>
            </div>
            <div className="flex min-h-[120px] flex-col gap-3 rounded-b-xl border border-t-0 border-border-subtle bg-surface-muted/20 p-3">
              {columnLeads.length === 0 ? (
                <p className="py-6 text-center text-xs text-foreground-muted">No leads in this stage</p>
              ) : (
                columnLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onAdvance={onAdvance} onOpen={onOpen} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
