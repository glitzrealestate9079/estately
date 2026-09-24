"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

// Shared reason-capture step for every "Reject" flow (approvals queue, the
// properties table row action, and bulk actions). Keeping this in one place
// means a rejection can never go through without a reason being collected,
// and every surface that shows a rejected listing has the same reason text
// to display.
export function RejectReasonModal({
  open,
  onOpenChange,
  title = "Reject property",
  description = "This reason will be shared with the property owner.",
  confirmLabel = "Reject Property",
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  function handleOpenChange(next) {
    if (!next) setReason("");
    onOpenChange?.(next);
  }

  function handleConfirm() {
    onConfirm?.(reason.trim());
    setReason("");
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <FormField label="Rejection reason" hint="This will be shared with the property owner.">
            <Textarea
              rows={4}
              placeholder="e.g. Missing RERA number, unclear property images…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </FormField>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
