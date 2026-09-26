"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";

const ACCOUNT_TYPES = ["Owner", "Agent", "Builder"];

function initials(name) {
  return String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function DashboardProfilePage() {
  const { mounted, auth, savedIds, savedSearches, logout } = useSite();
  const [name, setName] = useState(auth.user?.name ?? "");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [idStatus, setIdStatus] = useState("none");
  const [prefs, setPrefs] = useState({ whatsapp: true, sms: true, email: false, hidePhone: false });

  if (!mounted) return null;

  // Initialise once mounted state gives us a real auth.user, without an
  // effect: guarded so it only fires while the local field is still blank.
  if (auth.user && !name) setName(auth.user.name ?? "");
  if (auth.user && !type) setType(auth.user.type?.startsWith("Builder") ? "Builder" : auth.user.type ?? "Owner");

  function saveProfile() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    toast.success("Profile saved");
  }

  function updatePref(key, value) {
    setPrefs((p) => ({ ...p, [key]: value }));
    toast.success("Preference saved");
  }

  function verifyEmail() {
    if (!email.trim()) return;
    setTimeout(() => {
      setEmailVerified(true);
      toast.success("Email verified");
    }, 500);
  }

  function uploadId() {
    setIdStatus("pending");
    toast.success("ID uploaded — review takes up to 48 hours");
  }

  return (
    <>
      <div className="dash-head"><h1>Profile</h1></div>
      <div className="grid-2" style={{ alignItems: "start", gap: 20 }}>
        <div className="stack" style={{ "--stack": "20px" }}>
          <div className="card card-pad-lg">
            <div className="row" style={{ gap: 16 }}>
              <span className="avatar avatar-lg">{initials(auth.user?.name)}</span>
              <div className="grow">
                <div className="h3">{auth.user?.name}</div>
                <div className="small muted">Member since 2026</div>
                <button type="button" className="btn-link small mt-4" onClick={() => toast("Photo upload isn't part of the prototype")}>Change photo</button>
              </div>
            </div>
            <div className="form-grid mt-24">
              <div className="field span-2">
                <label className="label" htmlFor="pn">Name</label>
                <input className="input" id="pn" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label className="label">Phone</label>
                <div className="input-group">
                  <input className="input" value={auth.user?.phone ? `+91 ${auth.user.phone}` : ""} readOnly style={{ background: "var(--surface-2)" }} />
                  <span className="addon" style={{ color: "var(--success)" }}><i className="bi bi-patch-check-fill" /></span>
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="pe">Email</label>
                <input className="input" id="pe" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="field span-2">
                <span className="label">Account type</span>
                <div className="seg">
                  {ACCOUNT_TYPES.map((t) => (
                    <button key={t} type="button" className={type === t ? "is-active" : ""} onClick={() => setType(t)}>
                      {t === "Builder" ? "Builder / Developer" : t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button type="button" className="btn btn-primary mt-24" onClick={saveProfile}>Save changes</button>
          </div>

          <div className="card card-pad-lg">
            <div className="h4 mb-8">Verification</div>
            <p className="xs muted">Each completed check appears as its own badge on your listings.</p>
            <div className="verify-row" style={{ border: 0, borderBottom: "1px solid var(--border)", borderRadius: 0, padding: "14px 0" }}>
              <span className="vi"><i className="bi bi-check-lg" /></span>
              <div className="grow"><div className="strong small">Phone</div><div className="xs muted">Verified by OTP</div></div>
              <span className="badge badge-success badge-sm">Verified</span>
            </div>
            <div className="verify-row" style={{ border: 0, borderBottom: "1px solid var(--border)", borderRadius: 0, padding: "14px 0" }}>
              <span className="vi"><i className={`bi ${emailVerified ? "bi-check-lg" : "bi-dash-lg"}`} /></span>
              <div className="grow"><div className="strong small">Email</div><div className="xs muted">{email || "Add an email address"}</div></div>
              {emailVerified ? <span className="badge badge-success badge-sm">Verified</span> : <button type="button" className="btn btn-outline btn-sm" onClick={verifyEmail}>Verify</button>}
            </div>
            <div className="verify-row" style={{ border: 0, padding: "14px 0" }}>
              <span className="vi"><i className={`bi ${idStatus === "none" ? "bi-dash-lg" : "bi-check-lg"}`} /></span>
              <div className="grow"><div className="strong small">Identity</div><div className="xs muted">Aadhaar or PAN, checked by Estately</div></div>
              {idStatus === "none" ? <button type="button" className="btn btn-outline btn-sm" onClick={uploadId}>Upload ID</button> : <span className="badge badge-info badge-sm">Under review</span>}
            </div>
          </div>
        </div>

        <div className="stack" style={{ "--stack": "20px" }}>
          <div className="card link-list">
            <Link href="/dashboard/listings"><span><i className="bi bi-card-list lead" />My Listings</span><i className="bi bi-chevron-right muted" /></Link>
            <Link href="/saved"><span><i className="bi bi-heart lead" />Saved Properties{savedIds.length > 0 && ` (${savedIds.length})`}</span><i className="bi bi-chevron-right muted" /></Link>
            <Link href="/saved-searches"><span><i className="bi bi-bookmark lead" />Saved Searches{savedSearches.length > 0 && ` (${savedSearches.length})`}</span><i className="bi bi-chevron-right muted" /></Link>
          </div>

          <div className="card card-pad-lg">
            <div className="h4 mb-16">Communication preferences</div>
            <div className="stack" style={{ "--stack": "14px" }}>
              <label className="switch between" style={{ width: "100%" }}><span>Lead alerts on WhatsApp</span><input type="checkbox" checked={prefs.whatsapp} onChange={(e) => updatePref("whatsapp", e.target.checked)} /></label>
              <label className="switch between" style={{ width: "100%" }}><span>Visit reminders by SMS</span><input type="checkbox" checked={prefs.sms} onChange={(e) => updatePref("sms", e.target.checked)} /></label>
              <label className="switch between" style={{ width: "100%" }}><span>Weekly summary by email</span><input type="checkbox" checked={prefs.email} onChange={(e) => updatePref("email", e.target.checked)} /></label>
            </div>
          </div>

          <div className="card card-pad-lg">
            <div className="h4 mb-16">Privacy</div>
            <label className="switch between" style={{ width: "100%" }}><span>Show my number only after a buyer logs in</span><input type="checkbox" checked={prefs.hidePhone} onChange={(e) => updatePref("hidePhone", e.target.checked)} /></label>
            <p className="xs muted mt-8">Buyers always need to log in to contact you. This additionally hides your number until they send an enquiry.</p>
            <div style={{ height: 1, background: "var(--border)", margin: "14px 0" }} />
            <button type="button" className="btn-link small" style={{ color: "var(--danger)" }} onClick={() => toast("This page isn't part of the prototype")}>Delete my account</button>
          </div>

          <button type="button" className="btn btn-outline btn-block btn-lg" onClick={logout}><i className="bi bi-box-arrow-right" />Log out</button>
        </div>
      </div>
    </>
  );
}
