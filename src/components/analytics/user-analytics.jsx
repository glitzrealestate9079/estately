"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";

// Inline mock data: buyer vs agent sign-ups over the last 9 months.
const SIGNUP_TRENDS = [
  { month: "Jan", buyers: 420, agents: 38 },
  { month: "Feb", buyers: 468, agents: 42 },
  { month: "Mar", buyers: 512, agents: 46 },
  { month: "Apr", buyers: 486, agents: 44 },
  { month: "May", buyers: 560, agents: 52 },
  { month: "Jun", buyers: 604, agents: 58 },
  { month: "Jul", buyers: 588, agents: 55 },
  { month: "Aug", buyers: 642, agents: 61 },
  { month: "Sep", buyers: 690, agents: 66 },
];

export function UserAnalytics() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>User Analytics</CardTitle>
          <CardDescription>Buyer vs agent sign-ups over the last 9 months</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SIGNUP_TRENDS} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                padding={{ left: 12, right: 12 }}
                tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--color-foreground-muted)" }} />
              <Line
                type="monotone"
                dataKey="buyers"
                name="Buyer Sign-ups"
                stroke="var(--color-primary-500)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="agents"
                name="Agent Sign-ups"
                stroke="var(--color-accent-500)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
