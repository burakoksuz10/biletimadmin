"use client";

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export interface SalesDataPoint {
  month: string;
  income: number;
}

// Simple formatter - inline to avoid module import
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
  }).format(value);
}

const GRADIENT_ID = "revenue-gradient";

export function RevenueChart({ data }: { data: readonly SalesDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary, #6b38d4)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary, #6b38d4)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--color-on-surface-variant, #494454)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-on-surface-variant, #494454)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface-lower, rgba(255, 255, 255, 0.95))",
            border: "1px solid var(--color-outline, rgba(203, 195, 215, 0.3))",
            borderRadius: "8px",
            color: "var(--color-on-surface, #1d1a23)",
          }}
          formatter={(value) => formatCurrency(Number(value))}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="var(--color-primary, #6b38d4)"
          strokeWidth={2}
          fill={`url(#${GRADIENT_ID})`}
          animationBegin={0}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
