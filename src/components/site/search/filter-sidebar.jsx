import { FilterForm } from "@/components/site/search/filter-form";

export function FilterSidebar({ category, filters, setFilters, resetFilters, activeFilterCount }) {
  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-foreground">
            Filters {activeFilterCount > 0 && <span className="text-primary-600">({activeFilterCount})</span>}
          </p>
        </div>
        <FilterForm category={category} filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
      </div>
    </aside>
  );
}
