import { CreditCard } from "lucide-react";
import { listPayments } from "@/features/payments/api";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import { PageHeader } from "@/components/shared/page-header";

export default async function PaymentsPage() {
  const { items: transactions } = await listPayments({ pageSize: 100 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={CreditCard} title="Payments" />
      <PaymentsTable transactions={transactions} />
    </div>
  );
}
