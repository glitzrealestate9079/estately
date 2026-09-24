"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPropertiesForCategory, applyFilters, sortProperties } from "@/lib/site/site-data";

const PAGE_SIZE = 12;

const DEFAULT_FILTERS = {
  city: "",
  locality: "",
  propertyType: "any",
  bhk: "any",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  furnishing: "any",
  parking: false,
  verified: false,
  rera: false,
  ownerOnly: false,
  gender: "any",
  roomType: "any",
  commercialCategory: "any",
  possession: "any",
};

export function usePropertySearch(categoryKey) {
  const searchParams = useSearchParams();

  const [filters, setFiltersState] = useState(() => ({
    ...DEFAULT_FILTERS,
    city: searchParams.get("city") ?? "",
    locality: searchParams.get("locality") ?? "",
    propertyType: searchParams.get("propertyType") ?? "any",
    bhk: searchParams.get("bhk") ?? "any",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    ownerOnly: searchParams.get("ownerOnly") === "true",
  }));
  const [sortKey, setSortKey] = useState(searchParams.get("sort") ?? "relevance");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");

  const baseList = useMemo(() => getPropertiesForCategory(categoryKey), [categoryKey]);
  const filtered = useMemo(() => sortProperties(applyFilters(baseList, filters), sortKey), [baseList, filters, sortKey]);

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
    totalBeforeFilters: baseList.length,
    results: paginated,
    allFiltered: filtered,
    viewMode,
    setViewMode,
  };
}

function countActiveFilters(filters) {
  let count = 0;
  if (filters.city) count += 1;
  if (filters.locality) count += 1;
  if (filters.propertyType !== "any") count += 1;
  if (filters.bhk !== "any") count += 1;
  if (filters.minPrice || filters.maxPrice) count += 1;
  if (filters.minArea || filters.maxArea) count += 1;
  if (filters.furnishing !== "any") count += 1;
  if (filters.parking) count += 1;
  if (filters.verified) count += 1;
  if (filters.rera) count += 1;
  if (filters.ownerOnly) count += 1;
  if (filters.gender !== "any") count += 1;
  if (filters.roomType !== "any") count += 1;
  if (filters.commercialCategory !== "any") count += 1;
  if (filters.possession !== "any") count += 1;
  return count;
}

export { DEFAULT_FILTERS, PAGE_SIZE };
