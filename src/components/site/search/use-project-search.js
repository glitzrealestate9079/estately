"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { applyProjectFilters, sortProjects } from "@/lib/site/site-data";

const PAGE_SIZE = 12;

const DEFAULT_FILTERS = {
  q: "",
  city: "",
  locality: "",
  status: "any",
  propertyType: "any",
  minPrice: "",
  maxPrice: "",
  rera: false,
};

// Mirrors usePropertySearch()'s shape exactly, over PROJECTS/applyProjectFilters
// instead of PROPERTIES/applyFilters — see property-search-experience.jsx for
// why projects get their own parallel search/filter/experience stack rather
// than being force-fit into the property one.
export function useProjectSearch() {
  const searchParams = useSearchParams();

  const [filters, setFiltersState] = useState(() => ({
    ...DEFAULT_FILTERS,
    q: searchParams.get("q") ?? "",
    city: searchParams.get("city") ?? "",
    locality: searchParams.get("locality") ?? "",
    status: searchParams.get("status") ?? "any",
    propertyType: searchParams.get("propertyType") ?? "any",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    rera: searchParams.get("rera") === "true",
  }));
  const [sortKey, setSortKey] = useState(searchParams.get("sort") ?? "newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => sortProjects(applyProjectFilters(PROJECTS, filters), sortKey), [filters, sortKey]);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function setFilters(patch) {
    setFiltersState((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }

  function resetFilters() {
    setFiltersState(DEFAULT_FILTERS);
    setPage(1);
  }

  function removeFilter(key) {
    setFilters({ [key]: DEFAULT_FILTERS[key] });
  }

  return {
    filters,
    setFilters,
    resetFilters,
    removeFilter,
    activeFilterCount,
    sortKey,
    setSortKey,
    page: safePage,
    setPage,
    pageCount,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    results: paginated,
    allFiltered: filtered,
  };
}

function countActiveFilters(filters) {
  let count = 0;
  if (filters.q) count += 1;
  if (filters.city) count += 1;
  if (filters.status !== "any") count += 1;
  if (filters.propertyType !== "any") count += 1;
  if (filters.minPrice || filters.maxPrice) count += 1;
  if (filters.rera) count += 1;
  return count;
}

export { DEFAULT_FILTERS as PROJECT_DEFAULT_FILTERS };
