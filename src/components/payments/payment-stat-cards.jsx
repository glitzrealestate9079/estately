import { IndianRupee, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ACCENTS = {
  primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
  success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
  warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
  error: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-500",
};

function StatTile({ icon: Icon, label, value, hint, accent }) {
  return (
    <Card hover className="animate-slide-up p-5">
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-lg", ACCENTS[accent])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium text-foreground-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-foreground-muted">{hint}</p>}
    </Card>
  );
}

// stats: { totalRevenue: string, successCount, pendingCount, failedCount: number }
export function PaymentStatCards({ totalRevenue, successCount, pendingCount, failedCount }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={IndianRupee}
        label="Total Revenue"
        value={totalRevenue}
        hint="From successful payments"
        accent="primary"
      />
      <StatTile icon={CheckCircle2} label="Successful" value={formatNumber(successCount)} hint="Completed payments" accent="success" />
      <StatTile icon={Clock} label="Pending" value={formatNumber(pendingCount)} hint="Awaiting confirmation" accent="warning" />
      <StatTile icon={XCircle} label="Failed" value={formatNumber(failedCount)} hint="Declined or errored" accent="error" />
    </div>
  );
}
