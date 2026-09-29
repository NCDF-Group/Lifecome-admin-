"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface BookingsTrendPoint {
  date: string;
  count: number;
}

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

/** The Dashboard page's bookings-trend chart. A client component because Recharts reads the DOM
 * to size itself - the page around it stays a server component. */
export function BookingsOverviewChart({ data }: { data: BookingsTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--link)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--link)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateLabel}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--ink-muted)", fontSize: 12 }}
          width={36}
          allowDecimals={false}
          tickCount={5}
        />
        <Tooltip
          labelFormatter={formatDateLabel}
          contentStyle={{
            borderRadius: 10,
            borderColor: "var(--line)",
            backgroundColor: "var(--card)",
            color: "var(--ink)",
            fontSize: 13,
          }}
        />
        <Area type="monotone" dataKey="count" stroke="var(--link)" strokeWidth={2} fill="url(#bookingsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
