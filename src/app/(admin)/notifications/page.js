import { PageHeader } from "@/components/common/page-header";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay on top of property submissions, leads, payments and platform activity."
      />
      <NotificationsList />
    </div>
  );
}
