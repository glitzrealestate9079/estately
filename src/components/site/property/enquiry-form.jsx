"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Phone, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";

const QUICK_PROMPTS = ["Is this available?", "Can I schedule a visit?", "Is the price negotiable?", "Can you share the exact location?"];

export function EnquiryForm({ property }) {
  const { auth, requireAuth } = useSite();
  const [message, setMessage] = useState(
    `I'm interested in this ${property.bedrooms ? `${property.bedrooms} BHK ` : ""}${property.type} in ${property.location.locality}.`
  );
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function actuallySend(user) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSent(true);
    toast.success("Enquiry sent!", { description: `${property.owner.name} will get back to you at ${user.mobile}.` });
  }

  function handleSend() {
    if (!message.trim()) {
      toast.error("Please add a short message before sending");
      return;
    }
    requireAuth(actuallySend, {
      title: "Contact the seller",
      description: "Sign in with your mobile number so the seller can reach you back.",
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-success-50 p-5 text-center dark:bg-success-500/10">
        <CheckCircle2 className="h-8 w-8 text-success-600 dark:text-success-500" />
        <p className="text-sm font-semibold text-success-700 dark:text-success-500">Enquiry sent successfully</p>
        <p className="text-xs text-foreground-muted">The seller / agent usually responds within a few hours.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {auth.isAuthenticated && (
        <div className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-xs text-foreground-muted">
          <User className="h-3.5 w-3.5" /> {auth.user.name} · {auth.user.mobile}
        </div>
      )}
      <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message to the seller…" />
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setMessage(prompt)}
            className="rounded-full border border-border-subtle px-2.5 py-1 text-[11px] text-foreground-muted hover:border-primary-300 hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="gap-1.5" onClick={() => requireAuth(() => toast.success("Number revealed — call now"), { title: "View contact number" })}>
          <Phone className="h-4 w-4" /> Call
        </Button>
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => requireAuth(() => toast.success("Opening WhatsApp chat…"), { title: "Chat on WhatsApp" })}
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </Button>
      </div>
      <Button className="w-full gap-1.5" onClick={handleSend} loading={submitting}>
        <Send className="h-4 w-4" /> Send Enquiry
      </Button>
    </div>
  );
}
