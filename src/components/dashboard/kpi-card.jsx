"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({ icon, label, value, change, trend = [], accent = "primary", comparison = "vs last month" }) {
  const positive = change >= 0;
  const sparkData = trend.map((v, i) => ({ i, v }));
  const gradientId = `spark-${label.replace(/[^a-zA-Z0-9]+/g, "-")}`;

  const accents = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
    success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
    accent: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
    info: "bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-500",
  };

  return (
    <Card hover className="animate-slide-up overflow-hidden">
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="space-y-2">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", accents[accent])}>
            {icon}
          </div>
          <p className="text-xs font-medium text-foreground-muted">{label}</p>
          <p className="font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        {trend.length > 0 && (
          <div className="h-12 w-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={positive ? "var(--color-success-500)" : "var(--color-error-500)"}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={positive ? "var(--color-success-500)" : "var(--color-error-500)"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={positive ? "var(--color-success-500)" : "var(--color-error-500)"}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 px-5 pb-4 text-xs">
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
            positive
              ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500"
              : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-500"
          )}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change)}%
        </span>
        <span className="text-foreground-muted">{comparison}</span>
      </div>
    </Card>
  );
}
