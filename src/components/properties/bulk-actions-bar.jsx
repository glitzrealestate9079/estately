"use client";

import { useState } from "react";
import { CheckCircle2, Trash2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RejectReasonModal } from "@/components/properties/reject-reason-modal";

// onReject receives the rejection reason: (reason: string) => void
export function BulkActionsBar({ count, onApprove, onReject, onDelete, onClear }) {
  const [rejectOpen, setRejectOpen] = useState(false);

  function confirmBulkReject(reason) {
    onReject(reason);
    setRejectOpen(false);
  }

  return (
    <>
      {count > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm dark:border-primary-500/20 dark:bg-primary-500/10">
          <span className="font-medium text-primary-700 dark:text-primary-400">{count} selected</span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={onApprove}>
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRejectOpen(true)}>
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <RejectReasonModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject properties"
        description={`This reason will be shared with the owner${count === 1 ? "" : "s"} of the ${count} selected propert${
          count === 1 ? "y" : "ies"
        }.`}
        confirmLabel={`Reject ${count} Propert${count === 1 ? "y" : "ies"}`}
        onConfirm={confirmBulkReject}
      />
    </>
  );
}
