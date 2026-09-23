"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { PROPERTY_TYPES, LISTING_TYPES } from "@/lib/constants";

const STATUSES = ["Active", "Pending", "Sold", "Rented", "Rejected", "Draft"];
const CITIES = ["Jaipur", "Gurugram", "Bengaluru", "Pune", "Mumbai", "Hyderabad", "Noida", "Chennai", "Ahmedabad", "Delhi NCR"];

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-40">
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

export function PropertyFilters({ filters, onChange, resultCount }) {
  const activeCount = Object.values(filters).filter((v) => v && v !== "all" && v !== "").length;

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function clearAll() {
    onChange({
      search: "",
      type: "all",
      listingType: "all",
      status: "all",
      city: "all",
      verification: "all",
      minPrice: "",
      maxPrice: "",
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search by title, locality, city, or property ID…"
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
          />
        </div>
        <FilterSelect value={filters.type} onChange={(v) => set("type", v)} placeholder="Property Type" options={PROPERTY_TYPES} />
        <FilterSelect value={filters.status} onChange={(v) => set("status", v)} placeholder="Status" options={STATUSES} />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
              {activeCount > 2 && (
                <span className="ml-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {activeCount - 2}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4" align="end">
            <div>
              <Label>Listing Type</Label>
              <FilterSelect
                value={filters.listingType}
                onChange={(v) => set("listingType", v)}
                placeholder="Any listing type"
                options={LISTING_TYPES}
              />
            </div>
            <div>
              <Label>Location</Label>
              <FilterSelect value={filters.city} onChange={(v) => set("city", v)} placeholder="Any city" options={CITIES} />
            </div>
            <div>
              <Label>Verification</Label>
              <FilterSelect
                value={filters.verification}
                onChange={(v) => set("verification", v)}
                placeholder="Any verification"
                options={["Verified", "Unverified"]}
              />
            </div>
            <div>
              <Label>Price Range (₹)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => set("minPrice", e.target.value)}
                />
                <span className="text-foreground-muted">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => set("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeCount > 0 && (
          <Button variant="ghost" onClick={clearAll}>
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      <p className="text-xs text-foreground-muted">{resultCount} properties found</p>
    </div>
  );
}
