import { PageHeader } from "@/components/common/page-header";
import { ProfileForm } from "@/components/settings/ProfileForm";

export const metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage your personal account information." />
      <div className="max-w-xl">
        <ProfileForm />
      </div>
    </div>
  );
}
