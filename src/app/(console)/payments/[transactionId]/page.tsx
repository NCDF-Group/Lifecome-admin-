import { CreditCard } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function TransactionDetailPage() {
  return (
    <PagePlaceholder
      icon={CreditCard}
      title="Transaction detail"
      description="One transaction's full detail and reconciliation status."
    />
  );
}
