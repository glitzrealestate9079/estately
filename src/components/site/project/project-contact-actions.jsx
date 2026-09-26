"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";

// Projects have no direct phone number in the admin schema (developer
// contact is enquiry-only), so this offers Enquire + Schedule visit —
// unlike ContactActions for properties, no Call/WhatsApp.
export function ProjectContactActions({ project, layout = "block" }) {
  const { requireAuth } = useSite();
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState(`I'm interested in ${project.name}. Please share more details.`);
  const [visitDate, setVisitDate] = useState("");
  const [sending, setSending] = useState(false);

  function openEnquire() {
    requireAuth(() => setModal("enquire"), { title: "Enquire about this project", description: "Sign in so the developer can reach you back." });
  }
  function openVisit() {
    requireAuth(() => setModal("visit"), { title: "Schedule a site visit", description: "Sign in to schedule a visit." });
  }
  async function sendEnquiry() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setModal(null);
    toast.success("Enquiry sent!", { description: `${project.developer} will get back to you soon.` });
  }
  function confirmVisit() {
    if (!visitDate) return;
    setModal(null);
    toast.success("Visit requested", { description: `We'll confirm your site visit on ${visitDate}.` });
  }

  return (
    <>
      {layout === "block" ? (
        <div className="stack mt-16" style={{ "--stack": "10px" }}>
          <button className="btn btn-primary btn-lg btn-block" onClick={openEnquire}><i className="bi bi-chat-left-text" />Enquire now</button>
          <button className="btn btn-secondary btn-block" onClick={openVisit}><i className="bi bi-calendar-check" />Schedule site visit</button>
        </div>
      ) : (
        <div className="row-wrap hide-mobile">
          <button className="btn btn-primary btn-lg" onClick={openEnquire}><i className="bi bi-chat-left-text" />Enquire now</button>
        </div>
      )}

      {modal === "enquire" && (
        <SiteModal title="Enquire about this project" onClose={() => setModal(null)}>
          <div className="field">
            <label className="label" htmlFor="proj-enq-msg">Message</label>
            <textarea id="proj-enq-msg" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className={`btn btn-primary btn-lg btn-block mt-16 ${sending ? "is-loading" : ""}`} onClick={sendEnquiry}>Send enquiry</button>
        </SiteModal>
      )}

      {modal === "visit" && (
        <SiteModal title="Schedule a site visit" onClose={() => setModal(null)}>
          <div className="field">
            <label className="label" htmlFor="proj-visit-date">Preferred date</label>
            <input id="proj-visit-date" className="input" type="date" min={new Date().toISOString().slice(0, 10)} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-lg btn-block mt-16" onClick={confirmVisit}>Request visit</button>
        </SiteModal>
      )}
    </>
  );
}
