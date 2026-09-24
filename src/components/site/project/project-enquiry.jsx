"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";

export default function ProjectEnquiry({ project }) {
  const { requireAuth } = useSite();
  const [message, setMessage] = useState(`I'm interested in ${project.projectName}. Please share more details and pricing.`);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) {
      toast.error("Please add a short message");
      return;
    }
    requireAuth(
      async (user) => {
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 700));
        setSubmitting(false);
        setSent(true);
        toast.success("Enquiry sent to the developer", { description: `They'll reach out to you at ${user.mobile}.` });
      },
      { title: "Contact the developer", description: "Sign in so the developer's sales team can reach you back." }
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-success-50 p-4 text-center dark:bg-success-500/10">
        <CheckCircle2 className="h-7 w-7 text-success-600 dark:text-success-500" />
        <p className="text-sm font-semibold text-success-700 dark:text-success-500">Enquiry sent</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button className="w-full gap-1.5" onClick={handleSend} loading={submitting}>
        <Send className="h-4 w-4" /> Send Enquiry
      </Button>
    </div>
  );
}
