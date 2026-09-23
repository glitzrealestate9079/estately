"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { PROPERTY_TYPE_DISTRIBUTION } from "@/data/analytics";
import { formatNumber } from "@/lib/utils";

export function PropertyTypeChart() {
  const total = PROPERTY_TYPE_DISTRIBUTION.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Property Type Distribution</CardTitle>
          <CardDescription>Share of active listings by property type</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PROPERTY_TYPE_DISTRIBUTION}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={3}
                cornerRadius={6}
                strokeWidth={0}
              >
                {PROPERTY_TYPE_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip formatter={formatNumber} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-display text-xl font-bold text-foreground">{formatNumber(total)}</p>
            <p className="text-xs text-foreground-muted">Total Listings</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {PROPERTY_TYPE_DISTRIBUTION.map((item) => (
            <li key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-foreground-muted">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
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
