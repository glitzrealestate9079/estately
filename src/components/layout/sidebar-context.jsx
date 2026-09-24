"use client";

import { createContext, useContext, useReducer, useState, useSyncExternalStore } from "react";

const SidebarContext = createContext(null);

function noopSubscribe() {
  return () => {};
}
function useHasMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function readCollapsed() {
  try {
    return localStorage.getItem("estately-sidebar-collapsed") === "true";
  } catch {
    return false;
  }
}

export function SidebarProvider({ children }) {
  const mounted = useHasMounted();
  const [, bump] = useReducer((c) => c + 1, 0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const collapsed = mounted && readCollapsed();

  function toggleCollapsed() {
    const next = !collapsed;
    try {
      localStorage.setItem("estately-sidebar-collapsed", String(next));
    } catch {
      /* ignore */
    }
    bump();
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
