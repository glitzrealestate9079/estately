import { PageHeader } from "@/components/common/page-header";
import { SavedSearchesTable } from "@/components/saved-searches/SavedSearchesTable";

export const metadata = { title: "Saved Searches" };

export default function SavedSearchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Saved Searches" subtitle="Manage buyer search alerts and saved criteria." />
      <SavedSearchesTable />
    </div>
  );
}
