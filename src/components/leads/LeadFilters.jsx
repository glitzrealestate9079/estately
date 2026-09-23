"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_AGENTS } from "@/data/leads";
import { LEAD_SOURCES } from "@/lib/constants";
import { LEAD_STATUSES } from "@/schemas/leadSchema";

export const DEFAULT_LEAD_FILTERS = { search: "", status: "all", source: "all", agent: "all" };

function FilterSelect({ value, onChange, placeholder, options, className }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? "w-full sm:w-44"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function LeadFilters({ filters, onChange, resultCount }) {
  const activeCount = Object.values(filters).filter((v) => v && v !== "all").length;

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by name, phone, email or property…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
          />
        </div>
        <FilterSelect value={filters.status} onChange={(v) => set("status", v)} placeholder="All Status" options={LEAD_STATUSES} />
        <FilterSelect value={filters.source} onChange={(v) => set("source", v)} placeholder="All Sources" options={LEAD_SOURCES} />
        <FilterSelect
          value={filters.agent}
          onChange={(v) => set("agent", v)}
          placeholder="All Agents"
          options={LEAD_AGENTS.map((a) => a.name)}
        />
        {activeCount > 0 && (
          <Button variant="ghost" onClick={() => onChange(DEFAULT_LEAD_FILTERS)}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      <p className="text-xs text-foreground-muted">{resultCount} leads found</p>
    </div>
  );
}
