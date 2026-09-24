"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PUBLIC_CITIES, PUBLIC_LOCALITIES } from "@/lib/site/site-data";
import { BHK_OPTIONS, BUDGET_PRESETS_BY_CATEGORY } from "@/lib/site/budget-presets";
import { FURNISHING_OPTIONS } from "@/lib/constants";
import { PG_GENDER_OPTIONS, PG_ROOM_TYPES, COMMERCIAL_CATEGORIES, POSSESSION_STATUSES } from "@/lib/site/derived";
import { formatIndianCurrency } from "@/lib/site/format";
import { cn } from "@/lib/utils";

export function FilterForm({ category, filters, setFilters, resetFilters }) {
  const localityOptions = useMemo(
    () => (filters.city ? PUBLIC_LOCALITIES.filter((l) => l.cityName === filters.city) : []),
    [filters.city]
  );
  const budgetPresets = BUDGET_PRESETS_BY_CATEGORY[category.key] ?? [];
  const showBhk = category.key === "buy" || category.key === "rent";
  const showFurnishing = category.key !== "plots";
  const showPossession = category.key === "buy" || category.key === "rent";

  return (
    <div className="space-y-6">
      <FilterSection title="Location">
        <div className="grid grid-cols-1 gap-2.5">
          <Select
            value={filters.city || "any"}
            onValueChange={(value) => setFilters({ city: value === "any" ? "" : value, locality: "" })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any city</SelectItem>
              {PUBLIC_CITIES.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.locality || "any"}
            onValueChange={(value) => setFilters({ locality: value === "any" ? "" : value })}
            disabled={!filters.city}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any locality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any locality</SelectItem>
              {localityOptions.map((locality) => (
                <SelectItem key={locality.id} value={locality.name}>
                  {locality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      {category.propertyTypes.length > 1 && (
        <FilterSection title="Property Type">
          <Select value={filters.propertyType} onValueChange={(value) => setFilters({ propertyType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any type</SelectItem>
              {category.propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>
      )}

      {showBhk && (
        <FilterSection title="Bedrooms (BHK)">
          <div className="flex flex-wrap gap-2">
            <ChipButton active={filters.bhk === "any"} onClick={() => setFilters({ bhk: "any" })}>
              Any
            </ChipButton>
            {BHK_OPTIONS.map((option) => (
              <ChipButton key={option.value} active={filters.bhk === option.value} onClick={() => setFilters({ bhk: option.value })}>
                {option.label}
              </ChipButton>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Budget">
        <div className="flex flex-wrap gap-2">
          {budgetPresets.map((preset) => {
            const active = String(filters.minPrice) === String(preset.min) && String(filters.maxPrice || "") === String(preset.max ?? "");
            return (
              <ChipButton
                key={preset.label}
                active={active}
                onClick={() => setFilters({ minPrice: preset.min, maxPrice: preset.max ?? "" })}
              >
                {preset.label}
              </ChipButton>
            );
          })}
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ maxPrice: e.target.value })}
          />
        </div>
        {(filters.minPrice || filters.maxPrice) && (
          <p className="mt-1.5 text-xs text-foreground-muted">
            {filters.minPrice ? formatIndianCurrency(Number(filters.minPrice)) : "₹0"} –{" "}
            {filters.maxPrice ? formatIndianCurrency(Number(filters.maxPrice)) : "No limit"}
          </p>
        )}
      </FilterSection>

      <FilterSection title="Area (sq.ft)">
        <div className="grid grid-cols-2 gap-2.5">
          <Input type="number" placeholder="Min area" value={filters.minArea} onChange={(e) => setFilters({ minArea: e.target.value })} />
          <Input type="number" placeholder="Max area" value={filters.maxArea} onChange={(e) => setFilters({ maxArea: e.target.value })} />
        </div>
      </FilterSection>

      {showFurnishing && (
        <FilterSection title="Furnishing">
          <Select value={filters.furnishing} onValueChange={(value) => setFilters({ furnishing: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {FURNISHING_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>
      )}

      {showPossession && (
        <FilterSection title="Possession">
          <Select value={filters.possession} onValueChange={(value) => setFilters({ possession: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {POSSESSION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>
      )}

      {category.key === "pg" && (
        <>
          <FilterSection title="Preferred For">
            <div className="flex flex-wrap gap-2">
              <ChipButton active={filters.gender === "any"} onClick={() => setFilters({ gender: "any" })}>
                Any
              </ChipButton>
              {PG_GENDER_OPTIONS.map((option) => (
                <ChipButton key={option} active={filters.gender === option} onClick={() => setFilters({ gender: option })}>
                  {option}
                </ChipButton>
              ))}
            </div>
          </FilterSection>
          <FilterSection title="Room Type">
            <Select value={filters.roomType} onValueChange={(value) => setFilters({ roomType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {PG_ROOM_TYPES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterSection>
        </>
      )}

      {category.key === "commercial" && (
        <FilterSection title="Commercial Category">
          <Select value={filters.commercialCategory} onValueChange={(value) => setFilters({ commercialCategory: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {COMMERCIAL_CATEGORIES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>
      )}

      <FilterSection title="Quick Filters">
        <div className="space-y-3">
          <ToggleRow label="Owner properties only" checked={filters.ownerOnly} onChange={(v) => setFilters({ ownerOnly: v })} />
          <ToggleRow label="Verified listings" checked={filters.verified} onChange={(v) => setFilters({ verified: v })} />
          <ToggleRow label="RERA registered" checked={filters.rera} onChange={(v) => setFilters({ rera: v })} />
          <ToggleRow label="Parking available" checked={filters.parking} onChange={(v) => setFilters({ parking: v })} />
        </div>
      </FilterSection>

      <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
        <RotateCcw className="h-3.5 w-3.5" /> Reset all filters
      </Button>
    </div>
  );
}

function FilterSection({ title, children }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-foreground-muted">{title}</p>
      {children}
    </div>
  );
}

function ChipButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary-600 bg-primary-600 text-white"
          : "border-border-subtle bg-surface text-foreground-muted hover:border-primary-300 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="mb-0 cursor-pointer text-sm font-normal text-foreground" onClick={() => onChange(!checked)}>
        {label}
      </Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
