"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { EmiCalculator } from "@/components/site/property/emi-calculator";
import { useSite } from "@/components/site/providers/site-provider";

const SERVICES = [
  ["loan", "Home Loans", "bi-bank", "Compare home loan offers from partner banks and check eligibility.", "Request a callback", true],
  ["emi", "EMI Calculator", "bi-calculator", "Estimate monthly payments for any property price.", "Open calculator", true],
  ["valuation", "Property Valuation", "bi-graph-up", "An estimate based on recent comparable listings in your locality.", "Coming soon", false],
  ["legal", "Legal Verification", "bi-file-earmark-check", "Title search and document review by empanelled lawyers.", "Coming soon", false],
  ["agreement", "Rent Agreement", "bi-file-earmark-text", "Draft, e-stamp and sign your rent agreement online.", "Coming soon", false],
  ["home", "Home Services", "bi-tools", "Packers & movers, painting, cleaning and repairs.", "Coming soon", false],
  ["pm", "Property Management", "bi-building-gear", "Tenant finding, rent collection and maintenance for owners.", "Coming soon", false],
];

export default function ServicesPage() {
  const { mounted, auth } = useSite();
  const [priceInput, setPriceInput] = useState("50,00,000");
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#emi") {
      setTimeout(() => document.getElementById("emi-calc")?.scrollIntoView(), 200);
    }
  }, []);

  const price = Math.max(Number(priceInput.replace(/\D/g, "")) || 0, 100000);

  function handleServiceClick(key) {
    if (key === "emi") {
      document.getElementById("emi-calc")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (key === "loan") {
      if (mounted && auth.isAuthenticated) {
        setName(auth.user.name ?? "");
        setPhone((auth.user.phone ?? "").replace(/\D/g, "").slice(-10));
      }
      setCallbackOpen(true);
    }
  }

  async function submitCallback() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneInvalid(true);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setCallbackOpen(false);
    toast.success("Callback requested", { description: "We'll call you within one working day." });
  }

  return (
    <main className="container">
      <div className="page-head">
        <h1>Services</h1>
        <p>Help with the steps around buying, renting and moving. Your property search stays front and centre — these are here when you need them.</p>
      </div>

      <div className="grid-3 mt-24">
        {SERVICES.map(([key, title, icon, desc, cta, live]) => (
          <div key={key} id={key} className="svc" style={{ flexDirection: "column", gap: 12 }}>
            <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
              <span className="ico"><i className={`bi ${icon}`} /></span>
              <div><div className="t">{title}</div><div className="s">{desc}</div></div>
            </div>
            {live ? (
              <button type="button" className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => handleServiceClick(key)}>{cta}</button>
            ) : (
              <span className="badge badge-sm" style={{ alignSelf: "flex-start" }}>Coming soon</span>
            )}
          </div>
        ))}
      </div>

      <section className="section" id="emi-calc">
        <div className="card card-pad-lg">
          <h2 className="h3 mb-16">EMI calculator</h2>
          <div className="field mb-16" style={{ maxWidth: 280 }}>
            <label className="label" htmlFor="emiPrice">Property price</label>
            <div className="input-group">
              <span className="addon">₹</span>
              <input
                id="emiPrice"
                className="input"
                inputMode="numeric"
                value={priceInput}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setPriceInput(digits ? Number(digits).toLocaleString("en-IN") : "");
                }}
              />
            </div>
          </div>
          <EmiCalculator price={price} />
        </div>
      </section>

      <div className="mt-24">
        <Link className="btn btn-primary btn-lg" href="/"><i className="bi bi-search" />Back to property search</Link>
      </div>

      {callbackOpen && (
        <div className="modal-root">
          <div className="modal-backdrop" onClick={() => setCallbackOpen(false)} />
          <div className="modal" role="dialog" aria-modal="true" aria-label="Home loan callback" style={{ "--mw": "440px" }}>
            <div className="sheet-handle" />
            <div className="modal-head">
              <h3>Home loan callback</h3>
              <button className="modal-x" aria-label="Close" onClick={() => setCallbackOpen(false)}><i className="bi bi-x-lg" /></button>
            </div>
            <div className="modal-body">
              <div className="stack" style={{ "--stack": "14px" }}>
                <div className="field">
                  <label className="label" htmlFor="cb-n">Name</label>
                  <input id="cb-n" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={`field ${phoneInvalid ? "is-invalid" : ""}`}>
                  <label className="label" htmlFor="cb-p">Mobile</label>
                  <div className="input-group">
                    <span className="addon">+91</span>
                    <input id="cb-p" className="input" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneInvalid(false); }} />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="cb-a">Loan amount needed <span className="opt">(optional)</span></label>
                  <input id="cb-a" className="input" placeholder="e.g. 40,00,000" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <p className="xs muted">A loan advisor will call you. We never share your number with banks without your consent.</p>
              </div>
            </div>
            <div className="modal-foot">
              <button className={`btn btn-primary btn-block btn-lg ${submitting ? "is-loading" : ""}`} onClick={submitCallback}>Request callback</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
