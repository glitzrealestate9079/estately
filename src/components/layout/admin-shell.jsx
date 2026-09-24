"use client";

import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ThemeCustomizer } from "@/components/layout/theme-customizer";
import { cn } from "@/lib/utils";

function ShellInner({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-200 ease-in-out",
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 2xl:mx-auto 2xl:w-full 2xl:max-w-[1600px]">{children}</main>
      </div>
      <ThemeCustomizer />
    </div>
  );
}

export function AdminShell({ children }) {
  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  );
}
