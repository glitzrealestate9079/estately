"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Field } from "@/components/site/post-property/form-controls";
import { PUBLIC_CITIES, getStateForCity } from "@/lib/site/site-data";
import { kindFor } from "@/schemas/site/postPropertySchema";

export function LocationStep() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const values = watch();
  const kind = kindFor(values);
  const isProject = kind === "project";
  const state = getStateForCity(values.city);
  const mapQuery = [values.address, values.locality, values.city].filter(Boolean).join(", ");

  return (
    <div>
      <h1>Where is it?</h1>
      <p className="lead">Buyers search by locality first, so be as specific as you can.</p>
      <div className="form-grid mt-24">
        <Field label="State" hint={state ? undefined : "Pick a city to fill this in"}>
          <input className="input" value={state ?? ""} disabled readOnly />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <select className="select" value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                <option value="">Select city</option>
                {PUBLIC_CITIES.map((city) => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
              </select>
            )}
          />
        </Field>
        <Field label="Locality" error={errors.locality?.message}>
          <input className="input" placeholder="e.g. Malviya Nagar" {...register("locality")} />
        </Field>
        <Field label="Sub-locality" optional error={errors.subLocality?.message}>
          <input className="input" placeholder="e.g. Sector 5" {...register("subLocality")} />
        </Field>
        <Field label={isProject ? "Project name" : "Project / Society name"} optional={!isProject} error={errors.societyName?.message}>
          <input className="input" placeholder="e.g. Green Valley Apartments" {...register("societyName")} />
        </Field>
        <Field label="Landmark" optional error={errors.landmark?.message}>
          <input className="input" placeholder="e.g. Near World Trade Park" {...register("landmark")} />
        </Field>
        <Field label="Pincode" error={errors.pincode?.message}>
          <input className="input" placeholder="e.g. 302017" maxLength={6} {...register("pincode")} />
        </Field>
        <Field label="Full address" error={errors.address?.message} hint="This is shared with a buyer only after they enquire." span>
          <input className="input" placeholder="House / flat no., street, landmark" {...register("address")} />
        </Field>
        <div className="span-2">
          <div className="between mb-8"><span className="label">Pin on map <span className="opt">(optional)</span></span></div>
          {mapQuery ? (
            <div className="mini-map" style={{ height: 220 }}>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
                title="Property location"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ border: 0, width: "100%", height: "100%" }}
              />
            </div>
          ) : (
            <div className="mini-map" style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)" }}>
              <span className="small muted"><i className="bi bi-geo-alt" /> Map pin confirmation appears here after address is entered</span>
            </div>
          )}
          <p className="xs muted mt-8"><i className="bi bi-info-circle" /> An exact pin helps buyers — and is required for the &ldquo;Location verified&rdquo; badge.</p>
        </div>
      </div>
    </div>
  );
}
