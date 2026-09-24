"use client";

import { Moon, Sun } from "lucide-react";
import { useReducer, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";

function noopSubscribe() {
  return () => {};
}
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ThemeToggle() {
  const mounted = useHasMounted();
  const [, bump] = useReducer((c) => c + 1, 0);
  const dark = mounted && document.documentElement.classList.contains("dark");

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("estately-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
    bump();
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </Button>
  );
}
