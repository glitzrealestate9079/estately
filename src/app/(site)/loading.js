import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";

export default function SiteLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="skeleton mb-6 h-8 w-64 rounded-lg" />
      <PropertyGridSkeleton count={8} />
    </div>
  );
}
