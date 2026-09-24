import { PageHeader } from "@/components/common/page-header";
import { ListingTrendsChart } from "@/components/dashboard/listing-trends-chart";
import { PropertyTypeChart } from "@/components/dashboard/property-type-chart";
import { LeadFunnelChart } from "@/components/dashboard/lead-funnel-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { LocationActivityMap } from "@/components/dashboard/location-activity-map";
import { PeriodStats } from "@/components/analytics/period-stats";
import { LocationAnalytics } from "@/components/analytics/location-analytics";
import { UserAnalytics } from "@/components/analytics/user-analytics";
import { ProjectAnalytics } from "@/components/analytics/project-analytics";

export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Deep-dive into property, lead, revenue and user performance." />

      <PeriodStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ListingTrendsChart />
        </div>
        <PropertyTypeChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LeadFunnelChart />
        <RevenueChart />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserAnalytics />
        <ProjectAnalytics />
      </div>

      <LocationActivityMap />
      <LocationAnalytics />
    </div>
  );
}
