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

// Grouped sidebar navigation. Each item's `href` maps 1:1 to an app/(admin) route.
export const NAVIGATION = [
  {
    section: "Main",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "Property Management",
    items: [
      {
        label: "Properties",
        href: "/properties",
        icon: Building2,
        children: [{ label: "Approvals", href: "/properties/approvals", badge: "12" }],
      },
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Developers", href: "/developers", icon: HardHat },
    ],
  },
  {
    section: "User Management",
    items: [
      { label: "Agents", href: "/agents", icon: UserRoundCog },
      { label: "Owners", href: "/owners", icon: UserRound },
      { label: "Buyers & Tenants", href: "/buyers", icon: Users },
    ],
  },
  {
    section: "Leads & Engagement",
    items: [
      { label: "Leads", href: "/leads", icon: Contact, badge: "24" },
      { label: "Site Visits", href: "/site-visits", icon: CalendarClock },
      { label: "Saved Searches", href: "/saved-searches", icon: BookmarkCheck },
      { label: "Messages", href: "/messages", icon: MessagesSquare },
    ],
  },
  {
    section: "Monetization",
    items: [
      { label: "Payments", href: "/payments", icon: Wallet },
      { label: "Subscriptions", href: "/subscriptions", icon: BadgePercent },
      { label: "Services", href: "/services", icon: Wrench },
    ],
  },
  {
    section: "Analytics",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Analytics", href: "/analytics", icon: LineChart },
      { label: "Locations", href: "/locations", icon: MapPinned },
      { label: "Tools", href: "/tools", icon: Calculator },
    ],
  },
  {
    section: "System",
    items: [
      { label: "CMS / Content", href: "/cms", icon: LayoutTemplate },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Users & Roles", href: "/users", icon: ShieldCheck },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export const FLAT_NAVIGATION = NAVIGATION.flatMap((group) =>
  group.items.flatMap((item) => (item.children ? [item, ...item.children] : [item]))
);
