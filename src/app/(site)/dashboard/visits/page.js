"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { SiteModal } from "@/components/site/ui/site-modal";
import { SITE_VISITS } from "@/data/site-visits";

const VISIT_BADGE = { Confirmed: "badge-success", Pending: "", Requested: "badge-warning", Completed: "badge-info", Cancelled: "badge-danger", Rescheduled: "" };
// The shared admin schema's status enum uses "Requested"; the ported design
// displays this state as "Pending" everywhere a visitor sees it — display
// label only, `visit.status` itself is never renamed.
const VISIT_STATUS_LABEL = { Requested: "Pending" };
const STATUS_SUMMARY = ["Confirmed", "Requested", "Completed", "Cancelled"];
const TODAY = new Date("2026-09-24T00:00");

function isUpcoming(v) {
  return new Date(v.date) >= TODAY && ["Confirmed", "Requested"].includes(v.status);
}

function RescheduleModal({ visit, onClose, onRescheduled }) {
  const [date, setDate] = useState(visit.date);
  const [time, setTime] = useState("11:00");

  function submit() {
    if (!date || !time) return;
    onRescheduled(date, time);
    onClose();
  }

  return (
    <SiteModal title="Suggest a new time" size={420} onClose={onClose} foot={<button className="btn btn-primary btn-block" onClick={submit}>Send new time</button>}>
      <div className="form-grid">
        <div className="field">
          <label className="label" htmlFor="resched-date">Date</label>
          <input id="resched-date" type="date" className="input" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label className="label" htmlFor="resched-time">Time</label>
          <input id="resched-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <p className="xs muted mt-12">{visit.buyerName} will be asked to confirm the new time.</p>
    </SiteModal>
  );
}

function CancelConfirmModal({ visit, onClose, onConfirm }) {
  const isPending = visit.status === "Requested";
  return (
    <SiteModal
      title={isPending ? "Decline this visit?" : "Cancel this visit?"}
      size={420}
      onClose={onClose}
      foot={
        <>
          <button className="btn btn-outline" onClick={onClose}>Back</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onClose(); }}>{isPending ? "Decline" : "Cancel visit"}</button>
        </>
      }
    >
      <p className="muted">{visit.buyerName} will be notified. You can suggest another time instead.</p>
    </SiteModal>
  );
}

function VisitCard({ visit, onAction }) {
  const dt = new Date(visit.date);
  const past = dt < TODAY;
  const [modal, setModal] = useState(null);
  return (
    <div className="visit-card">
      <div className="date-block">
        <div className="m">{dt.toLocaleDateString("en-IN", { month: "short" })}</div>
        <div className="d">{dt.getDate()}</div>
        <div className="w">{dt.toLocaleDateString("en-IN", { weekday: "short" })}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row-wrap" style={{ alignItems: "center" }}>
          <span className="strong">{visit.buyerName}</span>
          <span className={`badge badge-sm ${VISIT_BADGE[visit.status] ?? ""}`}>{VISIT_STATUS_LABEL[visit.status] ?? visit.status}</span>
        </div>
        <div className="small muted mt-4"><i className="bi bi-clock" /> {visit.time} · <i className="bi bi-house" /> {visit.propertyTitle}, {visit.city}</div>
        <div className="xs muted mt-4"><i className="bi bi-telephone" /> {visit.buyerPhone}</div>
      </div>
      <div className="vc-actions row">
        {visit.status === "Requested" && (
          <>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onAction("confirm")}>Confirm</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal("reschedule")}>Reschedule</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal("cancel")}>Decline</button>
          </>
        )}
        {visit.status === "Confirmed" && !past && (
          <>
            <a className="btn btn-outline btn-sm" href={`tel:${visit.buyerPhone.replace(/\s/g, "")}`}><i className="bi bi-telephone" />Call</a>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal("reschedule")}>Reschedule</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setModal("cancel")}>Cancel</button>
          </>
        )}
        {visit.status === "Confirmed" && past && (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onAction("complete")}>Mark completed</button>
        )}
      </div>
      {modal === "reschedule" && (
        <RescheduleModal visit={visit} onClose={() => setModal(null)} onRescheduled={(date, time) => onAction("reschedule", { date, time })} />
      )}
      {modal === "cancel" && (
        <CancelConfirmModal visit={visit} onClose={() => setModal(null)} onConfirm={() => onAction("cancel")} />
      )}
    </div>
  );
}

export default function DashboardVisitsPage() {
  const { mounted, myListings } = useSite();
  const [tab, setTab] = useState("upcoming");
  const [overrides, setOverrides] = useState({});

  if (!mounted) return null;

  const myListingTitles = new Set(myListings.map((l) => l.title));
  const all = SITE_VISITS.filter((v) => myListingTitles.has(v.propertyTitle)).map((v) => ({ ...v, ...overrides[v.id] }));
  const upcoming = all.filter(isUpcoming).sort((a, b) => a.date.localeCompare(b.date));
  const past = all.filter((v) => !isUpcoming(v)).sort((a, b) => b.date.localeCompare(a.date));
  const list = tab === "upcoming" ? upcoming : past;

  function act(visit, action, payload) {
    if (action === "reschedule") {
      const [h, mi] = payload.time.split(":");
      const hour12 = Number(h) % 12 || 12;
      const time = `${hour12}:${mi} ${Number(h) < 12 ? "AM" : "PM"}`;
      setOverrides((prev) => ({ ...prev, [visit.id]: { status: "Requested", date: payload.date, time } }));
      toast.success("New time sent");
      return;
    }
    const next = { confirm: "Confirmed", complete: "Completed", cancel: "Cancelled" }[action];
    setOverrides((prev) => ({ ...prev, [visit.id]: { ...prev[visit.id], status: next } }));
    const messages = { confirm: `Visit confirmed — ${visit.buyerName} will be notified`, complete: "Marked as completed", cancel: "Visit cancelled" };
    toast.success(messages[action]);
  }

  return (
    <>
      <div className="dash-head">
        <div><h1>Visits</h1><p className="muted mt-4">Confirm requests quickly — buyers plan their day around it.</p></div>
      </div>

      {all.length > 0 && (
        <div className="row-wrap mb-16 small muted">
          {STATUS_SUMMARY.map((s) => (
            <span key={s} className="row" style={{ gap: 6 }}>
              <span className={`badge badge-sm ${VISIT_BADGE[s] ?? ""}`}>{VISIT_STATUS_LABEL[s] ?? s}</span>
              {all.filter((v) => v.status === s).length}
            </span>
          ))}
        </div>
      )}

      <div className="tabs mb-16">
        <button type="button" className={`tab ${tab === "upcoming" ? "is-active" : ""}`} onClick={() => setTab("upcoming")}>Upcoming<span className="count">{upcoming.length}</span></button>
        <button type="button" className={`tab ${tab === "past" ? "is-active" : ""}`} onClick={() => setTab("past")}>Past &amp; cancelled<span className="count">{past.length}</span></button>
      </div>

      {all.length === 0 ? (
        <div className="card"><div className="state"><i className="bi bi-calendar state-ico" /><h3>No site visits yet</h3></div></div>
      ) : (
        <div className="stack" style={{ "--stack": "12px" }}>
          {list.length > 0 ? list.map((v) => (
            <VisitCard key={v.id} visit={v} onAction={(a, payload) => act(v, a, payload)} />
          )) : (
            <div className="card">
              <div className="state">
                <i className="bi bi-calendar state-ico" />
                <h3>{tab === "upcoming" ? "No upcoming visits" : "No past visits"}</h3>
                {tab === "upcoming" && <p className="muted">When a buyer requests a visit, it appears here for you to confirm.</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
