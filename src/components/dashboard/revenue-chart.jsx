"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { REVENUE_OVERVIEW } from "@/data/analytics";
import { formatCurrency } from "@/lib/utils";

const SERIES = [
  { key: "subscription", name: "Subscription Revenue", color: "var(--color-primary-500)" },
  { key: "featured", name: "Featured Listing Revenue", color: "var(--color-accent-500)" },
  { key: "services", name: "Service Revenue", color: "var(--color-success-500)" },
];

export function RevenueChart() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Subscription, featured listing and service revenue</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_OVERVIEW} margin={{ top: 10, right: 24, bottom: 0, left: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`rev-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                padding={{ left: 12, right: 12 }}
                tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v)}
                tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
                width={56}
              />
              <Tooltip content={<ChartTooltip formatter={formatCurrency} />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--color-foreground-muted)" }} />
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.5}
                  fill={`url(#rev-${s.key})`}
                  stackId="revenue"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
