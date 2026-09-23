import { PageHeader } from "@/components/common/page-header";
import { PropertiesPageActions } from "@/components/properties/PropertiesPageActions";
import { PropertiesTable } from "@/components/properties/properties-table";

export const metadata = { title: "Properties" };

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        subtitle="Manage and monitor all property listings."
        actions={<PropertiesPageActions />}
      />
      <PropertiesTable />
    </div>
  );
}
