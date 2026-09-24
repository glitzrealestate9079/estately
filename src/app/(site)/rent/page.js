import { Suspense } from "react";
import { PropertySearchExperience } from "@/components/site/search/property-search-experience";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";

export const metadata = {
  title: "Properties for Rent in India — Verified Rental Homes",
  description: "Find apartments, villas and independent houses for rent across India with verified owners and agents.",
};

export default function RentPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><PropertyGridSkeleton /></div>}>
      <PropertySearchExperience categoryKey="rent" />
    </Suspense>
  );
}
