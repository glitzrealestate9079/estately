"use client";

import { useMemo, useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { FaqAccordionItem } from "@/components/cms/FaqAccordionItem";
import { FaqFormModal } from "@/components/cms/FaqFormModal";
import { FAQS as INITIAL_FAQS } from "@/data/faqs";
import { FAQ_CATEGORIES, FAQ_DEFAULT_VALUES } from "@/schemas/faqSchema";

export function FaqsSection() {
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [expanded, setExpanded] = useState(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const grouped = useMemo(() => {
    return FAQ_CATEGORIES.map((category) => ({
      category,
      items: faqs.filter((f) => f.category === category),
    })).filter((group) => group.items.length > 0);
  }, [faqs]);

  function toggleExpanded(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openAdd() {
    setFormMode("add");
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(faq) {
    setFormMode("edit");
    setEditTarget(faq);
    setFormOpen(true);
  }

  function handleSubmit(data) {
    if (formMode === "edit" && editTarget) {
      setFaqs((prev) => prev.map((f) => (f.id === editTarget.id ? { ...f, ...data } : f)));
      toast.success("FAQ updated successfully");
    } else {
      const maxIdNumber = faqs.reduce((max, f) => Math.max(max, Number(f.id.split("-")[1]) || 0), 100);
      const newFaq = { id: `FAQ-${maxIdNumber + 1}`, ...data };
      setFaqs((prev) => [...prev, newFaq]);
      toast.success("FAQ added successfully");
    }
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    toast.success("FAQ deleted successfully");
    setDeleteTarget(null);
  }

  const modalDefaultValues =
    formMode === "edit" && editTarget
      ? { question: editTarget.question, answer: editTarget.answer, category: editTarget.category }
      : FAQ_DEFAULT_VALUES;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">{faqs.length} questions across {grouped.length} categories</p>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      {grouped.length === 0 ? (
        <Card>
          <EmptyState icon={HelpCircle} title="No FAQs yet" description="Add a question to populate the public help center." />
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.category} className="animate-slide-up space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-semibold text-foreground">{group.category}</h3>
                <Badge variant="primary">{group.items.length}</Badge>
              </div>
              <div className="space-y-2.5">
                {group.items.map((faq) => (
                  <FaqAccordionItem
                    key={faq.id}
                    faq={faq}
                    expanded={expanded.has(faq.id)}
                    onToggle={toggleExpanded}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqFormModal open={formOpen} onOpenChange={setFormOpen} mode={formMode} defaultValues={modalDefaultValues} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this FAQ?"
        description={`"${deleteTarget?.question}" will be permanently removed from the help center.`}
        confirmLabel="Delete FAQ"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
