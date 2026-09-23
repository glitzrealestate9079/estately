import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LEAD_FUNNEL } from "@/data/analytics";
import { formatCompactNumber } from "@/lib/utils";

const COLORS = [
  "bg-primary-600",
  "bg-primary-500",
  "bg-accent-500",
  "bg-info-500",
  "bg-warning-500",
  "bg-success-500",
];

export function LeadFunnelChart() {
  const max = LEAD_FUNNEL[0].value;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Lead Conversion Funnel</CardTitle>
          <CardDescription>From site visitors to closed deals</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {LEAD_FUNNEL.map((stage, index) => {
          const widthPct = Math.max(12, Math.round((stage.value / max) * 100));
          const prevValue = index > 0 ? LEAD_FUNNEL[index - 1].value : null;
          const conversion = prevValue ? Math.round((stage.value / prevValue) * 100) : null;

          return (
            <div key={stage.stage}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{stage.stage}</span>
                <span className="flex items-center gap-2 text-foreground-muted">
                  {conversion !== null && (
                    <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[11px] font-semibold text-foreground-muted">
                      {conversion}%
                    </span>
                  )}
                  <span className="font-semibold text-foreground">{formatCompactNumber(stage.value)}</span>
                </span>
              </div>
              <div className="h-8 w-full overflow-hidden rounded-lg bg-surface-muted">
                <div
                  className={`h-full rounded-lg ${COLORS[index % COLORS.length]} transition-all duration-700 ease-out`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
