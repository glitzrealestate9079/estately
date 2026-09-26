"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { PropertyCard } from "@/components/site/property/property-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { SiteModal } from "@/components/site/ui/site-modal";
import { buildListingFromWizard, buildProjectFromWizard } from "@/lib/site/build-listing";
import { useSite } from "@/components/site/providers/site-provider";
import { formatArea, formatPrice, formatPricePerSqft } from "@/lib/site/format";
import { getCategoryKeyForProperty } from "@/lib/site/categories";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { toTemplateProject } from "@/lib/site/template/project-mapper";
import { completenessFor, kindFor, POST_PROPERTY_STEPS } from "@/schemas/site/postPropertySchema";
import { useWizardNav } from "@/components/site/post-property/wizard-nav-context";

const LISTING_TYPE_BADGE = { Sale: "For Sale", Rent: "For Rent", PG: "PG" };

function EditPicker({ onClose }) {
  const nav = useWizardNav();
  return (
    <SiteModal title="Jump to a step" onClose={onClose}>
      <div className="stack" style={{ "--stack": "6px" }}>
        {POST_PROPERTY_STEPS.filter((s) => s.key !== "preview").map((s, i) => (
          <button
            key={s.key}
            type="button"
            className="btn btn-outline btn-block"
            style={{ justifyContent: "flex-start" }}
            onClick={() => { nav?.goToStep(i); onClose(); }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </SiteModal>
  );
}

function ProjectPreview({ values, user }) {
  const draft = { id: "preview", ...buildProjectFromWizard(values, user) };
  const p = toTemplateProject(draft);
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "280px 1fr", alignItems: "start" }}>
      <ProjectCard project={p} />
      <div className="card card-pad">
        <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700 }}>{values.projectName || "Untitled project"}</h3>
        <p className="small muted">{values.locality}, {values.city}</p>
        <p className="small mt-12">{values.description || "No description added yet."}</p>
      </div>
    </div>
  );
}

function PropertyPreview({ values, user }) {
  const preview = { id: "preview", ...buildListingFromWizard(values, user), status: "Active", createdAt: new Date().toISOString().slice(0, 10) };
  const p = toTemplateProperty(preview, getCategoryKeyForProperty(preview));
  return (
    <div className="grid-2" style={{ gridTemplateColumns: "280px 1fr", alignItems: "start" }}>
      <PropertyCard property={p} />
      <div className="card card-pad">
        <div className="row-wrap mb-8">
          <span className="badge badge-info">{values.type}</span>
          <span className="badge">{LISTING_TYPE_BADGE[values.listingType] ?? "PG"}</span>
          {values.reraNumber && <span className="badge">RERA</span>}
        </div>
        <h3 style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700 }}>{values.title || "Untitled listing"}</h3>
        <p className="small muted">{values.locality}, {values.city}</p>
        <div className="row-wrap mt-12" style={{ alignItems: "baseline" }}>
          <span className="price" style={{ fontSize: 22 }}>{formatPrice(preview)}</span>
          {formatPricePerSqft(preview) && <span className="xs muted">{formatPricePerSqft(preview)}</span>}
          {formatArea(preview) && <span className="xs muted">· {formatArea(preview)}</span>}
        </div>
        <p className="small mt-12" style={{ color: "var(--text)" }}>{values.description || "No description added yet."}</p>
        {values.amenities?.length > 0 && (
          <div className="row-wrap mt-12">
            {values.amenities.map((a) => <span key={a} className="badge">{a}</span>)}
          </div>
        )}
        <p className="xs muted mt-12">{values.images?.length ?? 0} photos attached</p>
      </div>
    </div>
  );
}

export function PreviewStep() {
  const { watch } = useFormContext();
  const { auth } = useSite();
  const [editing, setEditing] = useState(false);
  const values = watch();
  const kind = kindFor(values);
  const pct = completenessFor(values);

  return (
    <div>
      <div className="between" style={{ flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>Preview your listing</h1>
          <p className="lead"><i className="bi bi-eye" /> This is exactly how buyers will see it.</p>
        </div>
        <div className="completeness" style={{ minWidth: 240 }}>
          <span className="small strong">{pct}% complete</span>
          <div className="bar"><span style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      <div className="preview-frame mt-24">
        <div className="pf-bar">
          <i className="bi bi-eye" /><span> Buyer view · Estately listing</span>
          <span className="badge badge-sm" style={{ marginLeft: "auto" }}>Preview</span>
        </div>
        <div style={{ padding: 20 }}>
          {kind === "project" ? <ProjectPreview values={values} user={auth.user} /> : <PropertyPreview values={values} user={auth.user} />}
        </div>
      </div>

      <button type="button" className="btn btn-outline btn-sm mt-16" onClick={() => setEditing(true)}>
        <i className="bi bi-pencil" />Edit a step
      </button>

      {editing && <EditPicker onClose={() => setEditing(false)} />}
    </div>
  );
}
