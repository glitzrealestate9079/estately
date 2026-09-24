"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

function noopSubscribe() {
  return () => {};
}
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const SPLASH_KEY = "estately-splash-shown";
const VISIBLE_MS = 1300;
const FADE_MS = 450;

// Shown once per browser tab (sessionStorage-gated) on the very first load —
// client-side navigations within the same session never re-trigger it. Kept
// server/client-consistent via the same useSyncExternalStore "mounted" guard
// already used by ThemeToggle, so there's no hydration mismatch from reading
// sessionStorage during the initial render.
export function SplashScreen() {
  const mounted = useHasMounted();
  const [phase, setPhase] = useState("hidden");
  const [checked, setChecked] = useState(false);

  // Decide once — the render where `mounted` first flips true — whether this
  // tab has already seen the splash. This is a one-time bootstrap read of an
  // external system (sessionStorage), so it's adjusted during render rather
  // than in an effect (see React's "adjusting state when a prop changes"
  // guidance); the actual timers below are effects, since they're genuinely
  // async callbacks that need cleanup.
  if (mounted && !checked) {
    setChecked(true);
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (!alreadyShown) {
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("visible");
    }
  }

  useEffect(() => {
    if (phase !== "visible") return;
    const fadeTimer = setTimeout(() => setPhase("fading"), VISIBLE_MS);
    return () => clearTimeout(fadeTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const removeTimer = setTimeout(() => setPhase("hidden"), FADE_MS);
    return () => clearTimeout(removeTimer);
  }, [phase]);

  if (!mounted || phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-navy-950 via-navy-900 to-primary-950 transition-opacity ease-out",
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative flex h-24 w-24 animate-scale-in items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-navy-900 text-white shadow-popover">
          <Building2 className="h-8 w-8" />
        </span>
      </div>
      <span className="animate-fade-in font-display text-2xl font-bold tracking-tight text-white">Estately</span>
    </div>
  );
}
