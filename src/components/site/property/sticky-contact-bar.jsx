"use client";

import { CalendarClock, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScheduleVisitModal } from "@/components/site/property/schedule-visit-modal";
import { useSite } from "@/components/site/providers/site-provider";
import { formatPrice } from "@/lib/site/format";

export function StickyContactBar({ property }) {
  const { requireAuth } = useSite();

  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border-subtle bg-surface/95 px-3 py-2.5 shadow-popover backdrop-blur-lg lg:hidden">
      <div className="mb-2 flex items-center justify-between px-1 text-xs">
        <span className="truncate font-semibold text-foreground">{formatPrice(property)}</span>
        <span className="truncate text-foreground-muted">{property.location.locality}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="md"
          className="gap-1"
          onClick={() => requireAuth(() => toast.success("Number revealed — call now"), { title: "View contact number" })}
        >
          <Phone className="h-4 w-4" /> Call
        </Button>
        <Button
          variant="outline"
          size="md"
          className="gap-1"
          onClick={() => requireAuth(() => toast.success("Opening WhatsApp chat…"), { title: "Chat on WhatsApp" })}
        >
          <MessageCircle className="h-4 w-4" /> Chat
        </Button>
        <ScheduleVisitModal
          property={property}
          trigger={
            <Button size="md" className="gap-1">
              <CalendarClock className="h-4 w-4" /> Visit
            </Button>
          }
        />
      </div>
    </div>
  );
}
