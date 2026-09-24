"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Bookmark,
  Briefcase,
  Building2,
  FolderKanban,
  Heart,
  Key,
  Landmark,
  Layers,
  LogOut,
  Menu,
  Scale,
  Settings,
  Trees,
  User,
  Users,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSite } from "@/components/site/providers/site-provider";
import { cn, initials } from "@/lib/utils";

// Flat primary navigation per the product spec (Section 4): Buy, Rent,
// PG/Co-living, New Projects, Commercial, Plots/Land, Services — no more
// than a handful of always-visible top-level items, no nested mega-menu.
// The spec explicitly calls out not stuffing 15-20 items into the header;
// a flat list this short doesn't need progressive disclosure at all.
const NAV_LINKS = [
  { key: "buy", label: "Buy", href: "/buy", icon: Building2 },
  { key: "rent", label: "Rent", href: "/rent", icon: Key },
  { key: "pg", label: "PG / Co-living", href: "/pg", icon: Users },
  { key: "projects", label: "New Projects", href: "/projects", icon: FolderKanban },
  { key: "commercial", label: "Commercial", href: "/commercial", icon: Briefcase },
  { key: "plots", label: "Plots / Land", href: "/plots", icon: Trees },
  { key: "services", label: "Services", href: "/services", icon: Landmark },
];

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ link, pathname }) {
  const active = isActive(pathname, link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        "whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
          : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
      )}
    >
      {link.label}
    </Link>
  );
}

function NavBar({ links, pathname }) {
  return (
    <nav className="hidden min-w-0 items-center gap-1 xl:mr-8 xl:flex xl:gap-2">
      {links.map((link) => (
        <NavLink key={link.key} link={link} pathname={pathname} />
      ))}
    </nav>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { savedIds, compareIds, auth, logout, openAuthGate, mounted } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation — adjusted during render (per React's
  // "you might not need an effect" guidance) rather than via a useEffect,
  // since it's purely derived from the pathname prop changing.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border-subtle bg-surface/85 backdrop-blur-lg shadow-card"
          : "border-transparent bg-surface/60 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-4 flex shrink-0 items-center gap-2 lg:mr-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-navy-900 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">Estately</span>
        </Link>

        <NavBar links={NAV_LINKS} pathname={pathname} />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/saved"
            className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground sm:flex"
            aria-label="Saved properties"
          >
            <Heart className="h-[18px] w-[18px]" />
            {mounted && savedIds.length > 0 && (
              <Badge variant="error" className="absolute -right-1 -top-1 h-4 min-w-4 justify-center rounded-full px-1 py-0 text-[10px] ring-0">
                {savedIds.length}
              </Badge>
            )}
          </Link>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex">
            <Link href="/post-property">Post Property — FREE</Link>
          </Button>

          {mounted && auth.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-surface-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials(auth.user?.name || "Guest")}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{auth.user?.name}</DropdownMenuLabel>
                <p className="px-2 pb-2 text-xs text-foreground-muted">{auth.user?.mobile}</p>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Layers className="h-4 w-4" /> My Listings Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="h-4 w-4" /> My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account?tab=preferences">
                    <Settings className="h-4 w-4" /> Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/saved-searches">
                    <Bookmark className="h-4 w-4" /> My Searches
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/compare">
                    <Scale className="h-4 w-4" /> Compare Properties
                    {mounted && compareIds.length > 0 && (
                      <Badge variant="primary" className="ml-auto h-4 min-w-4 justify-center rounded-full px-1 py-0 text-[10px] ring-0">
                        {compareIds.length}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onClick={logout}>
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => openAuthGate(null)}>
              Login
            </Button>
          )}

          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface-muted xl:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onOpenChange={setMobileOpen} pathname={pathname} />
    </header>
  );
}

function MobileMenu({ open, onOpenChange, pathname }) {
  const { auth, logout, openAuthGate } = useSite();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-[2px] data-[state=open]:animate-fade-in xl:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-surface shadow-popover data-[state=open]:animate-slide-in-right xl:hidden">
          <DialogPrimitive.Title className="sr-only">Navigation menu</DialogPrimitive.Title>
          <div className="flex items-center justify-between border-b border-border-subtle p-4">
            <span className="font-display text-base font-semibold text-foreground">Menu</span>
            <DialogPrimitive.Close className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-muted">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 space-y-5 p-4">
            <div>
              <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                Browse
              </p>
              <div className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(pathname, link.href)
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                        : "text-foreground hover:bg-surface-muted"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                Your activity
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/saved"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(pathname, "/saved")
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                      : "text-foreground hover:bg-surface-muted"
                  )}
                >
                  <Heart className="h-4 w-4" />
                  Saved Properties
                </Link>
                <Link
                  href="/saved-searches"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(pathname, "/saved-searches")
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                      : "text-foreground hover:bg-surface-muted"
                  )}
                >
                  <Bookmark className="h-4 w-4" />
                  My Searches
                </Link>
                <Link
                  href="/compare"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(pathname, "/compare")
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                      : "text-foreground hover:bg-surface-muted"
                  )}
                >
                  <Scale className="h-4 w-4" />
                  Compare Properties
                </Link>
              </div>
            </div>
          </nav>

          <div className="space-y-3 border-t border-border-subtle p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">Theme</span>
              <ThemeToggle />
            </div>
            {auth.isAuthenticated ? (
              <>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/dashboard">My Dashboard</Link>
                </Button>
                <Button className="w-full" variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => openAuthGate(null)}>
                Login / Sign up
              </Button>
            )}
            <Button asChild className="w-full" variant="secondary">
              <Link href="/post-property">Post Property — FREE</Link>
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
