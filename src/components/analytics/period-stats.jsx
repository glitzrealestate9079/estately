"use client";

import { useState } from "react";
import { Building2, Contact, CalendarClock, Wallet } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/dashboard/kpi-card";

const PERIODS = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "1y", label: "1 Year" },
];

const iconClass = "h-4.5 w-4.5";

// Inline mock data, purely presentational — swapping periods only changes
// the headline stat row below, it does not filter the charts on the page.
const PERIOD_STATS = {
  today: [
    { icon: <Building2 className={iconClass} />, label: "New Listings", value: "18", change: 4.2, accent: "primary", trend: [4, 6, 5, 8, 7, 9, 10, 12, 18] },
    { icon: <Contact className={iconClass} />, label: "New Leads", value: "42", change: 6.8, accent: "info", trend: [10, 12, 14, 11, 16, 20, 24, 30, 42] },
    { icon: <CalendarClock className={iconClass} />, label: "Site Visits", value: "12", change: -3.1, accent: "warning", trend: [18, 16, 15, 17, 14, 13, 15, 12, 12] },
    { icon: <Wallet className={iconClass} />, label: "Revenue", value: "₹2.4L", change: 8.9, accent: "success", trend: [12, 15, 14, 18, 17, 20, 21, 22, 24] },
  ],
  "7d": [
    { icon: <Building2 className={iconClass} />, label: "New Listings", value: "128", change: 5.6, accent: "primary", trend: [60, 72, 68, 84, 90, 96, 104, 116, 128] },
    { icon: <Contact className={iconClass} />, label: "New Leads", value: "286", change: 9.4, accent: "info", trend: [140, 160, 155, 180, 200, 220, 240, 260, 286] },
    { icon: <CalendarClock className={iconClass} />, label: "Site Visits", value: "84", change: 2.1, accent: "warning", trend: [60, 64, 62, 70, 68, 74, 78, 80, 84] },
    { icon: <Wallet className={iconClass} />, label: "Revenue", value: "₹16.8L", change: 11.3, accent: "success", trend: [80, 92, 88, 102, 110, 118, 130, 148, 168] },
  ],
  "30d": [
    { icon: <Building2 className={iconClass} />, label: "New Listings", value: "512", change: 8.2, accent: "primary", trend: [40, 52, 48, 61, 58, 70, 66, 78, 82] },
    { icon: <Contact className={iconClass} />, label: "New Leads", value: "1,284", change: 12.6, accent: "info", trend: [22, 28, 24, 34, 30, 40, 36, 46, 52] },
    { icon: <CalendarClock className={iconClass} />, label: "Site Visits", value: "624", change: -2.3, accent: "warning", trend: [30, 26, 28, 24, 22, 20, 18, 16, 12] },
    { icon: <Wallet className={iconClass} />, label: "Revenue", value: "₹48.6L", change: 14.9, accent: "success", trend: [30, 34, 32, 40, 38, 46, 44, 52, 58] },
  ],
  "90d": [
    { icon: <Building2 className={iconClass} />, label: "New Listings", value: "1,480", change: 10.4, accent: "primary", trend: [420, 480, 510, 560, 620, 680, 720, 780, 840] },
    { icon: <Contact className={iconClass} />, label: "New Leads", value: "3,620", change: 15.8, accent: "info", trend: [980, 1120, 1240, 1380, 1520, 1680, 1840, 1980, 2160] },
    { icon: <CalendarClock className={iconClass} />, label: "Site Visits", value: "1,840", change: 6.7, accent: "warning", trend: [520, 560, 600, 640, 680, 720, 760, 800, 840] },
    { icon: <Wallet className={iconClass} />, label: "Revenue", value: "₹1.42 Cr", change: 18.2, accent: "success", trend: [280, 320, 350, 380, 420, 460, 500, 540, 580] },
  ],
  "1y": [
    { icon: <Building2 className={iconClass} />, label: "New Listings", value: "5,820", change: 22.5, accent: "primary", trend: [2200, 2600, 2900, 3400, 3800, 4300, 4700, 5200, 5820] },
    { icon: <Contact className={iconClass} />, label: "New Leads", value: "14,200", change: 26.3, accent: "info", trend: [5200, 6100, 6900, 8000, 9200, 10400, 11600, 12800, 14200] },
    { icon: <CalendarClock className={iconClass} />, label: "Site Visits", value: "7,260", change: 9.8, accent: "warning", trend: [2800, 3200, 3600, 4100, 4600, 5200, 5800, 6500, 7260] },
    { icon: <Wallet className={iconClass} />, label: "Revenue", value: "₹5.86 Cr", change: 28.4, accent: "success", trend: [1800, 2200, 2600, 3100, 3600, 4200, 4800, 5400, 5860] },
  ],
};

export function PeriodStats() {
  const [period, setPeriod] = useState("30d");
  const stats = PERIOD_STATS[period];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Performance Overview</h2>
          <p className="text-sm text-foreground-muted">Headline metrics for the selected period</p>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            {PERIODS.map((p) => (
              <TabsTrigger key={p.key} value={p.key}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <KpiCard key={stat.label} {...stat} comparison="vs previous period" />
        ))}
      </div>
    </div>
  );
}
