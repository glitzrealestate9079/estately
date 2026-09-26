"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";
import { inr, num } from "@/lib/site/template/format";

// Ported from the prototype's Units section in project.js (township-specific
// tower filtering dropped — no real per-tower data model to back it).
export function UnitsTable({ units, project }) {
  const { requireAuth } = useSite();
  const bhkOptions = [...new Set(units.map((u) => u.name))];
  const [filter, setFilter] = useState("");
  const [enquireUnit, setEnquireUnit] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const rows = filter ? units.filter((u) => u.name === filter) : units;

  function openEnquire(unit) {
    requireAuth(
      () => {
        setMessage(`I'm interested in the ${unit.name} unit at ${project.name}. Please share more details.`);
        setEnquireUnit(unit);
      },
      { title: "Enquire about this unit", description: "Sign in so the developer can reach you back." }
    );
  }

  async function sendEnquiry() {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setEnquireUnit(null);
    toast.success("Enquiry sent!", { description: `${project.developer} will get back to you soon.` });
  }

  return (
    <>
      <div className="row-wrap mb-16">
        <button type="button" className={`chip chip-sm ${!filter ? "is-active" : ""}`} onClick={() => setFilter("")}>All</button>
        {bhkOptions.map((name) => (
          <button key={name} type="button" className={`chip chip-sm ${filter === name ? "is-active" : ""}`} onClick={() => setFilter(name)}>{name}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Unit type</th><th>Super area</th><th>Carpet</th><th>Price</th><th>Available</th><th /></tr></thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={i}>
                <td className="strong">{u.name}</td>
                <td>{num(u.size)} sq.ft</td>
                <td>{num(u.carpet)} sq.ft</td>
                <td className="strong">{inr(u.price)}</td>
                <td>{u.available == null ? <span className="badge badge-info badge-sm">At launch</span> : u.available < 10 ? <span className="badge badge-warning badge-sm">{u.available} left</span> : `${u.available} units`}</td>
                <td><button type="button" className="btn btn-outline btn-sm" onClick={() => openEnquire(u)}>Enquire</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enquireUnit && (
        <SiteModal title="Enquire about this unit" onClose={() => setEnquireUnit(null)}>
          <div className="field">
            <label className="label" htmlFor="unit-enq-msg">Message</label>
            <textarea id="unit-enq-msg" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button className={`btn btn-primary btn-lg btn-block mt-16 ${sending ? "is-loading" : ""}`} onClick={sendEnquiry}>Send enquiry</button>
        </SiteModal>
      )}
    </>
  );
}
