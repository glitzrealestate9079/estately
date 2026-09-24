"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Building2,
  ChevronRight,
  Heart,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useSite } from "@/components/site/providers/site-provider";
import { initials } from "@/lib/utils";

const NOTIFICATION_PREFS = [
  { key: "propertyAlerts", label: "New matching properties" },
  { key: "priceChanges", label: "Price changes on saved properties" },
  { key: "visitUpdates", label: "Visit confirmations & reminders" },
  { key: "marketing", label: "Offers & marketing updates" },
];

export default function AccountPage() {
  const { auth, mounted, savedIds, savedSearches, logout, openAuthGate } = useSite();
  const [prefs, setPrefs] = useState({ propertyAlerts: true, priceChanges: true, visitUpdates: true, marketing: false });

  if (!mounted) return null;

  if (!auth.isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <EmptyState
          icon={User}
          title="Sign in to your account"
          description="Access your saved properties, saved searches and preferences from anywhere."
          action={
            <Button className="mt-2" onClick={() => openAuthGate(null)}>
              Sign In
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-base">{initials(auth.user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-display text-lg font-bold text-foreground">{auth.user.name}</p>
          <p className="text-sm text-foreground-muted">{auth.user.mobile}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <AccountLink href="/saved" icon={Heart} label="Saved Properties" count={savedIds.length} />
        <AccountLink href="/saved-searches" icon={Search} label="Saved Searches" count={savedSearches.length} />
        <AccountLink href="/dashboard" icon={Building2} label="My Listings Dashboard" />
      </div>

      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Bell className="h-4 w-4" /> Notification Preferences
        </h2>
        <div className="space-y-3.5">
          {NOTIFICATION_PREFS.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{pref.label}</span>
              <Switch
                checked={prefs[pref.key]}
                onCheckedChange={(value) => {
                  setPrefs((p) => ({ ...p, [pref.key]: value }));
                  toast.success("Preference updated");
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Settings className="h-4 w-4" /> Account
        </h2>
        <Button variant="outline" className="w-full gap-1.5" onClick={logout}>
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}

function AccountLink({ href, icon: Icon, label, count }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface px-4 py-3.5 shadow-card transition-colors hover:bg-surface-muted">
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-500/15 dark:text-primary-400">{count}</span>
        )}
      </span>
      <ChevronRight className="h-4 w-4 text-foreground-muted" />
    </Link>
  );
}
