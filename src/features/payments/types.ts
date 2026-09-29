// Mirrors Lifecome-backend's `AdminPaymentRow` (src/modules/payment/payment.service.ts).
export type PaymentStatus =
  | "initiated"
  | "pending"
  | "successful"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  amountKobo: number;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  gatewayReference: string | null;
  receiptNumber: string | null;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
  patientName: string;
  serviceName: string;
}
