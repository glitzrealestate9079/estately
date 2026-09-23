"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  FolderPlus,
  LogOut,
  Menu,
  MessagesSquare,
  Plus,
  Search,
  Settings,
  User,
  UserPlus,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "@/components/layout/sidebar-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NOTIFICATIONS, MESSAGES } from "@/data/notifications";
import { CURRENT_USER } from "@/data/current-user";
import { cn, initials } from "@/lib/utils";

const NOTIFICATION_ICONS = {
  property: Building2,
  lead: UserPlus,
  visit: Activity,
  approval: Building2,
  payment: Activity,
};

export function Topbar() {
  const { setMobileOpen } = useSidebar();
  const router = useRouter();
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const unreadMessages = MESSAGES.filter((m) => m.unread).length;

  function handleLogout() {
    toast.success("Signed out successfully");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="rounded-lg p-2 text-foreground-muted hover:bg-surface-muted lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden max-w-md flex-1 sm:block">
        <Input icon={Search} placeholder="Search properties, leads, agents…" aria-label="Search" />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              <Plus className="h-4 w-4" />
              Quick Add
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link href="/properties/add">
                <Building2 className="h-4 w-4" /> Add Property
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/projects?new=1">
                <FolderPlus className="h-4 w-4" /> Add Project
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/leads?new=1">
                <UserPlus className="h-4 w-4" /> Add Lead
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agents?new=1">
                <User className="h-4 w-4" /> Add Agent
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Messages">
              <MessagesSquare className="h-[18px] w-[18px]" />
              {unreadMessages > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-surface" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MESSAGES.map((message) => (
              <DropdownMenuItem key={message.id} className="flex-col items-start gap-0.5 py-2.5">
                <div className="flex w-full items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={message.avatar} alt={message.name} />
                    <AvatarFallback>{initials(message.name)}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-sm font-medium">{message.name}</span>
                  {message.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />}
                </div>
                <p className="truncate pl-9 text-xs text-foreground-muted">{message.message}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/messages" className="justify-center text-primary-600">
                View all messages
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <Badge
                  variant="error"
                  className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 py-0 text-[10px] ring-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.slice(0, 5).map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;
              return (
                <DropdownMenuItem key={notification.id} className="items-start gap-2.5 py-2.5">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      notification.read
                        ? "bg-surface-muted text-foreground-muted"
                        : "bg-primary-50 text-primary-600 dark:bg-primary-500/10"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 space-y-0.5">
                    <span className="block text-sm font-medium leading-snug">{notification.title}</span>
                    <span className="block text-xs text-foreground-muted">{notification.description}</span>
                    <span className="block text-[11px] text-foreground-muted/70">{notification.time}</span>
                  </span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="justify-center text-primary-600">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-surface-muted">
              <Avatar>
                <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                <AvatarFallback>{initials(CURRENT_USER.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight">{CURRENT_USER.name}</span>
                <span className="block text-xs text-foreground-muted">{CURRENT_USER.role}</span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-foreground-muted sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">
                <User className="h-4 w-4" /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" /> Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/activity">
                <Activity className="h-4 w-4" /> Activity
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
