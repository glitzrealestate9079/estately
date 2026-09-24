import { PageHeader } from "@/components/common/page-header";
import { BuyersTable } from "@/components/buyers/BuyersTable";

export const metadata = { title: "Buyers & Tenants" };

export default function BuyersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Buyers & Tenants" subtitle="Track prospective buyers and tenants across your platform." />
      <BuyersTable />
    </div>
  );
}
