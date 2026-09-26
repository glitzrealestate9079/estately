import { DashboardShell } from "@/components/site/dashboard/dashboard-shell";

export const metadata = {
  title: "Seller Dashboard",
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
