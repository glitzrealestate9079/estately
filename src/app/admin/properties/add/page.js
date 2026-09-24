import { PageHeader } from "@/components/common/page-header";
import { PropertyWizard } from "@/components/properties/form/property-wizard";

export const metadata = { title: "Add Property" };

export default function AddPropertyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Property" subtitle="Publish a new listing to your platform in a few guided steps." />
      <PropertyWizard mode="add" />
    </div>
  );
}
