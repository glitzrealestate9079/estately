"use client";

import { useState } from "react";
import { ListFilter, Map as MapIcon, Rows3, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { usePropertySearch } from "@/components/site/search/use-property-search";
import { FilterSidebar } from "@/components/site/search/filter-sidebar";
import { FilterDrawer } from "@/components/site/search/filter-drawer";
import { SortMenu } from "@/components/site/search/sort-menu";
import { SearchChips } from "@/components/site/search/search-chips";
import { ResultsMap } from "@/components/site/search/results-map";
import { EmptyResults } from "@/components/site/search/empty-results";
import { PropertyCard } from "@/components/site/property/property-card";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useSite } from "@/components/site/providers/site-provider";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { getLocalityByName } from "@/lib/site/site-data";
import { getCategory } from "@/lib/site/categories";
import { cn } from "@/lib/utils";

const FILTER_PRIORITY = [
  "locality",
  "city",
  "propertyType",
  "bhk",
  "minPrice",
  "minArea",
  "furnishing",
  "possession",
  "gender",
  "roomType",
  "commercialCategory",
  "ownerOnly",
  "verified",
  "rera",
  "parking",
];

export function PropertySearchExperience({ categoryKey }) {
  const category = getCategory(categoryKey);
  const search = usePropertySearch(category.key);
  const { requireAuth, addSavedSearch } = useSite();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [layout, setLayout] = useState("list");

  const title = buildTitle(category, search.filters);
  const localityIntel =
    search.filters.locality && search.filters.city
      ? getLocalityByName(search.filters.city, search.filters.locality)?.intel
      : null;

  function clearOneFilter() {
    const key = FILTER_PRIORITY.find((k) => search.filters[k] && search.filters[k] !== "any");
    if (key) search.removeFilter(key);
    else search.resetFilters();
  }

  function handleSaveSearch() {
    requireAuth(
      () => {
        addSavedSearch({ label: title, category: category.key, filters: search.filters, resultCount: search.total });
        toast.success("Search saved", { description: "We'll notify you when new matches are posted." });
      },
      { title: "Save this search", description: "Sign in to get alerts when new properties match this search." }
    );
  }

  function handleFocusLocality(locality, city) {
    search.setFilters({ locality, city });
    setLayout("list");
    toast.success(`Showing properties in ${locality}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {search.total} {search.total === 1 ? "property" : "properties"} found
            {localityIntel && (
              <span>
                {" "}
                · ₹{new Intl.NumberFormat("en-IN").format(localityIntel.avgPricePerSqft)}/sq.ft avg · updated{" "}
                {localityIntel.dataPeriod}
              </span>
            )}
          </p>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" onClick={handleSaveSearch}>
            <BookmarkPlus className="h-3.5 w-3.5" /> Save Search
          </Button>
          <SortMenu value={search.sortKey} onChange={search.setSortKey} />
          <ViewToggle layout={layout} setLayout={setLayout} />
        </div>
      </div>

      <div className="mb-4">
        <SearchChips filters={search.filters} removeFilter={search.removeFilter} resetFilters={search.resetFilters} />
      </div>

      {/* Mobile action bar */}
      <div className="mb-4 grid grid-cols-3 gap-2 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
          <ListFilter className="h-4 w-4" />
          Filters {search.activeFilterCount > 0 && `(${search.activeFilterCount})`}
        </Button>
        <SortMenu value={search.sortKey} onChange={search.setSortKey} className="h-8" />
        <Button variant="outline" size="sm" onClick={() => setLayout(layout === "map" ? "list" : "map")}>
          <MapIcon className="h-4 w-4" /> {layout === "map" ? "List" : "Map"}
        </Button>
      </div>

      <div className="flex gap-6">
        <FilterSidebar
          category={category}
          filters={search.filters}
          setFilters={search.setFilters}
          resetFilters={search.resetFilters}
          activeFilterCount={search.activeFilterCount}
        />

        <div className="min-w-0 flex-1">
          {search.total === 0 ? (
            <EmptyResults onClearOne={clearOneFilter} onReset={search.resetFilters} hasFilters={search.activeFilterCount > 0} />
          ) : layout === "map" ? (
            <ResultsMap properties={search.allFiltered} onFocusLocality={handleFocusLocality} />
          ) : layout === "split" ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">
              <ResultsGrid results={search.results} compact />
              <ResultsMap properties={search.allFiltered} onFocusLocality={handleFocusLocality} />
            </div>
          ) : (
            <ResultsGrid results={search.results} />
          )}

          {search.total > 0 && layout !== "map" && (
            <Pagination
              page={search.page}
              pageCount={search.pageCount}
              pageSize={search.pageSize}
              total={search.total}
              onPageChange={search.setPage}
              className="mt-6 rounded-2xl border border-border-subtle bg-surface"
            />
          )}
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        category={category}
        filters={search.filters}
        setFilters={search.setFilters}
        resetFilters={search.resetFilters}
        resultCount={search.total}
      />
    </div>
  );
}

function ResultsGrid({ results, compact = false }) {
  return (
    <RevealGroup
      className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", !compact && "xl:grid-cols-3")}
    >
      {results.map((property) => (
        <RevealItem key={property.id}>
          <PropertyCard property={property} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function ViewToggle({ layout, setLayout }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-surface-muted p-1">
      {[
        { key: "list", icon: Rows3, label: "List" },
        { key: "split", icon: ListFilter, label: "List + Map" },
        { key: "map", icon: MapIcon, label: "Map" },
      ].map((option) => (
        <button
          key={option.key}
          onClick={() => setLayout(option.key)}
          title={option.label}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted",
            layout === option.key ? "bg-surface text-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
          )}
        >
          <option.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function buildTitle(category, filters) {
  const bhkPart = filters.bhk !== "any" ? `${filters.bhk}${Number(filters.bhk) >= 4 ? "+" : ""} BHK ` : "";
  const typePart = filters.propertyType !== "any" ? filters.propertyType : category.propertyTypes.length === 1 ? category.propertyTypes[0] : "Properties";
  const actionPart = category.key === "buy" ? "for Sale" : category.key === "rent" ? "for Rent" : category.key === "pg" ? "" : "";
  const wherePart = filters.locality ? `in ${filters.locality}, ${filters.city}` : filters.city ? `in ${filters.city}` : "in India";
  return [bhkPart + typePart, actionPart, wherePart].filter(Boolean).join(" ");
}
