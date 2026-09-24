import { Suspense } from "react";
import { PropertySearchExperience } from "@/components/site/search/property-search-experience";
import { PropertyGridSkeleton } from "@/components/site/property/property-card-skeleton";

export const metadata = {
  title: "PG & Co-living in India — Verified Paying Guest Accommodation",
  description: "Find PG and co-living spaces with food, WiFi and housekeeping — filtered by gender preference and room type.",
};

export default function PgPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><PropertyGridSkeleton /></div>}>
      <PropertySearchExperience categoryKey="pg" />
    </Suspense>
  );
}
