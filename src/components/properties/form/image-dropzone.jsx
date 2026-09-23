"use client";

import { ImagePlus, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ImageDropzone({ value = [], onChange, multiple = true, label = "Upload images", error }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const mapped = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    onChange(multiple ? [...value, ...mapped] : mapped.slice(0, 1));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function removeAt(id) {
    onChange(value.filter((item) => item.id !== id));
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10" : "border-border-subtle hover:border-navy-300",
          error && "border-error-400"
        )}
      >
        <ImagePlus className="h-6 w-6 text-foreground-muted" />
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-foreground-muted">Drag & drop or click to browse · PNG, JPG up to 10MB</p>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </label>

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(item.id)}
                className="absolute right-1 top-1 rounded-full bg-navy-950/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${item.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
