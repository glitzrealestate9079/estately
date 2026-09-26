"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";
import { deriveLeadsForListing, daysAgoLabel } from "@/lib/site/template/dashboard-derive";

const LEAD_STAGES = ["New", "Contacted", "Qualified", "Visit Scheduled", "Closed"];
const SOURCE_ICON = { Search: "bi-dot", WhatsApp: "bi-whatsapp", Call: "bi-telephone", "Saved search alert": "bi-bookmark" };

function LeadCard({ lead, onClick }) {
  return (
    <div
      className="lead-card"
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", lead.id);
        e.currentTarget.classList.add("is-dragging");
      }}
      onDragEnd={(e) => e.currentTarget.classList.remove("is-dragging")}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`${lead.name}, ${lead.status}`}
    >
      <div className="between">
        <span className="nm">{lead.name}</span>
        {lead.status === "New" && <span className="dot" style={{ color: "var(--accent)" }} title="New" />}
      </div>
      <div className="pr">{lead.listingTitle}</div>
      <div className="small mt-4"><i className="bi bi-telephone muted" /> {lead.phone}</div>
      <div className="note">&ldquo;{lead.message}&rdquo;</div>
      <div className="ft"><span><i className={`bi ${SOURCE_ICON[lead.source] ?? "bi-dot"}`} /> {lead.source}</span><span>{daysAgoLabel(lead.daysAgo)}</span></div>
    </div>
  );
}

function whatsappText(lead) {
  const locality = lead.listingLocality ? ` in ${lead.listingLocality}` : "";
  return encodeURIComponent(`Hi ${lead.name.split(" ")[0]}, thanks for your interest in my ${lead.listingTitle}${locality} (Estately ${lead.listingId}).`);
}

function ScheduleVisitModal({ lead, onClose, onScheduled }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:00");

  function submit() {
    if (!date || !time) return;
    onScheduled(date, time);
    onClose();
  }

  return (
    <SiteModal
      title={`Schedule visit with ${lead.name.split(" ")[0]}`}
      size={420}
      onClose={onClose}
      foot={<button className="btn btn-primary btn-block" onClick={submit}>Schedule</button>}
    >
      <div className="form-grid">
        <div className="field">
          <label className="label" htmlFor="visit-date">Date</label>
          <input id="visit-date" type="date" className="input" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="label" htmlFor="visit-time">Time</label>
          <input id="visit-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <p className="xs muted mt-12">{lead.name} will be notified to confirm.</p>
    </SiteModal>
  );
}

function LeadPanel({ lead, onClose, onChangeStatus, onAddNote, notes }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [scheduling, setScheduling] = useState(false);

  function saveNote() {
    if (!note.trim()) return;
    onAddNote(note.trim());
    setNote("");
    toast.success("Note saved");
  }

  function handleScheduled(date, time) {
    onChangeStatus("Visit Scheduled");
    onAddNote(`Visit scheduled for ${new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at ${time}`);
    toast.success("Visit scheduled", { action: { label: "View visits", onClick: () => router.push("/dashboard/visits") } });
  }

  return (
    <>
      <div className="drawer-backdrop is-open sp" style={{ zIndex: 2050 }} onClick={onClose} />
      <aside className="side-panel" role="dialog" aria-modal="true" aria-label={`Lead ${lead.name}`}>
        <div className="sp-head">
          <div className="row">
            <span className="avatar">{lead.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
            <div><div className="strong">{lead.name}</div><div className="xs muted">{lead.source} · {daysAgoLabel(lead.daysAgo)}</div></div>
          </div>
          <button className="modal-x" aria-label="Close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>
        <div className="sp-body stack" style={{ "--stack": "18px" }}>
          <div className="grid-2" style={{ gap: 8 }}>
            <a className="btn btn-outline" href={`tel:${lead.phone.replace(/\s/g, "")}`}><i className="bi bi-telephone" />Call</a>
            <a className="btn btn-whatsapp" target="_blank" rel="noopener" href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${whatsappText(lead)}`}>
              <i className="bi bi-whatsapp" />WhatsApp
            </a>
          </div>
          <div className="surface-soft card-pad small">
            <div className="between"><span className="muted">Phone</span><b className="ink">{lead.phone}</b></div>
            <div className="between mt-4"><span className="muted">Prefers</span><span>{lead.preferredContact}</span></div>
            <div className="between mt-4"><span className="muted">Property</span><span>{lead.listingTitle}</span></div>
          </div>
          <div><div className="label mb-8">Message</div><p className="small">&ldquo;{lead.message}&rdquo;</p></div>
          <div className="field">
            <label className="label" htmlFor="lead-status">Status</label>
            <select id="lead-status" className="select" value={lead.status} onChange={(e) => onChangeStatus(e.target.value)}>
              {LEAD_STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="lead-note">Add a note</label>
            <textarea id="lead-note" className="textarea" style={{ minHeight: 80 }} placeholder="e.g. Wants to visit Saturday morning" value={note} onChange={(e) => setNote(e.target.value)} />
            <button type="button" className="btn btn-secondary btn-sm mt-8" style={{ alignSelf: "flex-start" }} onClick={saveNote}>Save note</button>
          </div>
          <div>
            <div className="label mb-8">Activity</div>
            <ul className="timeline">
              {[...notes].reverse().map((n, i) => <li key={i}><div>{n}</div><div className="t">Just now</div></li>)}
              <li><div>Enquired via {lead.source}</div><div className="t">{daysAgoLabel(lead.daysAgo)}</div></li>
            </ul>
          </div>
        </div>
        <div className="sp-foot">
          {lead.status !== "Visit Scheduled" && lead.status !== "Closed" && (
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setScheduling(true)}><i className="bi bi-calendar-plus" />Schedule visit</button>
          )}
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Done</button>
        </div>
      </aside>
      {scheduling && <ScheduleVisitModal lead={lead} onClose={() => setScheduling(false)} onScheduled={handleScheduled} />}
    </>
  );
}

export default function DashboardLeadsPage() {
  const { mounted, myListings } = useSite();
  const [overrides, setOverrides] = useState({});
  const [notesById, setNotesById] = useState({});
  const [openLeadId, setOpenLeadId] = useState(null);
  const [propFilter, setPropFilter] = useState("");
  const [query, setQuery] = useState("");
  const [mobileStage, setMobileStage] = useState("New");

  const baseLeads = useMemo(() => (mounted ? myListings.flatMap(deriveLeadsForListing) : []), [mounted, myListings]);
  const leads = baseLeads.map((l) => ({ ...l, status: overrides[l.id] ?? l.status }));

  if (!mounted) return null;

  const filtered = leads.filter(
    (l) => (!propFilter || l.listingId === propFilter) && (!query || (l.name + l.phone).toLowerCase().includes(query.toLowerCase()))
  );
  const openLead = leads.find((l) => l.id === openLeadId);

  function changeStatus(id, status) {
    const lead = leads.find((l) => l.id === id);
    const from = lead?.status;
    setOverrides((prev) => ({ ...prev, [id]: status }));
    toast(`${lead?.name} → ${status}`, {
      action: { label: "Undo", onClick: () => setOverrides((prev) => ({ ...prev, [id]: from })) },
    });
  }

  function addNote(id, text) {
    setNotesById((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), text] }));
  }

  return (
    <>
      <div className="dash-head">
        <div><h1>Leads</h1><p className="muted mt-4">Open a card to update its status and add notes.</p></div>
      </div>

      <div className="row-wrap mb-16">
        <div className="input-group" style={{ maxWidth: 280, flex: 1 }}>
          <span className="addon"><i className="bi bi-search" /></span>
          <input className="input" placeholder="Search name or phone" value={query} onChange={(e) => setQuery(e.target.value)} style={{ height: 40 }} />
        </div>
        <select className="select" style={{ height: 40, width: "auto", maxWidth: "100%" }} value={propFilter} onChange={(e) => setPropFilter(e.target.value)}>
          <option value="">All listings</option>
          {myListings.map((l) => <option key={l.id} value={l.id}>{l.title} · {l.id}</option>)}
        </select>
      </div>

      <div className="tabs lead-tabs mb-12" style={{ display: "none" }}>
        {LEAD_STAGES.map((stage) => (
          <button key={stage} type="button" className={`tab ${stage === mobileStage ? "is-active" : ""}`} onClick={() => setMobileStage(stage)}>
            {stage}<span className="count">{filtered.filter((l) => l.status === stage).length}</span>
          </button>
        ))}
      </div>

      <div className="kanban">
        {LEAD_STAGES.map((stage) => {
          const items = filtered.filter((l) => l.status === stage);
          return (
            <div
              key={stage}
              className={`kcol ${stage === mobileStage ? "is-mobile-active" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("is-over");
              }}
              onDragLeave={(e) => e.currentTarget.classList.remove("is-over")}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("is-over");
                const id = e.dataTransfer.getData("text/plain");
                if (id) changeStatus(id, stage);
              }}
            >
              <div className="kcol-head"><span>{stage}</span><span className="badge badge-sm">{items.length}</span></div>
              {items.length > 0 ? items.map((l) => (
                <LeadCard key={l.id} lead={l} onClick={() => setOpenLeadId(l.id)} />
              )) : <div className="xs muted" style={{ padding: "14px 6px", textAlign: "center" }}>No leads here</div>}
            </div>
          );
        })}
      </div>

      {openLead && (
        <LeadPanel
          lead={openLead}
          notes={notesById[openLead.id] ?? []}
          onClose={() => setOpenLeadId(null)}
          onChangeStatus={(status) => changeStatus(openLead.id, status)}
          onAddNote={(text) => addNote(openLead.id, text)}
        />
      )}
    </>
  );
}
