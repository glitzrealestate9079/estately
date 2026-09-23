import { Building2, CheckCircle2, FolderPlus, UserPlus, Wallet, TrendingUp, CalendarClock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RECENT_ACTIVITY } from "@/data/activity";
import { initials, cn } from "@/lib/utils";

const TYPE_ICON = {
  submission: Building2,
  lead: UserPlus,
  approval: CheckCircle2,
  visit: CalendarClock,
  project: FolderPlus,
  payment: Wallet,
  conversion: TrendingUp,
};

const TYPE_COLOR = {
  submission: "bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-500",
  lead: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
  approval: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  visit: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
  project: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
  payment: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  conversion: "bg-featured-50 text-featured-600 dark:bg-featured-500/10 dark:text-featured-500",
};

export function RecentActivityFeed() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across your platform</CardDescription>
        </div>
      </CardHeader>
      <div className="px-5 pb-5">
        <ol className="relative space-y-5 border-l border-border-subtle pl-6">
          {RECENT_ACTIVITY.map((item) => {
            const Icon = TYPE_ICON[item.type] ?? Building2;
            return (
              <li key={item.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface",
                    TYPE_COLOR[item.type]
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex items-start gap-2.5">
                  {item.avatar ? (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={item.avatar} alt={item.actor} />
                      <AvatarFallback>{initials(item.actor)}</AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{item.actor}</span> {item.text}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground-muted">{item.time}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
