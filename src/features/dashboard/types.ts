// Mirrors Lifecome-backend's `DashboardSummary` (src/modules/admin-dashboard/admin-dashboard.service.ts).
export interface DashboardSummary {
  totals: {
    patients: number;
    activeProviders: number;
    bookings: number;
    successfulPayments: { count: number; amountKobo: number };
  };
  bookingsByStatus: Record<string, number>;
  paymentsByStatus: Record<string, number>;
  bookingsTrend: { date: string; count: number }[];
  byMarket: Record<MarketCode, MarketSummary> & { other: { patients: number } };
}

/** ISO 3166-1 alpha-2 — the UK is `GB`. */
export type MarketCode = "NG" | "GB";

export interface MarketSummary {
  patients: number;
  newPatientsLast30Days: number;
  bookings: number;
}
