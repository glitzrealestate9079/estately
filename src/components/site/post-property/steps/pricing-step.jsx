"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field } from "@/components/site/post-property/form-controls";
import { formatIndianCurrency } from "@/lib/site/format";
import { RENT_TENANT_PREFERENCES, RENT_LEASE_DURATIONS } from "@/lib/site/derived";
import { getLocalityByName } from "@/lib/site/site-data";
import { toTemplateLocality } from "@/lib/site/template/locality-mapper";
import { kindFor } from "@/schemas/site/postPropertySchema";

const DEPOSIT_MONTH_OPTIONS = [1, 2, 3];

function Chip({ active, onClick, children }) {
  return (
    <button type="button" className={`chip chip-sm ${active ? "is-active" : ""}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

function SaleFields({ register, control, watch, errors }) {
  const price = watch("price");
  const carpetArea = watch("carpetArea");
  const city = watch("city");
  const locality = watch("locality");
  const type = watch("type");
  const pricePerSqft = price && carpetArea ? Math.round(Number(price) / Number(carpetArea)) : null;
  const localityRow = city && locality ? getLocalityByName(city, locality) : null;
  const localityAvg = localityRow ? toTemplateLocality(localityRow).avg : null;

  return (
    <div className="form-grid mt-24">
      <Field label="Expected price (₹)" error={errors.price?.message} hint={price ? formatIndianCurrency(Number(price)) : undefined}>
        <input className="input" type="number" min={0} {...register("price")} />
      </Field>
      {Boolean(pricePerSqft) && (
        <Field label="Price per sq.ft" hint={localityAvg ? `${locality} average: ₹${new Intl.NumberFormat("en-IN").format(localityAvg)}/sq.ft` : "Calculated from your area"}>
          <input className="input" readOnly value={`₹${new Intl.NumberFormat("en-IN").format(pricePerSqft)}`} style={{ background: "var(--surface-2)" }} />
        </Field>
      )}
      {type === "Apartment" && (
        <Field label="Maintenance (₹/month)" error={errors.maintenance?.message} optional>
          <input className="input" type="number" min={0} {...register("maintenance")} />
        </Field>
      )}
      <div className="field">
        <Controller control={control} name="negotiable" render={({ field }) => (
          <label className="switch"><input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />Price is negotiable</label>
        )} />
      </div>
    </div>
  );
}

function RentFields({ register, control, watch, setValue, errors }) {
  const price = watch("price");
  const depositMonths = watch("depositMonths");

  return (
    <div className="form-grid mt-24">
      <Field label="Monthly rent (₹)" error={errors.price?.message} hint={price ? formatIndianCurrency(Number(price)) : undefined}>
        <input className="input" type="number" min={0} {...register("price")} />
      </Field>
      <Field label="Maintenance (₹/month)" error={errors.maintenance?.message} optional>
        <input className="input" type="number" min={0} {...register("maintenance")} />
      </Field>
      <Field label="Security deposit" error={errors.securityDeposit?.message} optional span hint={depositMonths && price ? `= ${formatIndianCurrency(Number(price) * Number(depositMonths))}` : undefined}>
        <div className="row-wrap">
          {DEPOSIT_MONTH_OPTIONS.map((m) => (
            <Chip key={m} active={Number(depositMonths) === m} onClick={() => { setValue("depositMonths", m); setValue("securityDeposit", Number(price || 0) * m); }}>{m} month{m > 1 ? "s" : ""}</Chip>
          ))}
        </div>
      </Field>
      <Field label="Available from" error={errors.availableFrom?.message} optional>
        <input className="input" type="date" {...register("availableFrom")} />
      </Field>
      <Field label="Lease duration" error={errors.leaseDuration?.message} optional>
        <Controller control={control} name="leaseDuration" render={({ field }) => (
          <select className="select" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)}>
            <option value="">Select</option>
            {RENT_LEASE_DURATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        )} />
      </Field>
      <Field label="Preferred tenant" error={errors.tenantPreference?.message} optional span>
        <Controller control={control} name="tenantPreference" render={({ field }) => (
          <div className="row-wrap">
            {RENT_TENANT_PREFERENCES.map((t) => <Chip key={t} active={field.value === t} onClick={() => field.onChange(field.value === t ? "" : t)}>{t}</Chip>)}
          </div>
        )} />
      </Field>
    </div>
  );
}

function PgFields({ register, watch, errors }) {
  const price = watch("price");
  const sharingType = watch("sharingType");
  const rentLabel = sharingType ? `Rent (${sharingType} sharing) (₹/month)` : "Rent (₹/month)";
  return (
    <div className="form-grid mt-24">
      <Field label={rentLabel} error={errors.price?.message} hint={price ? formatIndianCurrency(Number(price)) : undefined}>
        <input className="input" type="number" min={0} {...register("price")} />
      </Field>
      <Field label="Security deposit" error={errors.securityDeposit?.message} optional>
        <input className="input" type="number" min={0} {...register("securityDeposit")} />
      </Field>
      <Field label="Available from" error={errors.availableFrom?.message} optional>
        <input className="input" type="date" {...register("availableFrom")} />
      </Field>
    </div>
  );
}

function ProjectFields({ register, watch, errors }) {
  const minPrice = watch("minPrice");
  const maxPrice = watch("maxPrice");
  return (
    <div className="form-grid mt-24">
      <Field label="Starting price (₹)" error={errors.minPrice?.message} hint={minPrice ? formatIndianCurrency(Number(minPrice)) : undefined}>
        <input className="input" type="number" min={0} {...register("minPrice")} />
      </Field>
      <Field label="Highest price (₹)" error={errors.maxPrice?.message} optional hint={maxPrice ? formatIndianCurrency(Number(maxPrice)) : undefined}>
        <input className="input" type="number" min={0} {...register("maxPrice")} />
      </Field>
    </div>
  );
}

function renderFieldsFor(kind, listingType, props) {
  if (kind === "project") return <ProjectFields {...props} />;
  if (kind === "pg") return <PgFields {...props} />;
  if (listingType === "Rent") return <RentFields {...props} />;
  return <SaleFields {...props} />;
}

export function PricingStep() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();
  const values = watch();
  const kind = kindFor(values);
  const props = { register, control, watch, setValue, errors };

  return (
    <div>
      <h1>{kind === "pg" ? "Pricing & terms" : "Pricing"}</h1>
      <p className="lead">A realistic price gets more genuine enquiries.</p>
      {renderFieldsFor(kind, values.listingType, props)}
    </div>
  );
}
