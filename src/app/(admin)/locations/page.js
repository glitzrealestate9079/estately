import { PageHeader } from "@/components/common/page-header";
import { LocationTree } from "@/components/locations/LocationTree";

export const metadata = { title: "Locations" };

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Locations"
        subtitle="Manage the states, cities and localities available across your platform."
      />
      <LocationTree />
    </div>
  );
}
