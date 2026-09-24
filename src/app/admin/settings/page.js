"use client";

import { useState } from "react";
import {
  Bell,
  Building2,
  CreditCard,
  Globe,
  Mail,
  MessageSquare,
  Search,
  Settings as SettingsIcon,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { cn } from "@/lib/utils";
import { GeneralSettingsForm } from "@/components/settings/GeneralSettingsForm";
import { PlatformSettingsForm } from "@/components/settings/PlatformSettingsForm";
import { PropertySettingsForm } from "@/components/settings/PropertySettingsForm";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";
import { EmailSettingsForm } from "@/components/settings/EmailSettingsForm";
import { SmsSettingsForm } from "@/components/settings/SmsSettingsForm";
import { SecuritySettingsForm } from "@/components/settings/SecuritySettingsForm";
import { SeoSettingsForm } from "@/components/settings/SeoSettingsForm";
import { PaymentSettingsForm } from "@/components/settings/PaymentSettingsForm";
import { SocialMediaSettingsForm } from "@/components/settings/SocialMediaSettingsForm";

const SECTIONS = [
  {
    id: "general",
    label: "General",
    icon: SettingsIcon,
    description: "Platform name, support contact and timezone.",
    Component: GeneralSettingsForm,
  },
  {
    id: "platform",
    label: "Platform",
    icon: Globe,
    description: "Site URL, default currency, language and maintenance mode.",
    Component: PlatformSettingsForm,
  },
  {
    id: "property",
    label: "Property",
    icon: Building2,
    description: "Listing limits, expiry and featured listing pricing.",
    Component: PropertySettingsForm,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Choose which alerts you and your team receive.",
    Component: NotificationSettingsForm,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    description: "SMTP server used to send transactional email.",
    Component: EmailSettingsForm,
  },
  {
    id: "sms",
    label: "SMS",
    icon: MessageSquare,
    description: "SMS provider used for OTPs and alerts.",
    Component: SmsSettingsForm,
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldCheck,
    description: "Update the password used to sign in to this account.",
    Component: SecuritySettingsForm,
  },
  {
    id: "seo",
    label: "SEO",
    icon: Search,
    description: "Meta title, description and keywords for search engines.",
    Component: SeoSettingsForm,
  },
  {
    id: "payment",
    label: "Payment",
    icon: CreditCard,
    description: "Payment gateway, merchant ID and currency.",
    Component: PaymentSettingsForm,
  },
  {
    id: "social",
    label: "Social Media",
    icon: Share2,
    description: "Links to your platform's social media profiles.",
    Component: SocialMediaSettingsForm,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(SECTIONS[0].id);
  const activeSection = SECTIONS.find((section) => section.id === activeTab) ?? SECTIONS[0];
  const ActiveForm = activeSection.Component;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configure your platform preferences." />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit animate-slide-up lg:sticky lg:top-20">
          <CardContent className="space-y-1 p-2">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const active = section.id === activeTab;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveTab(section.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                      : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {section.label}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="animate-fade-in">
          <CardHeader>
            <div>
              <CardTitle>{activeSection.label}</CardTitle>
              <CardDescription>{activeSection.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ActiveForm key={activeSection.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
