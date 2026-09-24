import { PageHeader } from "@/components/common/page-header";
import { SiteVisitsList } from "@/components/site-visits/SiteVisitsList";

export const metadata = { title: "Site Visits" };

export default function SiteVisitsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Site Visits" subtitle="Schedule, confirm and track buyer site visits." />
      <SiteVisitsList />
    </div>
  );
}
