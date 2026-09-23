"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROJECT_TYPES, PROJECT_STATUSES } from "@/schemas/projectSchema";
import { PROJECT_CITIES } from "@/data/projects";

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-44">
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

export const DEFAULT_PROJECT_FILTERS = {
  search: "",
  type: "all",
  status: "all",
  city: "all",
};

export function ProjectFilters({ filters, onChange, resultCount }) {
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== "search" && value && value !== "all"
  ).length;

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange(DEFAULT_PROJECT_FILTERS);
  }

  const hasActiveFilters = activeCount > 0 || filters.search;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by project name, developer, or locality…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
          />
        </div>
        <FilterSelect value={filters.type} onChange={(v) => set("type", v)} placeholder="Project Type" options={PROJECT_TYPES} />
        <FilterSelect value={filters.status} onChange={(v) => set("status", v)} placeholder="Status" options={PROJECT_STATUSES} />
        <FilterSelect value={filters.city} onChange={(v) => set("city", v)} placeholder="City" options={PROJECT_CITIES} />
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAll}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      <p className="text-xs text-foreground-muted">{resultCount} projects found</p>
    </div>
  );
}
