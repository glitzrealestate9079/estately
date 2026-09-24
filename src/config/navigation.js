import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  HardHat,
  UserRoundCog,
  Users,
  UserRound,
  Contact,
  MessagesSquare,
  CalendarClock,
  BookmarkCheck,
  Wallet,
  BadgePercent,
  Wrench,
  BarChart3,
  LineChart,
  MapPinned,
  Calculator,
  LayoutTemplate,
  Bell,
  ShieldCheck,
  Settings,
} from "lucide-react";

// Grouped sidebar navigation. Each item's `href` maps 1:1 to an app/admin route.
export const NAVIGATION = [
  {
    section: "Main",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Property Management",
    items: [
      {
        label: "Properties",
        href: "/admin/properties",
        icon: Building2,
        children: [{ label: "Approvals", href: "/admin/properties/approvals", badge: "12" }],
      },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Developers", href: "/admin/developers", icon: HardHat },
    ],
  },
  {
    section: "User Management",
    items: [
      { label: "Agents", href: "/admin/agents", icon: UserRoundCog },
      { label: "Owners", href: "/admin/owners", icon: UserRound },
      { label: "Buyers & Tenants", href: "/admin/buyers", icon: Users },
    ],
  },
  {
    section: "Leads & Engagement",
    items: [
      { label: "Leads", href: "/admin/leads", icon: Contact, badge: "24" },
      { label: "Site Visits", href: "/admin/site-visits", icon: CalendarClock },
      { label: "Saved Searches", href: "/admin/saved-searches", icon: BookmarkCheck },
      { label: "Messages", href: "/admin/messages", icon: MessagesSquare },
    ],
  },
  {
    section: "Monetization",
    items: [
      { label: "Payments", href: "/admin/payments", icon: Wallet },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: BadgePercent },
      { label: "Services", href: "/admin/services", icon: Wrench },
    ],
  },
  {
    section: "Analytics",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Analytics", href: "/admin/analytics", icon: LineChart },
      { label: "Locations", href: "/admin/locations", icon: MapPinned },
      { label: "Tools", href: "/admin/tools", icon: Calculator },
    ],
  },
  {
    section: "System",
    items: [
      { label: "CMS / Content", href: "/admin/cms", icon: LayoutTemplate },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Users & Roles", href: "/admin/users", icon: ShieldCheck },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// Quick link back to the public consumer website from the admin console.
export const PUBLIC_SITE_HREF = "/";

export const FLAT_NAVIGATION = NAVIGATION.flatMap((group) =>
  group.items.flatMap((item) => (item.children ? [item, ...item.children] : [item]))
);
