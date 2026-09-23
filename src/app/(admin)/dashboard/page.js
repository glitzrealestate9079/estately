import {
  Building2,
  Home,
  FolderKanban,
  UserPlus,
  CalendarClock,
  ShieldCheck,
  ClipboardCheck,
  Wallet,
} from "lucide-react";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ListingTrendsChart } from "@/components/dashboard/listing-trends-chart";
import { PropertyTypeChart } from "@/components/dashboard/property-type-chart";
import { LeadFunnelChart } from "@/components/dashboard/lead-funnel-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { LocationActivityMap } from "@/components/dashboard/location-activity-map";
import { TopPropertiesTable } from "@/components/dashboard/top-properties-table";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { KPI_TREND } from "@/data/analytics";

export const metadata = { title: "Dashboard" };

const iconClass = "h-4.5 w-4.5";

const KPIS = [
  {
    icon: <Building2 className={iconClass} />,
    label: "Total Properties",
    value: "12,842",
    change: 8.2,
    accent: "primary",
    trend: KPI_TREND.properties,
  },
  {
    icon: <Home className={iconClass} />,
    label: "Active Listings",
    value: "8,426",
    change: 5.4,
    accent: "success",
    trend: KPI_TREND.properties.slice().reverse(),
  },
  {
    icon: <FolderKanban className={iconClass} />,
    label: "Total Projects",
    value: "428",
    change: 3.1,
    accent: "accent",
    trend: KPI_TREND.visits,
  },
  {
    icon: <UserPlus className={iconClass} />,
    label: "New Leads",
    value: "1,284",
    change: 12.6,
    accent: "info",
    trend: KPI_TREND.leads,
  },
  {
    icon: <CalendarClock className={iconClass} />,
    label: "Site Visits",
    value: "624",
    change: -2.3,
    accent: "warning",
    trend: KPI_TREND.visits,
  },
  {
    icon: <ShieldCheck className={iconClass} />,
    label: "Verified Properties",
    value: "7,842",
    change: 6.8,
    accent: "success",
    trend: KPI_TREND.properties,
  },
  {
    icon: <ClipboardCheck className={iconClass} />,
    label: "Pending Approvals",
    value: "184",
    change: -4.5,
    accent: "warning",
    trend: KPI_TREND.leads.slice().reverse(),
  },
  {
    icon: <Wallet className={iconClass} />,
    label: "Revenue",
    value: "₹48.6L",
    change: 14.9,
    accent: "primary",
    trend: KPI_TREND.revenue,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

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

      <LocationActivityMap />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TopPropertiesTable />
        </div>
        <RecentActivityFeed />
      </div>
    </div>
  );
}
