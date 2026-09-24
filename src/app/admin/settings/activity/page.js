import { PageHeader } from "@/components/common/page-header";
import { ActivityTimeline } from "@/components/settings/ActivityTimeline";

export const metadata = { title: "Activity" };

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity" subtitle="A history of actions taken on your account." />
      <ActivityTimeline />
    </div>
  );
}
