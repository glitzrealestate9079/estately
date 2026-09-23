import { PageHeader } from "@/components/common/page-header";
import { PaymentsTable } from "@/components/payments/payments-table";

export const metadata = { title: "Payments" };

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        subtitle="Track platform revenue, transactions and invoices."
      />
      <PaymentsTable />
    </div>
  );
}
