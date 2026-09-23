"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronDown, ChevronsLeft, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { NAVIGATION } from "@/config/navigation";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function isActiveHref(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo({ collapsed }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-navy-900 text-white shadow-sm">
        <Building2 className="h-5 w-5" />
      </span>
      {!collapsed && (
        <span className="font-display text-lg font-bold tracking-tight text-white">
          Estately
        </span>
      )}
    </Link>
  );
}

function NavAccordionItem({ item, pathname, onNavigate }) {
  const activeChild = item.children.find((child) => isActiveHref(pathname, child.href));
  const parentActive = !activeChild && isActiveHref(pathname, item.href);
  const [manuallyOpen, setManuallyOpen] = useState(null);
  const open = manuallyOpen ?? Boolean(activeChild) ?? false;

  return (
    <li>
      <div
        className={cn(
          "group relative flex items-center gap-1 rounded-lg pr-1.5 text-sm font-medium text-navy-300 transition-colors hover:bg-white/5 hover:text-white",
          parentActive && "bg-white/10 text-white"
        )}
      >
        {parentActive && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary-400" />
        )}
        <Link href={item.href} onClick={onNavigate} className="flex flex-1 items-center gap-3 px-3 py-2.5">
          <item.icon className="h-[18px] w-[18px] shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
        </Link>
        <button
          type="button"
          onClick={() => setManuallyOpen(!open)}
          className="shrink-0 rounded-md p-1.5 text-navy-400 hover:bg-white/10 hover:text-white"
          aria-label={open ? `Collapse ${item.label}` : `Expand ${item.label}`}
          aria-expanded={open}
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <ul className="mt-0.5 space-y-0.5 border-l border-white/10 pl-4">
          {item.children.map((child) => {
            const childActive = isActiveHref(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-navy-300 transition-colors hover:bg-white/5 hover:text-white",
                    childActive && "bg-white/10 text-white"
                  )}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  <span className="flex-1 truncate">{child.label}</span>
                  {child.badge && (
                    <span className="rounded-full bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-300">
                      {child.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function NavContent({ collapsed, pathname, onNavigate }) {
  return (
    <TooltipProvider delayDuration={200}>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAVIGATION.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                {group.section}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                if (!collapsed && item.children) {
                  return (
                    <NavAccordionItem key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
                  );
                }

                const active = isActiveHref(pathname, item.href);
                const link = (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 transition-colors hover:bg-white/5 hover:text-white",
                      active && "bg-white/10 text-white",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary-400" />
                    )}
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="rounded-full bg-primary-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );

                if (!collapsed) return <li key={item.href}>{link}</li>;

                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col bg-navy-950 transition-[width] duration-200 ease-in-out lg:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Logo collapsed={collapsed} />
        </div>
        <NavContent collapsed={collapsed} pathname={pathname} />
        <div className="border-t border-white/10 p-3">
          <button
            onClick={toggleCollapsed}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-navy-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span className="text-xs font-medium">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-[2px] data-[state=open]:animate-fade-in lg:hidden" />
          <DialogPrimitive.Content
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy-950 shadow-2xl outline-none lg:hidden",
              "data-[state=open]:animate-slide-in-left"
            )}
          >
            <DialogPrimitive.Title className="sr-only">Navigation menu</DialogPrimitive.Title>
            <div className="flex h-16 shrink-0 items-center justify-between px-4">
              <Logo collapsed={false} />
              <DialogPrimitive.Close className="rounded-lg p-1.5 text-navy-300 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>
            <NavContent collapsed={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
