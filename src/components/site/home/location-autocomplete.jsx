"use client";

import { useState } from "react";
import { searchLocations, getPopularLocalities, getStateForCity } from "@/lib/site/site-data";

const RECENT_KEY = "estately_site_recent_locations";
const LEVEL_ICON = { City: "bi-geo-alt", Locality: "bi-pin-map", Project: "bi-buildings" };

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
  } catch {
    // localStorage unavailable — recent searches just won't persist
  }
}

function highlight(label, q) {
  if (!q) return label;
  const i = label.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return label;
  return (
    <>
      {label.slice(0, i)}
      <mark>{label.slice(i, i + q.length)}</mark>
      {label.slice(i + q.length)}
    </>
  );
}

// Ported from the prototype's attachAutocomplete() in app.js — grouped
// City/Locality/Project suggestions (via site-data.js's searchLocations(),
// already shaped for exactly this), recent picks from localStorage, keyboard
// navigation and a "level" tag per row. Multi-city, unlike the prototype's
// single-city (Jaipur) suggestion list.
export function LocationAutocomplete({ id, value, onChange, onSelect, placeholder, className }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState(() => (typeof window !== "undefined" ? readRecent() : []));

  const q = value.trim();
  let groups;
  if (!q) {
    const popular = getPopularLocalities(5).map((l) => ({
      label: l.name,
      sub: `${l.cityName} · Locality`,
      level: "Locality",
      cityName: l.cityName,
      localityName: l.name,
    }));
    groups = [
      ...(recent.length ? [{ label: "Recent searches", items: recent }] : []),
      { label: "Popular localities", items: popular },
    ];
  } else {
    const { localities, cities, projects } = searchLocations(q);
    groups = [
      cities.length && {
        label: "City",
        items: cities.map((c) => ({ label: c.name, sub: `${getStateForCity(c.name) ?? "India"} · City`, level: "City", cityName: c.name })),
      },
      localities.length && {
        label: "Locality",
        items: localities.map((l) => ({ label: l.name, sub: `${l.cityName} · Locality`, level: "Locality", cityName: l.cityName, localityName: l.name })),
      },
      projects.length && {
        label: "Project / Society",
        items: projects.map((p) => ({
          label: p.projectName,
          sub: `${p.locality}, ${p.city} · Project by ${p.developer}`,
          level: "Project",
          cityName: p.city,
          localityName: p.locality,
          projectSlug: p.slug,
        })),
      },
    ].filter(Boolean);
  }
  const flat = groups.flatMap((g) => g.items);

  function choose(item) {
    onChange(item.label);
    onSelect?.(item);
    const nextRecent = [item, ...recent.filter((r) => r.label !== item.label)].slice(0, 5);
    setRecent(nextRecent);
    writeRecent(nextRecent);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && active >= 0 && flat[active]) {
      e.preventDefault();
      choose(flat[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <>
      <input
        id={id}
        className={className}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={onKeyDown}
      />
      {open && (
        <div id={`${id}-panel`} className="ac-panel" role="listbox">
          {q && flat.length === 0 && (
            <div className="ac-empty">
              <b className="ink">No matching location</b>
              <br />
              Try a city, locality or project — e.g. &ldquo;Whitefield&rdquo;
            </div>
          )}
          {groups.map((g) => (
            <div key={g.label}>
              <div className="ac-group">{g.label}</div>
              {g.items.map((it) => {
                const idx = flat.indexOf(it);
                return (
                  <div
                    key={`${it.level}-${it.label}`}
                    className={`ac-item ${idx === active ? "is-active" : ""}`}
                    role="option"
                    aria-selected={idx === active}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      choose(it);
                    }}
                  >
                    <span className="ac-ico"><i className={`bi ${LEVEL_ICON[it.level] ?? "bi-geo-alt"}`} /></span>
                    <span className="grow">
                      <div className="ac-name">{highlight(it.label, q)}</div>
                      <div className="ac-sub">{it.sub}</div>
                    </span>
                    <span className="ac-level">{it.level}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
