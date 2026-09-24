import { Suspense } from "react";
import { PropertySearchExperience } from "@/components/site/search/property-search-experience";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";
import { CATEGORIES } from "@/lib/site/categories";

export const metadata = { title: "Search Properties" };

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const categoryKey = CATEGORIES[sp?.category] ? sp.category : "buy";

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><PropertyGridSkeleton /></div>}>
      <PropertySearchExperience categoryKey={categoryKey} />
    </Suspense>
  );
}
