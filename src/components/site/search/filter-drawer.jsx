"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { FilterForm } from "@/components/site/search/filter-form";
import { Button } from "@/components/ui/button";

export function FilterDrawer({ open, onOpenChange, category, filters, setFilters, resetFilters, resultCount }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-[2px] data-[state=open]:animate-fade-in lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface data-[state=open]:animate-slide-up lg:hidden">
          <div className="flex items-center justify-between border-b border-border-subtle p-4">
            <DialogPrimitive.Title className="font-display text-base font-semibold text-foreground">
              Filters
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <FilterForm category={category} filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
          </div>

          <div className="flex items-center gap-3 border-t border-border-subtle p-4" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
            <Button variant="outline" className="flex-1" onClick={resetFilters}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => onOpenChange(false)}>
              Show {resultCount} {resultCount === 1 ? "Property" : "Properties"}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
