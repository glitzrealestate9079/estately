"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Building2, Clock, FolderKanban, MapPin, Search, X } from "lucide-react";
import { searchLocations } from "@/lib/site/site-data";
import { useSite } from "@/components/site/providers/site-provider";
import { cn } from "@/lib/utils";

// Grouped, keyboard-navigable location search — mirrors the spec's
// LOCALITY / CITY / PROJECT / RECENT suggestion groups (section 6.2 / 70).
export function LocationAutocomplete({
  defaultValue = "",
  placeholder = "Search city, locality, project or landmark",
  onSelect,
  className,
  inputClassName,
  autoFocus = false,
}) {
  const { recentSearches, mounted } = useSite();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [lastDefaultValue, setLastDefaultValue] = useState(defaultValue);
  const containerRef = useRef(null);
  const listboxId = useId();

  // Re-sync when the controlling `defaultValue` prop changes — adjusted
  // during render per React's "you might not need an effect" guidance.
  if (defaultValue !== lastDefaultValue) {
    setLastDefaultValue(defaultValue);
    setQuery(defaultValue);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => searchLocations(query), [query]);

  const flatOptions = useMemo(() => {
    if (!query.trim()) {
      return mounted ? recentSearches.map((r) => ({ ...r, group: "Recent" })) : [];
    }
    return [
      ...results.localities.map((l) => ({
        group: "Locality",
        label: l.name,
        sub: `${l.cityName}`,
        href: `/locality/${l.id}`,
        searchLabel: `${l.name}, ${l.cityName}`,
        city: l.cityName,
        locality: l.name,
      })),
      ...results.cities.map((c) => ({
        group: "City",
        label: c.name,
        sub: `${c.propertyCount} properties`,
        href: `/city/${c.id}`,
        searchLabel: c.name,
        city: c.name,
      })),
      ...results.projects.map((p) => ({
        group: "Project",
        label: p.projectName,
        sub: `${p.locality}, ${p.city}`,
        href: `/project/${p.slug}`,
        searchLabel: p.projectName,
        city: p.city,
      })),
    ];
  }, [query, results, mounted, recentSearches]);

  function commit(option) {
    if (!option) return;
    setQuery(option.searchLabel ?? option.label);
    setOpen(false);
    setActiveIndex(-1);
    onSelect?.(option);
  }

  function handleKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatOptions[activeIndex]) commit(flatOptions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const grouped = groupBy(flatOptions, "group");

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={listboxId}
          className={cn(
            "h-12 w-full rounded-xl border border-border-subtle bg-surface pl-10 pr-9 text-sm text-foreground placeholder:text-foreground-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
            inputClassName
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onSelect?.(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && flatOptions.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-border-subtle bg-surface p-2 shadow-popover animate-scale-in"
        >
          {Object.entries(grouped).map(([group, options]) => (
            <div key={group} className="mb-1 last:mb-0">
              <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
                {group}
              </p>
              {options.map((option) => {
                const flatIndex = flatOptions.indexOf(option);
                const Icon = group === "City" ? Building2 : group === "Project" ? FolderKanban : group === "Recent" ? Clock : MapPin;
                return (
                  <button
                    key={`${group}-${option.label}-${option.sub}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(option)}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      flatIndex === activeIndex ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400" : "text-foreground hover:bg-surface-muted"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-foreground-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{option.label}</span>
                      {option.sub && <span className="block truncate text-xs text-foreground-muted">{option.sub}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {open && query.trim() && flatOptions.length === 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-border-subtle bg-surface p-4 text-center text-sm text-foreground-muted shadow-popover">
          No matches. Try a different city or locality name.
        </div>
      )}
    </div>
  );
}

function groupBy(list, key) {
  return list.reduce((acc, item) => {
    const group = item[key];
    acc[group] = acc[group] ? [...acc[group], item] : [item];
    return acc;
  }, {});
}
