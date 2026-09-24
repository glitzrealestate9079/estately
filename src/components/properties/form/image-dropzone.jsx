"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Star, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Matches the "Max Images per Listing" default in property settings (src/schemas/settingsSchema.js).
const DEFAULT_MAX_IMAGES = 20;

export function ImageDropzone({
  value = [],
  onChange,
  multiple = true,
  label = "Upload images",
  error,
  max = DEFAULT_MAX_IMAGES,
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const isMaxed = multiple && value.length >= max;

  function toItems(fileList) {
    return Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
  }

  function addFiles(fileList) {
    const files = toItems(fileList);
    if (files.length === 0) return;

    if (!multiple) {
      onChange(files.slice(0, 1));
      return;
    }

    const remaining = Math.max(0, max - value.length);
    if (remaining === 0) return;
    onChange([...value, ...files.slice(0, remaining)]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (isMaxed) return;
    addFiles(e.dataTransfer.files);
  }

  function removeAt(id) {
    onChange(value.filter((item) => item.id !== id));
  }

  function moveItem(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= value.length) return;
    const next = [...value];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  }

  function setCover(index) {
    if (index === 0) return;
    moveItem(index, 0);
  }

  return (
    <div>
      {multiple && (
        <div className="mb-2 flex items-center justify-end">
          <span className={cn("text-xs font-medium", isMaxed ? "text-warning-600 dark:text-warning-500" : "text-foreground-muted")}>
            {value.length}/{max} photos
          </span>
        </div>
      )}

      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isMaxed) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10" : "border-border-subtle hover:border-navy-300",
          error && "border-error-400",
          isMaxed && "pointer-events-none cursor-not-allowed opacity-50"
        )}
      >
        <ImagePlus className="h-6 w-6 text-foreground-muted" />
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-foreground-muted">
          {isMaxed ? `Maximum of ${max} photos reached` : "Drag & drop or click to browse · PNG, JPG up to 10MB"}
        </p>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={isMaxed}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((item, index) => {
            const isCover = index === 0;
            const isFirst = index === 0;
            const isLast = index === value.length - 1;

            return (
              <div
                key={item.id}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-lg border",
                  multiple && isCover ? "border-primary-500" : "border-border-subtle"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />

                {multiple && (
                  isCover ? (
                    <span className="absolute left-1 top-1 rounded-md bg-primary-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCover(index)}
                      className="absolute left-1 top-1 rounded-full bg-navy-950/70 p-1 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                      aria-label={`Set ${item.name} as cover photo`}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => removeAt(item.id)}
                  className="absolute right-1 top-1 rounded-full bg-navy-950/70 p-1 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {multiple && value.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-navy-950/70 py-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={isFirst}
                      className="rounded p-0.5 text-white disabled:pointer-events-none disabled:opacity-30"
                      aria-label={`Move ${item.name} earlier`}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={isLast}
                      className="rounded p-0.5 text-white disabled:pointer-events-none disabled:opacity-30"
                      aria-label={`Move ${item.name} later`}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
