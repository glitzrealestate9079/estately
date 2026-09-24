"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { SEARCH_CATEGORY_LIST } from "@/lib/site/categories";
import { BUDGET_PRESETS_BY_CATEGORY, BHK_OPTIONS } from "@/lib/site/budget-presets";
import { LocationAutocomplete } from "@/components/site/search/location-autocomplete";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";
import { cn } from "@/lib/utils";

export function SearchHero({ className }) {
  const router = useRouter();
  const { addRecentSearch } = useSite();
  const [category, setCategory] = useState("buy");
  const [location, setLocation] = useState(null);
  const [propertyType, setPropertyType] = useState("any");
  const [bhk, setBhk] = useState("any");
  const [budget, setBudget] = useState("any");

  const activeCategoryConfig = SEARCH_CATEGORY_LIST.find((c) => c.key === category);
  const budgetPresets = BUDGET_PRESETS_BY_CATEGORY[category] ?? [];
  const showBhk = category !== "commercial" && category !== "plots";

  function handleCategoryChange(key) {
    setCategory(key);
    setPropertyType("any");
    setBhk("any");
    setBudget("any");
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (location?.city) params.set("city", location.city);
    if (location?.locality) params.set("locality", location.locality);
    if (propertyType !== "any") params.set("propertyType", propertyType);
    if (bhk !== "any") params.set("bhk", bhk);
    if (budget !== "any") {
      const preset = budgetPresets.find((b) => b.label === budget);
      if (preset) {
        params.set("minPrice", preset.min);
        if (preset.max) params.set("maxPrice", preset.max);
      }
    }

    const label = [location?.searchLabel ?? location?.label, activeCategoryConfig?.label].filter(Boolean).join(" · ");
    if (label) {
      addRecentSearch({ label, href: `${activeCategoryConfig.href}?${params.toString()}` });
    }

    router.push(`${activeCategoryConfig.href}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className={cn("w-full rounded-2xl border border-white/10 bg-surface/95 p-3 shadow-popover backdrop-blur-xl sm:p-4", className)}>
      <div className="flex flex-wrap gap-1.5">
        {SEARCH_CATEGORY_LIST.map((c) => (
          <button
            key={c.key}
            onClick={() => handleCategoryChange(c.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
              category === c.key
                ? "bg-primary-600 text-white shadow-sm"
                : "text-foreground-muted hover:bg-surface-muted"
            )}
          >
            <c.icon className="h-4 w-4" />
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <LocationAutocomplete
          onSelect={(option) =>
            setLocation(
              option
                ? { city: option.city, locality: option.locality, label: option.label, searchLabel: option.searchLabel ?? option.label }
                : null
            )
          }
          placeholder={`Search city, locality or project — e.g. "${category === "commercial" ? "Cyber City" : "Malviya Nagar"}"`}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <SelectField
          value={propertyType}
          onChange={setPropertyType}
          placeholder="Property Type"
          options={[{ value: "any", label: "Any Type" }, ...activeCategoryConfig.propertyTypes.map((t) => ({ value: t, label: t }))]}
        />
        {showBhk && (
          <SelectField
            value={bhk}
            onChange={setBhk}
            placeholder="BHK"
            options={[{ value: "any", label: "Any BHK" }, ...BHK_OPTIONS]}
          />
        )}
        <SelectField
          value={budget}
          onChange={setBudget}
          placeholder="Budget"
          options={[{ value: "any", label: "Any Budget" }, ...budgetPresets.map((b) => ({ value: b.label, label: b.label }))]}
        />
        <Button onClick={handleSearch} size="lg" className="col-span-2 gap-2 sm:col-span-1 lg:col-span-1">
          <Search className="h-4 w-4" /> Search
        </Button>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-foreground lg:hidden"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" /> More filters available on the results page
      </button>
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
