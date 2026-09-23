"use client";

import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LISTING_TRENDS_BY_PERIOD } from "@/data/analytics";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";

const SERIES = [
  { key: "newListings", name: "New Listings", color: "var(--color-primary-500)" },
  { key: "approved", name: "Approved", color: "var(--color-success-500)" },
  { key: "sold", name: "Sold", color: "var(--color-accent-500)" },
  { key: "rented", name: "Rented", color: "var(--color-warning-500)" },
];

export function ListingTrendsChart() {
  const [period, setPeriod] = useState("monthly");
  const data = LISTING_TRENDS_BY_PERIOD[period];

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle>Property Listing Trends</CardTitle>
          <CardDescription>New, approved, sold and rented listings over time</CardDescription>
        </div>
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
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
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "var(--color-foreground-muted)" }}
              />
              {SERIES.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
