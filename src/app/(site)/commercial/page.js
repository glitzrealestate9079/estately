import { Suspense } from "react";
import { PropertySearchExperience } from "@/components/site/search/property-search-experience";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";

export const metadata = {
  title: "Commercial Properties in India — Offices, Shops & Warehouses",
  description: "Browse commercial office space, shops, showrooms and warehouses for sale or rent across India.",
};

export default function CommercialPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><PropertyGridSkeleton /></div>}>
      <PropertySearchExperience categoryKey="commercial" />
    </Suspense>
  );
}
