"use client";

import { useFormContext } from "react-hook-form";
import { Field } from "@/components/site/post-property/form-controls";
import { kindFor } from "@/schemas/site/postPropertySchema";

const DESCRIPTION_TIPS = ["Light & ventilation", "Nearby schools / offices", "Water supply", "Recent renovation", "Why you're selling"];

function suggestTitle(values) {
  const kind = kindFor(values);
  const loc = values.locality || values.city || "your city";
  if (kind === "residential") return `${values.bedrooms || 2} BHK ${values.type || "Property"} ${values.listingType === "Rent" ? "for rent" : "for sale"} in ${loc}`;
  if (kind === "plot") return `${values.plotArea || ""} ${values.areaUnit || "sq.ft"} ${values.plotType || "Plot"} in ${loc}`.trim();
  if (kind === "commercial") return `${values.commercialCategory || "Commercial space"} ${values.listingType === "Rent" ? "for lease" : "for sale"} in ${loc}`;
  if (kind === "pg") return `PG in ${loc}`;
  return `${values.projectName || "New project"} in ${loc}`;
}

export function DescriptionStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const values = watch();
  const suggested = suggestTitle(values);

  return (
    <div>
      <h1>Describe your property</h1>
      <p className="lead">Be specific — what makes it worth a visit?</p>
      <div className="stack mt-24" style={{ "--stack": "18px" }}>
        <Field
          label="Listing title"
          error={errors.title?.message}
          hint={
            <span className="between">
              <span>{!values.title && <button type="button" className="btn-link" onClick={() => setValue("title", suggested, { shouldValidate: true })}>Use &ldquo;{suggested}&rdquo;</button>}</span>
              <span>{(values.title ?? "").length}/80</span>
            </span>
          }
        >
          <input className="input" maxLength={80} placeholder={suggested} {...register("title")} />
        </Field>

        <Field
          label="Description"
          error={errors.description?.message}
          hint={
            <span className="between">
              <span>Minimum 30 characters. Avoid phone numbers — buyers contact you through Estately.</span>
              <span>{(values.description ?? "").length}/2000</span>
            </span>
          }
        >
          <textarea className="textarea" maxLength={2000} rows={7} placeholder="e.g. East-facing 2 BHK on the 4th floor with morning light, covered parking, 5 minutes from World Trade Park…" {...register("description")} />
        </Field>

        <div className="surface-soft card-pad small">
          <div className="strong mb-8"><i className="bi bi-lightbulb text-warning" /> Good descriptions mention</div>
          <div className="row-wrap">
            {DESCRIPTION_TIPS.map((t) => <span key={t} className="badge">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
