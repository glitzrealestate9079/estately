"use client";

import { useState } from "react";
import { Flag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalTrigger } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REASONS = [
  "Wrong information",
  "Duplicate listing",
  "Fraud / suspicious",
  "Wrong price",
  "Property unavailable",
  "Other",
];

export function ReportListingModal({ propertyTitle }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
  }

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        setReason(null);
        setNote("");
        setSubmitted(false);
      }, 200);
    }
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalTrigger asChild>
        <button className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-error-600">
          <Flag className="h-3.5 w-3.5" /> Report this listing
        </button>
      </ModalTrigger>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Report listing</ModalTitle>
          <ModalDescription>{propertyTitle}</ModalDescription>
        </ModalHeader>
        <ModalBody>
          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <CheckCircle2 className="h-9 w-9 text-success-600 dark:text-success-500" />
              <p className="text-sm font-semibold text-foreground">Thanks — we&apos;ll take a look</p>
              <p className="text-xs text-foreground-muted">Our moderation team reviews every report within 24–48 hours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {REASONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setReason(option)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                      reason === option ? "border-error-500 bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500" : "border-border-subtle text-foreground-muted hover:border-error-300"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <Textarea placeholder="Add details (optional)" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          )}
        </ModalBody>
        {!submitted && (
          <ModalFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmit} loading={submitting}>
              Submit Report
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
