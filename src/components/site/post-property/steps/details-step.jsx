"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field } from "@/components/site/post-property/form-controls";
import { FACING_OPTIONS, FURNISHING_OPTIONS, SHARING_TYPE_OPTIONS, GENDER_PREFERENCE_OPTIONS, MEAL_PLAN_OPTIONS } from "@/lib/constants";
import { PLOT_TYPES, PLOT_APPROVAL_STATUSES, PROPERTY_AGE_BANDS, PG_TENANT_TYPES } from "@/lib/site/derived";
import { kindFor, COMMERCIAL_SUBTYPE_CHIPS } from "@/schemas/site/postPropertySchema";

const AREA_UNITS = [["sqft", "sq.ft"], ["sqyd", "sq.yd"], ["acre", "acre"], ["bigha", "bigha"]];
const NOTICE_OPTIONS = ["No notice", "15 days", "30 days"];
const HOUSEKEEPING_OPTIONS = ["Daily", "Alternate days", "Weekly"];
const DETAILS_TITLE = { residential: "Property details", plot: "Plot details", commercial: "Commercial details", pg: "PG / Co-living details", project: "Project details" };
const DETAILS_LEAD = { project: "Tell buyers what makes this project worth exploring." };

function Chip({ active, onClick, children }) {
  return (
    <button type="button" className={`chip chip-sm ${active ? "is-active" : ""}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

function Toggle({ control, name, label }) {
  return (
    <div className="field">
      <Controller control={control} name={name} render={({ field }) => (
        <label className="switch"><input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />{label}</label>
      )} />
    </div>
  );
}

function ResidentialFields({ register, control, errors }) {
  return (
    <div className="form-grid mt-24">
      <Field label="Bedrooms" error={errors.bedrooms?.message}>
        <input className="input" type="number" min={0} {...register("bedrooms")} />
      </Field>
      <Field label="Bathrooms" error={errors.bathrooms?.message}>
        <input className="input" type="number" min={0} {...register("bathrooms")} />
      </Field>
      <Field label="Balconies" error={errors.balconies?.message} optional>
        <input className="input" type="number" min={0} {...register("balconies")} />
      </Field>
      <Field label="Carpet area" error={errors.carpetArea?.message}>
        <div className="row-wrap" style={{ gap: 6 }}>
          <input className="input" type="number" min={0} style={{ flex: 1 }} {...register("carpetArea")} />
          <Controller control={control} name="areaUnit" render={({ field }) => (
            <select className="select" style={{ width: "auto" }} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
              {AREA_UNITS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )} />
        </div>
      </Field>
      <Field label="Built-up area" error={errors.builtUpArea?.message} optional>
        <input className="input" type="number" min={0} {...register("builtUpArea")} />
      </Field>
      <Field label="Floor" error={errors.floor?.message} optional>
        <input className="input" type="number" min={0} {...register("floor")} />
      </Field>
      <Field label="Total floors" error={errors.totalFloors?.message} optional>
        <input className="input" type="number" min={0} {...register("totalFloors")} />
      </Field>
      <Field label="Facing" error={errors.facing?.message} optional>
        <Controller control={control} name="facing" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select facing</option>
            {FACING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Furnishing" error={errors.furnishing?.message} optional>
        <Controller control={control} name="furnishing" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select furnishing</option>
            {FURNISHING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Property age" error={errors.propertyAge?.message} optional span>
        <Controller control={control} name="propertyAge" render={({ field }) => (
          <div className="row-wrap">
            {PROPERTY_AGE_BANDS.map((a) => <Chip key={a} active={field.value === a} onClick={() => field.onChange(field.value === a ? "" : a)}>{a}</Chip>)}
          </div>
        )} />
      </Field>
      <Toggle control={control} name="parking" label="Parking available" />
    </div>
  );
}

function PlotFields({ register, control, watch, errors }) {
  const irregular = watch("plotIrregular");
  return (
    <div className="form-grid mt-24">
      <Field label="Plot type" error={errors.plotType?.message} span>
        <Controller control={control} name="plotType" render={({ field }) => (
          <div className="row-wrap">
            {PLOT_TYPES.map((t) => <Chip key={t} active={field.value === t} onClick={() => field.onChange(field.value === t ? "" : t)}>{t}</Chip>)}
          </div>
        )} />
      </Field>
      <Field label="Plot area" error={errors.plotArea?.message}>
        <div className="row-wrap" style={{ gap: 6 }}>
          <input className="input" type="number" min={0} style={{ flex: 1 }} {...register("plotArea")} />
          <Controller control={control} name="areaUnit" render={({ field }) => (
            <select className="select" style={{ width: "auto" }} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
              {AREA_UNITS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )} />
        </div>
      </Field>
      <Field label="Road width (ft)" error={errors.roadWidth?.message} optional>
        <input className="input" type="number" min={0} {...register("roadWidth")} />
      </Field>
      {!irregular && (
        <>
          <Field label="Length (ft)" error={errors.plotLength?.message} optional>
            <input className="input" type="number" min={0} {...register("plotLength")} />
          </Field>
          <Field label="Width (ft)" error={errors.plotWidth?.message} optional>
            <input className="input" type="number" min={0} {...register("plotWidth")} />
          </Field>
        </>
      )}
      <div className="field">
        <Controller control={control} name="plotIrregular" render={({ field }) => (
          <label className="switch"><input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />Irregular shape (no fixed dimensions)</label>
        )} />
      </div>
      <Field label="Facing" error={errors.facing?.message} optional>
        <Controller control={control} name="facing" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select facing</option>
            {FACING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Approval" error={errors.approval?.message} optional hint="As declared by seller" span>
        <Controller control={control} name="approval" render={({ field }) => (
          <div className="row-wrap">
            {PLOT_APPROVAL_STATUSES.map((a) => <Chip key={a} active={field.value === a} onClick={() => field.onChange(field.value === a ? "" : a)}>{a}</Chip>)}
          </div>
        )} />
      </Field>
      <Toggle control={control} name="corner" label="Corner plot" />
      <Toggle control={control} name="boundary" label="Boundary wall built" />
    </div>
  );
}

function CommercialFields({ register, control, watch, errors }) {
  const category = watch("commercialCategory");
  const showWorkstations = category === "Office" || category === "Coworking";
  const showCeiling = category === "Warehouse" || category === "Industrial";
  const showFrontage = category === "Shop" || category === "Showroom" || category === "Commercial Land";
  return (
    <div className="form-grid mt-24">
      <Field label="Category" error={errors.commercialCategory?.message} span>
        <Controller control={control} name="commercialCategory" render={({ field }) => (
          <div className="row-wrap">
            {COMMERCIAL_SUBTYPE_CHIPS.map((c) => <Chip key={c} active={field.value === c} onClick={() => field.onChange(field.value === c ? "" : c)}>{c}</Chip>)}
          </div>
        )} />
      </Field>
      <Field label="Area (sq.ft)" error={errors.carpetArea?.message}>
        <input className="input" type="number" min={0} {...register("carpetArea")} />
      </Field>
      <Field label="Fit-out" error={errors.furnishing?.message} optional>
        <Controller control={control} name="furnishing" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select fit-out</option>
            {FURNISHING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      {showWorkstations && (
        <>
          <Field label="Workstations" error={errors.seatingCapacity?.message} optional>
            <input className="input" type="number" min={0} {...register("seatingCapacity")} />
          </Field>
          <Field label="Cabins" error={errors.washrooms?.message} optional>
            <input className="input" type="number" min={0} {...register("washrooms")} />
          </Field>
        </>
      )}
      {showCeiling && (
        <Field label="Ceiling height (ft)" error={errors.ceilingHeight?.message} optional>
          <input className="input" type="number" min={0} {...register("ceilingHeight")} />
        </Field>
      )}
      {showFrontage && (
        <Field label="Frontage (ft)" error={errors.frontage?.message} optional>
          <input className="input" type="number" min={0} {...register("frontage")} />
        </Field>
      )}
      <Field label="Floor" error={errors.floor?.message} optional>
        <input className="input" type="number" min={0} {...register("floor")} />
      </Field>
      <Field label="Total floors" error={errors.totalFloors?.message} optional>
        <input className="input" type="number" min={0} {...register("totalFloors")} />
      </Field>
      <Field label="Facing" error={errors.facing?.message} optional>
        <Controller control={control} name="facing" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select facing</option>
            {FACING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Toggle control={control} name="parking" label="Parking available" />
    </div>
  );
}

function PgFields({ register, control, errors }) {
  return (
    <div className="form-grid mt-24">
      <Field label="Total beds" error={errors.bedrooms?.message}>
        <input className="input" type="number" min={0} {...register("bedrooms")} />
      </Field>
      <Field label="Available for" error={errors.genderPreference?.message} optional>
        <Controller control={control} name="genderPreference" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select</option>
            {GENDER_PREFERENCE_OPTIONS.map((o) => <option key={o} value={o}>{o === "Co-ed" ? "Co-living · All" : `${o} only`}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Tenant type" error={errors.tenantPreference?.message} optional span>
        <Controller control={control} name="tenantPreference" render={({ field }) => (
          <div className="row-wrap">
            {PG_TENANT_TYPES.map((t) => <Chip key={t} active={field.value === t} onClick={() => field.onChange(field.value === t ? "" : t)}>{t}</Chip>)}
          </div>
        )} />
      </Field>
      <Field label="Sharing type" error={errors.sharingType?.message} optional>
        <Controller control={control} name="sharingType" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select</option>
            {SHARING_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Food" error={errors.mealPlan?.message} optional>
        <Controller control={control} name="mealPlan" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select</option>
            {MEAL_PLAN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Housekeeping" error={errors.housekeeping?.message} optional>
        <Controller control={control} name="housekeeping" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select</option>
            {HOUSEKEEPING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Notice period" error={errors.noticePeriod?.message} optional>
        <Controller control={control} name="noticePeriod" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select</option>
            {NOTICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Available from" error={errors.availableFrom?.message} optional>
        <input className="input" type="date" {...register("availableFrom")} />
      </Field>
      <Toggle control={control} name="wifi" label="Wi-Fi included" />
      <Toggle control={control} name="ac" label="AC rooms" />
      <Toggle control={control} name="attachedBath" label="Attached bathroom" />
    </div>
  );
}

function ProjectFields({ register, control, errors }) {
  return (
    <div className="form-grid mt-24">
      <Field label="Project name" error={errors.projectName?.message} span>
        <input className="input" placeholder="e.g. Lodha Elite Meadows" {...register("projectName")} />
      </Field>
      <Field label="Possession" error={errors.possessionDate?.message} optional>
        <input className="input" type="month" {...register("possessionDate")} />
      </Field>
      <Field label="Towers" error={errors.towers?.message} optional>
        <input className="input" type="number" min={0} {...register("towers")} />
      </Field>
      <Field label="Total units" error={errors.totalUnitsCount?.message} optional>
        <input className="input" type="number" min={0} {...register("totalUnitsCount")} />
      </Field>
      <Field label="Land area (acres)" error={errors.acres?.message} optional>
        <input className="input" type="number" min={0} step="0.1" {...register("acres")} />
      </Field>
    </div>
  );
}

export function DetailsStep() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const values = watch();
  const kind = kindFor(values);
  const props = { register, control, watch, errors };

  return (
    <div>
      <h1>{DETAILS_TITLE[kind]}</h1>
      <p className="lead">{DETAILS_LEAD[kind] ?? "We'll only show fields that apply to this type."}</p>
      {kind === "residential" && <ResidentialFields {...props} />}
      {kind === "plot" && <PlotFields {...props} />}
      {kind === "commercial" && <CommercialFields {...props} />}
      {kind === "pg" && <PgFields {...props} />}
      {kind === "project" && <ProjectFields {...props} />}
    </div>
  );
}
