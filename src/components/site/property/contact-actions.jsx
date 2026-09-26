"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";

function phoneLabel(revealed, property) {
  return revealed ? property.owner.phone : "Call";
}

function SellerVariant({ sellerWord, phoneRevealed, property, openContact, openCall }) {
  return (
    <div className="row-wrap mt-12">
      <button className="btn btn-primary btn-sm" onClick={openContact}>Contact {sellerWord.toLowerCase()}</button>
      <button className="btn btn-outline btn-sm" onClick={openCall}><i className="bi bi-telephone" />{phoneRevealed ? property.owner.phone : "View phone"}</button>
    </div>
  );
}

function SidebarVariant({ sellerWord, phoneRevealed, property, openContact, openVisit, openCall, openWhatsapp }) {
  return (
    <div className="stack" style={{ "--stack": "10px" }}>
      <button className="btn btn-primary btn-lg btn-block" onClick={openContact}><i className="bi bi-chat-left-text" />Contact {sellerWord}</button>
      <button className="btn btn-secondary btn-block" onClick={openVisit}><i className="bi bi-calendar-check" />Schedule visit</button>
      <div className="grid-2" style={{ gap: 10 }}>
        <button className="btn btn-outline" onClick={openCall}><i className="bi bi-telephone" />{phoneLabel(phoneRevealed, property)}</button>
        <button className="btn btn-outline" onClick={openWhatsapp}><i className="bi bi-whatsapp" style={{ color: "#1a9e54" }} />WhatsApp</button>
      </div>
    </div>
  );
}

function MobileCtaVariant({ openCallDirect, openWhatsapp, openVisit }) {
  return (
    <div className="mobile-cta">
      <button className="btn btn-outline" onClick={openCallDirect}><i className="bi bi-telephone" />Call</button>
      <button className="btn btn-whatsapp" onClick={openWhatsapp}><i className="bi bi-whatsapp" />WhatsApp</button>
      <button className="btn btn-primary" onClick={openVisit}><i className="bi bi-calendar-check" />Visit</button>
    </div>
  );
}

function RowVariant({ size, disabled, phoneRevealed, property, openContact, openCall, openWhatsapp }) {
  const btnClass = size === "sm" ? "btn btn-outline btn-sm" : "btn btn-outline";
  return (
    <div className="row-wrap">
      <button className={btnClass} onClick={openCall} disabled={disabled}><i className="bi bi-telephone" />{phoneLabel(phoneRevealed, property)}</button>
      <button className={btnClass} onClick={openWhatsapp} disabled={disabled}><i className="bi bi-whatsapp" style={{ color: "#1a9e54" }} />WhatsApp</button>
      <button className={size === "sm" ? "btn btn-primary btn-sm" : "btn btn-primary"} onClick={openContact} disabled={disabled}><i className="bi bi-chat-left-text" />Contact</button>
    </div>
  );
}

// Ported UX (intent-preserving login gate + contact/call/WhatsApp/visit
// flows) from the prototype's app.js requireAuth()/openEnquiry()/openVisit()
// pattern — new modal markup, backed by this app's real owner/agent data.
// `variant`: "row" (property cards), "seller" (About the owner/builder/agent
// section — Contact + View phone only), "sidebar" (contact-card — Contact,
// Schedule visit, Call, WhatsApp).
export function ContactActions({ property, disabled, size = "default", variant = "row" }) {
  const { requireAuth } = useSite();
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState(`I'm interested in this ${property.title}. Is it still available?`);
  const [sending, setSending] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const sellerWord = property.sellerType?.startsWith("Builder") ? "Builder" : (property.sellerType ?? "Owner");

  function openContact() {
    requireAuth(() => setModal("contact"), { title: "Contact the seller", description: "Sign in so the seller can reach you back." });
  }
  function openVisit() {
    requireAuth(() => setModal("visit"), { title: "Schedule a visit", description: "Sign in to schedule a site visit." });
  }
  function openCall() {
    requireAuth(() => setPhoneRevealed(true), { title: "View phone number", description: "Sign in to view the seller's phone number." });
  }
  function openCallDirect() {
    requireAuth(() => { window.location.href = `tel:${property.owner.phone}`; }, { title: "Call the seller", description: "Sign in to call the seller." });
  }
  function openWhatsapp() {
    requireAuth(() => {
      const text = encodeURIComponent(`Hi, I'm interested in ${property.title} (${property.id}).`);
      window.open(`https://wa.me/91${property.owner.phone.replace(/\D/g, "").slice(-10)}?text=${text}`, "_blank");
    }, { title: "Contact on WhatsApp", description: "Sign in to message the seller on WhatsApp." });
  }

  async function sendEnquiry() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setModal(null);
    toast.success("Enquiry sent!", { description: `${property.owner.name} will get back to you soon.` });
  }

  function confirmVisit() {
    if (!visitDate) return;
    setModal(null);
    toast.success("Visit requested", { description: `We'll confirm your visit on ${visitDate} with the seller.` });
  }

  const actionProps = { sellerWord, phoneRevealed, property, openContact, openVisit, openCall, openCallDirect, openWhatsapp, size, disabled };

  return (
    <>
      {!disabled && variant === "seller" && <SellerVariant {...actionProps} />}
      {!disabled && variant === "sidebar" && <SidebarVariant {...actionProps} />}
      {!disabled && variant === "row" && <RowVariant {...actionProps} />}
      {!disabled && variant === "mobile-cta" && <MobileCtaVariant {...actionProps} />}

      {modal === "contact" && (
        <SiteModal title="Contact seller" onClose={() => setModal(null)}>
          <div className="field">
            <label className="label" htmlFor="enq-msg">Message</label>
            <textarea id="enq-msg" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className={`btn btn-primary btn-lg btn-block mt-16 ${sending ? "is-loading" : ""}`} onClick={sendEnquiry}>Send enquiry</button>
        </SiteModal>
      )}

      {modal === "visit" && (
        <SiteModal title="Schedule a visit" onClose={() => setModal(null)}>
          <div className="field">
            <label className="label" htmlFor="visit-date">Preferred date</label>
            <input id="visit-date" className="input" type="date" min={new Date().toISOString().slice(0, 10)} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-lg btn-block mt-16" onClick={confirmVisit}>Request visit</button>
        </SiteModal>
      )}
    </>
  );
}
