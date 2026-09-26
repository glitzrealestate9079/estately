"use client";

import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SiteImageDropzone } from "@/components/site/post-property/site-image-dropzone";

function AttachmentButton({ label, icon, accept, value, onPick, onClear }) {
  const inputRef = useRef(null);
  return (
    <>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()}>
        <i className={`bi ${icon}`} />{value ? `${label} added` : label}
      </button>
      {value && <button type="button" className="btn btn-ghost btn-sm" onClick={onClear}><i className="bi bi-x" />Remove</button>}
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => e.target.files?.[0] && onPick(URL.createObjectURL(e.target.files[0]))} />
    </>
  );
}

export function MediaStep() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div>
      <h1>Photos &amp; media</h1>
      <p className="lead">Listings with 8+ photos get noticeably more enquiries. Drag to reorder; the first photo is the cover.</p>
      <Controller
        control={control}
        name="images"
        render={({ field }) => <SiteImageDropzone value={field.value} onChange={field.onChange} error={errors.images?.message} />}
      />
      <div className="row-wrap mt-12">
        <Controller
          control={control}
          name="video"
          render={({ field }) => (
            <AttachmentButton label="Add video" icon="bi-camera-video" accept="video/*" value={field.value} onPick={field.onChange} onClear={() => field.onChange("")} />
          )}
        />
        <Controller
          control={control}
          name="floorPlan"
          render={({ field }) => (
            <AttachmentButton label="Add floor plan" icon="bi-grid-1x2" accept="image/*,application/pdf" value={field.value} onPick={field.onChange} onClear={() => field.onChange("")} />
          )}
        />
      </div>
    </div>
  );
}
