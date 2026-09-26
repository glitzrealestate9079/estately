"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { Field } from "@/components/site/post-property/form-controls";
import { useSite } from "@/components/site/providers/site-provider";
import { kindFor } from "@/schemas/site/postPropertySchema";

function VerifyRow({ done, icon, title, subtitle, required, action }) {
  return (
    <div className={`verify-row ${done ? "is-done" : ""}`}>
      <span className="vi"><i className={`bi ${done ? "bi-check-lg" : icon}`} /></span>
      <div className="grow">
        <div className="strong">{title} {required ? <span className="badge badge-sm badge-warning">Required</span> : <span className="badge badge-sm">Optional</span>}</div>
        <div className="small muted">{subtitle}</div>
      </div>
      {action}
    </div>
  );
}

export function VerificationStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { auth } = useSite();
  const values = watch();
  const kind = kindFor(values);
  const isBuilder = values.sellerType === "Builder/Developer";
  const isSale = values.listingType === "Sale";
  const [idLoading, setIdLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const hasPin = Boolean(values.latitude && values.longitude);

  function simulateUpload(field, setLoading, doneMessage) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setValue(field, true);
      toast.success(doneMessage);
    }, 700);
  }

  return (
    <div>
      <h1>Verification</h1>
      <p className="lead">Each check you complete appears as its own badge. Nothing is labelled a generic &ldquo;Verified&rdquo;.</p>
      <div className="stack mt-24" style={{ "--stack": "10px" }}>
        <VerifyRow
          done
          icon="bi-phone"
          title="Phone verified"
          subtitle={`${auth.user?.phone || ""} — confirmed by OTP when you logged in`}
          required
          action={<span className="badge badge-success">Done</span>}
        />
        <VerifyRow
          done={values.identityUploaded}
          icon="bi-person-vcard"
          title="Identity"
          subtitle="Upload Aadhaar or PAN. Shown to buyers as &ldquo;Identity verified&rdquo; once checked."
          action={
            values.identityUploaded ? (
              <span className="badge badge-info">Submitted</span>
            ) : (
              <button type="button" className={`btn btn-outline btn-sm ${idLoading ? "is-loading" : ""}`} onClick={() => simulateUpload("identityUploaded", setIdLoading, "ID submitted for review")}>
                Upload ID
              </button>
            )
          }
        />
        {!isBuilder && (isSale || kind === "plot") && (
          <VerifyRow
            done={values.docsUploaded}
            icon="bi-file-earmark-text"
            title="Ownership documents"
            subtitle="Sale deed, allotment letter or registry. Earns &ldquo;Ownership docs checked&rdquo;."
            action={
              values.docsUploaded ? (
                <span className="badge badge-info">Submitted</span>
              ) : (
                <button type="button" className={`btn btn-outline btn-sm ${docsLoading ? "is-loading" : ""}`} onClick={() => simulateUpload("docsUploaded", setDocsLoading, "Documents submitted for review")}>
                  Upload
                </button>
              )
            }
          />
        )}
        <VerifyRow
          done={values.locationConfirmed}
          icon="bi-geo-alt"
          title="Location"
          subtitle={hasPin ? "Your map pin will be checked against geo-tagged photos." : "Drop a pin in the Location step to enable this check."}
          action={
            hasPin ? (
              values.locationConfirmed ? (
                <span className="badge badge-info">Requested</span>
              ) : (
                <button type="button" className={`btn btn-outline btn-sm ${locLoading ? "is-loading" : ""}`} onClick={() => simulateUpload("locationConfirmed", setLocLoading, "Location check requested")}>
                  Request check
                </button>
              )
            ) : (
              <span className="badge badge-sm">Add a pin in Location</span>
            )
          }
        />

        {(isBuilder || values.possessionDate) && (
          <div className={`verify-row ${values.reraNumber ? "is-done" : ""}`} style={{ flexWrap: "wrap" }}>
            <span className="vi"><i className="bi bi-file-earmark-text" /></span>
            <div className="grow" style={{ minWidth: 220 }}>
              <div className="strong">RERA registration {isBuilder && <span className="badge badge-sm badge-warning">Required</span>}</div>
              <div className="small muted">Shown as &ldquo;RERA information as provided by the developer&rdquo; — not as a verified badge.</div>
            </div>
            <div style={{ width: "100%", maxWidth: 320 }}>
              <Field error={errors.reraNumber?.message}>
                <input className="input" placeholder="e.g. RJ/P/2024/1234" maxLength={30} {...register("reraNumber")} />
              </Field>
            </div>
          </div>
        )}
        {values.sellerType === "Agent" && <p className="xs muted">Agents: your agency profile is shown with every listing you post.</p>}
      </div>
    </div>
  );
}
