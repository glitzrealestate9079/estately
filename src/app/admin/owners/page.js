import { PageHeader } from "@/components/common/page-header";
import { OwnersTable } from "@/components/owners/OwnersTable";

export const metadata = { title: "Owners" };

export default function OwnersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Owners" subtitle="Manage property owners and their verification status." />
      <OwnersTable />
    </div>
  );
}
