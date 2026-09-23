"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, Moon, Palette, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { COLOR_THEMES, DEFAULT_COLOR_THEME, COLOR_THEME_STORAGE_KEY } from "@/config/color-themes";
import { cn } from "@/lib/utils";

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [colorTheme, setColorTheme] = useState(DEFAULT_COLOR_THEME);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains("dark"));
    try {
      setColorTheme(localStorage.getItem(COLOR_THEME_STORAGE_KEY) || DEFAULT_COLOR_THEME);
    } catch {
      /* ignore */
    }
  }, []);

  function applyColorTheme(id) {
    setColorTheme(id);
    document.documentElement.setAttribute("data-color-theme", id);
    try {
      localStorage.setItem(COLOR_THEME_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
    const theme = COLOR_THEMES.find((t) => t.id === id);
    toast.success(`${theme?.label ?? "Theme"} applied as your admin theme`);
  }

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("estately-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-2 rounded-l-xl bg-primary-600 px-3 py-3 text-white shadow-lg transition-transform hover:-translate-x-0.5 lg:flex"
          aria-label="Open theme customizer"
        >
          <Palette className="h-5 w-5" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-[2px] data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border-subtle bg-surface shadow-2xl outline-none data-[state=open]:animate-slide-in-right">
          <div className="flex items-center justify-between border-b border-border-subtle p-5">
            <div>
              <DialogPrimitive.Title className="font-display text-base font-semibold text-foreground">
                Theme Customizer
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1 text-sm text-foreground-muted">
                Preview a look and apply it as the admin theme.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="rounded-lg p-1.5 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Appearance
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => dark && toggleDark()}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  !dark
                    ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                    : "border-border-subtle text-foreground-muted hover:border-navy-300"
                )}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
              <button
                onClick={() => !dark && toggleDark()}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  dark
                    ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                    : "border-border-subtle text-foreground-muted hover:border-navy-300"
                )}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>

            <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              Color Theme
            </p>
            <div className="grid grid-cols-3 gap-3">
              {COLOR_THEMES.map((theme) => {
                const active = theme.id === colorTheme;
                return (
                  <button
                    key={theme.id}
                    onClick={() => applyColorTheme(theme.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors",
                      active ? "border-primary-600 bg-primary-50 dark:bg-primary-500/10" : "border-border-subtle hover:border-navy-300"
                    )}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full shadow-inner"
                      style={{ backgroundColor: theme.swatch }}
                    >
                      {active && <Check className="h-4 w-4 text-white" />}
                    </span>
                    <span className="text-xs font-medium text-foreground">{theme.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-foreground-muted">
              This applies instantly across the whole admin panel — sidebar highlights, buttons,
              links, charts and badges — and is remembered on this device.
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
