"use client";

import { useState } from "react";
import { CalendarRange, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENT_USER } from "@/data/current-user";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function WelcomeBanner() {
  const [range, setRange] = useState("30d");

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-gradient-to-r from-navy-950 via-navy-900 to-primary-900 p-6 text-white shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {getGreeting()}, {CURRENT_USER.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-navy-200">
          Here&apos;s what&apos;s happening with your real estate platform today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-40 border-white/15 bg-white/10 text-white [&_svg]:text-white">
            <CalendarRange className="h-4 w-4 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last 1 year</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
