import { PageHeader } from "@/components/common/page-header";
import { ReportsGrid } from "@/components/reports/reports-grid";

export const metadata = { title: "Reports" };

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and download platform-wide performance reports."
      />
      <ReportsGrid />
    </div>
  );
}
