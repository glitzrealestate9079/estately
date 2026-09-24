"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, PlusCircle, User } from "lucide-react";
import { useSite } from "@/components/site/providers/site-provider";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "search", label: "Search", href: "/buy", icon: Search },
  { key: "saved", label: "Saved", href: "/saved", icon: Heart },
  { key: "post", label: "Post", href: "/post-property", icon: PlusCircle },
  { key: "account", label: "Account", href: "/account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { savedIds, mounted } = useSite();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface/95 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const showBadge = item.key === "saved" && mounted && savedIds.length > 0;
          return (
            <Link
              key={item.key}
              href={item.href}
              className="relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium"
            >
              <span className={cn("relative flex h-6 w-6 items-center justify-center", active ? "text-primary-600 dark:text-primary-400" : "text-foreground-muted")}>
                <item.icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
                {showBadge && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-error-600 text-[9px] text-white">
                    {savedIds.length > 9 ? "9+" : savedIds.length}
                  </span>
                )}
              </span>
              <span className={cn(active ? "text-primary-600 dark:text-primary-400" : "text-foreground-muted")}>
                {item.label}
              </span>
              {active && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary-600 dark:bg-primary-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
