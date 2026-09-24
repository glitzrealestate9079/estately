"use client";

import { useState } from "react";
import { CalendarCheck2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalTrigger } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";
import { cn } from "@/lib/utils";

const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "4:30 PM", "6:00 PM"];

function nextDays(count) {
  const base = new Date("2026-09-24T00:00:00Z");
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(base);
    date.setDate(date.getDate() + i + 1);
    return date;
  });
}

export function ScheduleVisitModal({ property, trigger }) {
  const { requireAuth } = useSite();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const days = nextDays(6);

  function handleConfirm() {
    if (selectedSlot === null) {
      toast.error("Please select a time slot");
      return;
    }
    requireAuth(async (user) => {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 700));
      setSubmitting(false);
      setConfirmed(true);
      toast.success("Visit requested", {
        description: `We'll confirm your visit to ${property.location.locality} and notify ${user.mobile}.`,
      });
    }, { title: "Confirm your phone number", description: "The seller will use this number to confirm your visit." });
  }

  return (
    <Modal open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setConfirmed(false); setSelectedSlot(null); } }}>
      <ModalTrigger asChild>{trigger}</ModalTrigger>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>Schedule a site visit</ModalTitle>
          <ModalDescription>{property.title} — {property.location.locality}, {property.location.city}</ModalDescription>
        </ModalHeader>
        <ModalBody>
          {confirmed ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <CalendarCheck2 className="h-10 w-10 text-success-600 dark:text-success-500" />
              <p className="font-display text-base font-semibold text-foreground">Visit requested</p>
              <p className="text-sm text-foreground-muted">
                {days[selectedDate].toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })} at {TIME_SLOTS[selectedSlot]}
              </p>
              <p className="text-xs text-foreground-muted">The seller/agent will confirm shortly.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Select date</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {days.map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(index)}
                      className={cn(
                        "flex min-w-16 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                        selectedDate === index ? "border-primary-600 bg-primary-600 text-white" : "border-border-subtle text-foreground-muted hover:border-primary-300"
                      )}
                    >
                      <span>{date.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      <span className="text-sm font-bold">{date.getDate()}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Select time</p>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot, index) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(index)}
                      className={cn(
                        "flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                        selectedSlot === index ? "border-primary-600 bg-primary-600 text-white" : "border-border-subtle text-foreground-muted hover:border-primary-300"
                      )}
                    >
                      <CalendarClock className="h-3.5 w-3.5" /> {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        {!confirmed && (
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} loading={submitting}>
              Confirm Visit
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
