"use client";

import { Controller, useFormContext } from "react-hook-form";
import { AMENITY_POOLS, AMENITY_ICONS } from "@/lib/site/amenity-pools";
import { kindFor } from "@/schemas/site/postPropertySchema";

export function AmenitiesStep() {
  const { control, watch } = useFormContext();
  const kind = kindFor(watch());
  const pool = AMENITY_POOLS[kind] ?? AMENITY_POOLS.default;

  return (
    <div>
      <h1>Amenities</h1>
      <p className="lead">Select everything available. Unselected items are shown as not available.</p>
      <Controller
        control={control}
        name="amenities"
        render={({ field }) => (
          <>
            <div className="opt-grid mt-24" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
              {pool.map((amenity) => {
                const active = field.value.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    className={`opt-card opt-card-row ${active ? "is-selected" : ""}`}
                    aria-pressed={active}
                    onClick={() => field.onChange(active ? field.value.filter((a) => a !== amenity) : [...field.value, amenity])}
                    style={{ padding: "10px 14px" }}
                  >
                    <span className="opt-ico" style={{ width: 34, height: 34, fontSize: 17 }}><i className={`bi ${AMENITY_ICONS[amenity] ?? "bi-check2-circle"}`} /></span>
                    <span className="opt-title" style={{ fontSize: 14 }}>{amenity}</span>
                  </button>
                );
              })}
            </div>
            <p className="small muted mt-16">{field.value.length} selected</p>
          </>
        )}
      />
    </div>
  );
}
