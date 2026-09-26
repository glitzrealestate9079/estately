"use client";

import { useEffect, useRef, useState } from "react";

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
];

// Ported from post-property.js's media() step — same .dropzone/.media-grid/
// .media-item/.mi-actions/.mi-progress classes and Bootstrap icons as the
// rest of the site (unlike the admin-shared ImageDropzone this deliberately
// doesn't reuse), plus native HTML5 drag-reorder and an upload-progress/
// failure simulation matching the original demo's own behaviour.
export function SiteImageDropzone({ value = [], onChange, error }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const dragIndex = useRef(null);

  function addFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    const items = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      status: "uploading",
      progress: 10,
    }));
    onChange([...value, ...items]);
    items.forEach((item) => simulateUpload(item.id));
  }

  // `onChange` is react-hook-form's plain setter (it takes the next value,
  // not a functional updater), so progress ticks route through this ref to
  // always read the latest `value` without re-subscribing the interval.
  // Synced in an effect (not during render) per the rules of hooks.
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  }, [onChange, value]);

  function patchItem(id, patch) {
    onChangeRef.current(valueRef.current.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function simulateUpload(id) {
    let progress = 10;
    const tick = setInterval(() => {
      progress = Math.min(100, progress + 20 + Math.random() * 20);
      patchItem(id, { progress });
      if (progress >= 100) {
        clearInterval(tick);
        patchItem(id, { status: "ok", progress: 100 });
      }
    }, 250);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function removeAt(id) {
    onChange(value.filter((item) => item.id !== id));
  }

  function retry(id) {
    onChange(value.map((m) => (m.id === id ? { ...m, status: "uploading", progress: 10 } : m)));
    simulateUpload(id);
  }

  function setCover(id) {
    const index = value.findIndex((m) => m.id === id);
    if (index <= 0) return;
    const next = [...value];
    const [moved] = next.splice(index, 1);
    next.splice(0, 0, moved);
    onChange(next);
  }

  function moveTo(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= value.length || fromIndex === toIndex) return;
    const next = [...value];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  }

  function useSamplePhotos() {
    const items = SAMPLE_PHOTOS.map((url, i) => ({ id: `sample-${Date.now()}-${i}`, url, name: `sample-${i + 1}.jpg`, status: "ok", progress: 100 }));
    onChange([...value, ...items]);
  }

  function simulateFailure() {
    const item = { id: `failed-${Date.now()}`, url: "", name: "photo.jpg", status: "failed", progress: 0, error: "Connection lost while uploading. Try again." };
    onChange([...value, item]);
  }

  const photoCount = value.filter((m) => m.status !== "failed").length;
  const otherCount = value.filter((m) => m.status === "failed").length;
  const firstOk = value.findIndex((m) => m.status !== "failed");

  return (
    <div>
      <div
        className={`dropzone mt-24 ${dragOver ? "is-over" : ""}`}
        tabIndex={0}
        role="button"
        aria-label="Upload photos"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="ico"><i className="bi bi-cloud-arrow-up" /></div>
        <div className="strong mt-8">Drag photos here or <span className="text-primary">browse</span></div>
        <div className="small muted">JPG or PNG, up to 10 MB each</div>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
      </div>

      <div className="row-wrap mt-12">
        <button type="button" className="btn btn-outline btn-sm" onClick={useSamplePhotos}><i className="bi bi-images" />Use sample photos (demo)</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={simulateFailure}><i className="bi bi-exclamation-triangle" />Simulate upload failure</button>
      </div>

      {error && <span className="error-text"><i className="bi bi-exclamation-circle" />{error}</span>}

      {value.length > 0 && (
        <div className="media-grid">
          {value.map((m, i) => (
            <div
              key={m.id}
              className={`media-item ${m.status === "failed" ? "is-failed" : ""}`}
              draggable={m.status !== "failed"}
              onDragStart={() => { dragIndex.current = i; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex.current != null) moveTo(dragIndex.current, i);
                dragIndex.current = null;
              }}
            >
              {m.status === "failed" ? (
                <div>
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: 20 }} />
                  <div className="strong mt-4">Upload failed</div>
                  <div>{m.error}</div>
                  <div className="row mt-8" style={{ justifyContent: "center" }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => retry(m.id)}>Retry</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeAt(m.id)}>Remove</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.name} />
                  {i === firstOk && <span className="badge badge-solid badge-sm mi-primary"><i className="bi bi-star-fill" />Cover</span>}
                  {m.status === "uploading" && <div className="mi-progress"><span style={{ width: `${m.progress || 10}%` }} /></div>}
                  <div className="mi-actions">
                    {i !== firstOk && <button type="button" title="Set as cover" aria-label="Set as cover" onClick={() => setCover(m.id)}><i className="bi bi-star" /></button>}
                    <button type="button" title="Delete" aria-label="Delete" onClick={() => removeAt(m.id)}><i className="bi bi-trash" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="small muted mt-12">{photoCount} photo{photoCount === 1 ? "" : "s"}{otherCount ? ` · ${otherCount} other` : ""}</p>
    </div>
  );
}
