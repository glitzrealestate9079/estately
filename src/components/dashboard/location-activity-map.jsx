"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LOCATION_ACTIVITY } from "@/data/analytics";
import { formatCompactNumber, cn } from "@/lib/utils";

const IndiaMap = dynamic(() => import("@react-map/india"), { ssr: false });

// The map package keys colors by official state/UT name, so each mock city
// is attributed to the state it actually sits in for the choropleth fill.
const CITY_TO_STATE = {
  "Delhi NCR": "Delhi",
  Mumbai: "Maharashtra",
  Bengaluru: "Karnataka",
  Pune: "Maharashtra",
  Hyderabad: "Telangana",
  Chennai: "Tamil Nadu",
  Jaipur: "Rajasthan",
  Ahmedabad: "Gujarat",
  Gurugram: "Haryana",
  Noida: "Uttar Pradesh",
};

const STATE_ACTIVITY = (() => {
  const byState = new Map();
  for (const loc of LOCATION_ACTIVITY) {
    const state = CITY_TO_STATE[loc.city];
    if (!state) continue;
    const prev = byState.get(state) ?? { listings: 0, leads: 0, cities: [] };
    byState.set(state, {
      listings: prev.listings + loc.listings,
      leads: prev.leads + loc.leads,
      cities: [...prev.cities, loc.city],
    });
  }
  return byState;
})();

const MAX_STATE_LISTINGS = Math.max(...[...STATE_ACTIVITY.values()].map((v) => v.listings));

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const INTENSITY_LOW = "#93c5fd"; // primary-300
const INTENSITY_HIGH = "#1d4ed8"; // primary-700

const CITY_COLORS = Object.fromEntries(
  [...STATE_ACTIVITY.entries()].map(([state, data]) => [
    state,
    mix(INTENSITY_LOW, INTENSITY_HIGH, data.listings / MAX_STATE_LISTINGS),
  ])
);

const RANKED = [...LOCATION_ACTIVITY].sort((a, b) => b.listings - a.listings).slice(0, 5);
const MAX_LISTINGS = RANKED[0]?.listings ?? 1;

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    setDark(el.classList.contains("dark"));
    const observer = new MutationObserver(() => setDark(el.classList.contains("dark")));
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export function LocationActivityMap() {
  const dark = useIsDark();

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Property Activity by Location</CardTitle>
          <CardDescription>Live listing & lead density across top states</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex items-center justify-center rounded-xl border border-border-subtle bg-surface-muted p-4">
          <IndiaMap
            type="select-single"
            size={360}
            mapColor={dark ? "#1e3a54" : "#dbe4f0"}
            strokeColor={dark ? "#0a1929" : "#ffffff"}
            strokeWidth={1}
            hoverColor="#6366f1"
            hints
            hintTextColor="#ffffff"
            hintBackgroundColor="#102a43"
            hintBorderRadius={8}
            hintPadding="6px 10px"
            cityColors={CITY_COLORS}
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            Top Cities by Activity
          </p>
          <ul className="space-y-3.5">
            {RANKED.map((loc, index) => (
              <li key={loc.city}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                        index === 0
                          ? "bg-primary-600 text-white"
                          : "bg-surface-muted text-foreground-muted"
                      )}
                    >
                      {index + 1}
                    </span>
                    <MapPin className="h-3.5 w-3.5 text-foreground-muted" />
                    {loc.city}
                  </span>
                  <span className="text-xs font-semibold text-foreground-muted">
                    {formatCompactNumber(loc.listings)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${(loc.listings / MAX_LISTINGS) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
