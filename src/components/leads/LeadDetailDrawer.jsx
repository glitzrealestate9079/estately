"use client";

import { useEffect, useState } from "react";
import { Building2, Calendar, IndianRupee, Mail, MapPin, Phone, Save, Tag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { getAgentByName, LEAD_AGENTS } from "@/data/leads";
import { LEAD_STATUSES } from "@/schemas/leadSchema";
import { formatCurrency, formatDate, initials } from "@/lib/utils";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground-muted" />
      <div className="min-w-0">
        <p className="text-xs text-foreground-muted">{label}</p>
        <p className="truncate font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function LeadDetailDrawer({ lead, onOpenChange, onStatusChange, onReassign, onSaveNotes }) {
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    setNotes(lead?.notes ?? "");
  }, [lead?.id, lead?.notes]);

  if (!lead) return null;

  const agent = getAgentByName(lead.assignedAgent);
  const notesDirty = notes !== (lead.notes ?? "");

  async function handleSaveNotes() {
    setSavingNotes(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSavingNotes(false);
    onSaveNotes(lead.id, notes);
    toast.success("Notes saved");
  }

  return (
    <Modal open={!!lead} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback>{initials(lead.name)}</AvatarFallback>
            </Avatar>
            <div>
              <ModalTitle>{lead.name}</ModalTitle>
              <ModalDescription>
                {lead.id} · {formatDate(lead.createdDate)}
              </ModalDescription>
            </div>
            <StatusBadge status={lead.status} className="ml-auto mr-6" />
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Phone} label="Phone" value={lead.phone} />
            <InfoRow icon={Mail} label="Email" value={lead.email} />
            <InfoRow icon={Building2} label="Interested Property" value={lead.interestedProperty} />
            <InfoRow icon={MapPin} label="Preferred Location" value={lead.location} />
            <InfoRow icon={IndianRupee} label="Budget" value={formatCurrency(lead.budget)} />
            <InfoRow icon={Tag} label="Property Type" value={lead.propertyType} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">Source: {lead.source}</Badge>
            <Badge variant="default">
              <Calendar className="h-3 w-3" /> Added {formatDate(lead.createdDate)}
            </Badge>
          </div>

          <div className="grid gap-5 rounded-xl border border-border-subtle bg-surface-muted/40 p-4 sm:grid-cols-2">
            <FormField label="Pipeline Status">
              <Select value={lead.status} onValueChange={(value) => onStatusChange(lead.id, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Assigned Agent">
              <Select value={lead.assignedAgent} onValueChange={(value) => onReassign(lead.id, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        {agent?.avatar && <AvatarImage src={agent.avatar} alt={lead.assignedAgent} />}
                        <AvatarFallback className="text-[9px]">{initials(lead.assignedAgent)}</AvatarFallback>
                      </Avatar>
                      {lead.assignedAgent}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LEAD_AGENTS.map((a) => (
                    <SelectItem key={a.id} value={a.name}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {lead.timeline?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">Activity Timeline</p>
              <ul className="space-y-3 border-l border-border-subtle pl-4">
                {[...lead.timeline].reverse().map((step) => (
                  <li key={step.id} className="relative text-sm">
                    <span className="absolute -left-[1.15rem] top-1 h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
                    <p className="font-medium text-foreground">{step.label}</p>
                    <p className="text-xs text-foreground-muted">
                      {step.status} · {step.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <FormField label="Notes" htmlFor="lead-notes" hint="Internal notes visible only to your team.">
            <Textarea
              id="lead-notes"
              rows={4}
              placeholder="Add notes about this lead…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormField>
        </ModalBody>

        <ModalFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="button" onClick={handleSaveNotes} loading={savingNotes} disabled={!notesDirty}>
            <Save className="h-4 w-4" />
            Save Notes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
