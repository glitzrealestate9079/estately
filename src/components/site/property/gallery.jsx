"use client";

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  function next() {
    setActive((i) => (i + 1) % images.length);
  }
  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <button
          onClick={() => setLightboxOpen(true)}
          className="group relative col-span-4 aspect-[16/10] overflow-hidden rounded-2xl sm:col-span-3 sm:row-span-2"
        >
          <PropertyImage src={images[active]} alt={`${title} — photo ${active + 1}`} priority sizes="(min-width: 640px) 75vw, 100vw" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Expand className="h-3.5 w-3.5" /> View fullscreen
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        </button>

        <div className="col-span-4 grid grid-cols-4 gap-1.5 sm:col-span-1 sm:grid-cols-1 sm:gap-2">
          {images.slice(0, 4).map((src, index) => (
            <button
              key={src + index}
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl ring-2 ring-offset-1 transition-all sm:aspect-auto sm:h-full",
                active === index ? "ring-primary-600" : "ring-transparent hover:ring-primary-300"
              )}
            >
              <PropertyImage src={src} alt={`${title} thumbnail ${index + 1}`} sizes="120px" />
            </button>
          ))}
        </div>
      </div>

      <DialogPrimitive.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-fade-in" />
          <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 data-[state=open]:animate-scale-in">
            <DialogPrimitive.Title className="sr-only">{title} gallery</DialogPrimitive.Title>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:left-4">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative h-[70vh] w-full max-w-4xl">
              <PropertyImage src={images[active]} alt={`${title} — photo ${active + 1}`} sizes="90vw" />
            </div>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 sm:right-4">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              {active + 1} / {images.length}
            </span>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
