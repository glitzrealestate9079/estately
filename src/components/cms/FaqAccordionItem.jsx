"use client";

import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FaqAccordionItem({ faq, expanded, onToggle, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle">
      <button
        type="button"
        onClick={() => onToggle(faq.id)}
        className="flex w-full items-center justify-between gap-4 bg-surface px-4 py-3.5 text-left transition-colors hover:bg-surface-muted"
        aria-expanded={expanded}
      >
        <span className="text-sm font-medium text-foreground">{faq.question}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-foreground-muted transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="animate-fade-in space-y-3 border-t border-border-subtle bg-surface-muted/40 px-4 py-4">
          <p className="text-sm leading-relaxed text-foreground-muted">{faq.answer}</p>
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => onEdit(faq)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(faq)}
              className="flex items-center gap-1.5 text-xs font-medium text-error-600 hover:text-error-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
