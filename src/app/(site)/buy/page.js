import { Suspense } from "react";
import { PropertySearchExperience } from "@/components/site/search/property-search-experience";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";

export const metadata = {
  title: "Properties for Sale in India — Buy Verified Homes",
  description: "Browse verified apartments, villas, independent houses and farmhouses for sale across India.",
};

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><PropertyGridSkeleton /></div>}>
      <PropertySearchExperience categoryKey="buy" />
    </Suspense>
  );
}
