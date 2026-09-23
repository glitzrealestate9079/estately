"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { formatNumber } from "@/lib/utils";

// Inline mock data: units sold vs available across all active projects.
const UNIT_STATUS = [
  { name: "Units Sold", value: 2840, color: "var(--color-success-500)" },
  { name: "Units Available", value: 1360, color: "var(--color-primary-500)" },
];

export function ProjectAnalytics() {
  const total = UNIT_STATUS.reduce((sum, item) => sum + item.value, 0);
  const soldPct = Math.round((UNIT_STATUS[0].value / total) * 100);

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Project Analytics</CardTitle>
          <CardDescription>Units sold vs available across all active projects</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="relative mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={UNIT_STATUS}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={3}
                cornerRadius={6}
                strokeWidth={0}
              >
                {UNIT_STATUS.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip formatter={formatNumber} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-xl font-bold text-foreground">{soldPct}%</p>
            <p className="text-xs text-foreground-muted">Sold</p>
          </div>
        </div>
        <ul className="space-y-3">
          {UNIT_STATUS.map((item) => (
            <li key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-foreground-muted">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-medium text-foreground">
                {formatNumber(item.value)}{" "}
                <span className="text-foreground-muted">({Math.round((item.value / total) * 100)}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
