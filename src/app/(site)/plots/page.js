import { Suspense } from "react";
import { PropertySearchExperience } from "@/components/site/search/property-search-experience";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";

export const metadata = {
  title: "Plots & Land for Sale in India",
  description: "Browse residential and commercial plots for sale across India with verified area and price details.",
};

export default function PlotsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><PropertyGridSkeleton /></div>}>
      <PropertySearchExperience categoryKey="plots" />
    </Suspense>
  );
}
