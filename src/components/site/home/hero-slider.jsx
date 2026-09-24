"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PropertyImage } from "@/components/common/property-image";
import { APARTMENT_IMAGES, SKYLINE_IMAGES, VILLA_IMAGES } from "@/data/property-images";
import { cn } from "@/lib/utils";

const SLIDES = [SKYLINE_IMAGES[0], APARTMENT_IMAGES[3], VILLA_IMAGES[0], SKYLINE_IMAGES[1], VILLA_IMAGES[2]].map(
  (src) => src.replace("w=1200", "w=2400")
);

const INTERVAL_MS = 5500;
const TRANSITION_S = 1.2;

// Full-bleed autoplaying background for the homepage hero — a slow Ken Burns
// zoom per slide plus a crossfade, paused entirely for prefers-reduced-motion.
export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950">
      <AnimatePresence>
        <motion.div
          key={SLIDES[index]}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_S, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1 }}
            animate={{ scale: reduceMotion ? 1 : 1.08 }}
            transition={{ duration: INTERVAL_MS / 1000 + TRANSITION_S, ease: "linear" }}
          >
            <PropertyImage src={SLIDES[index]} alt="" priority={index === 0} sizes="100vw" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-1.5 sm:bottom-8">
        {SLIDES.map((slide, i) => (
          <button
            key={slide}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1} of ${SLIDES.length}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}
