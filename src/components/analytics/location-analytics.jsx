import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Inline mock data — demand score out of 100.
const TOP_LOCALITIES = [
  { locality: "Whitefield, Bengaluru", demand: 96 },
  { locality: "Gachibowli, Hyderabad", demand: 91 },
  { locality: "Baner, Pune", demand: 87 },
  { locality: "Bandra, Mumbai", demand: 84 },
  { locality: "Golf Course Road, Gurugram", demand: 80 },
  { locality: "Sarjapur Road, Bengaluru", demand: 74 },
  { locality: "Malviya Nagar, Jaipur", demand: 68 },
  { locality: "OMR, Chennai", demand: 63 },
];

export function LocationAnalytics() {
  const max = TOP_LOCALITIES[0].demand;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Location Analytics</CardTitle>
          <CardDescription>Top localities ranked by buyer demand score</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {TOP_LOCALITIES.map((item, index) => (
          <div key={item.locality} className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-bold text-foreground-muted">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-1.5 truncate font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />
                  {item.locality}
                </span>
                <span className="shrink-0 text-xs font-semibold text-foreground-muted">{item.demand}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-700 ease-out"
                  style={{ width: `${(item.demand / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
