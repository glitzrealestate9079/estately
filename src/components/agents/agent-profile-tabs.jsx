"use client";

import Link from "next/link";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import {
  Building2,
  CalendarClock,
  Download,
  FileCheck2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Target,
  TrendingUp,
  UserRoundCog,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PropertyImage } from "@/components/common/property-image";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { PROPERTIES } from "@/data/properties";
import { LEAD_SOURCES } from "@/lib/constants";
import { formatCurrency, formatDate, formatNumber, initials } from "@/lib/utils";

const LEAD_NAMES = [
  "Anjali Verma",
  "Manish Gupta",
  "Ritu Choudhary",
  "Sameer Khan",
  "Pooja Agarwal",
  "Deepak Mehta",
  "Kritika Joshi",
  "Nikhil Bhatt",
];
const LEAD_STATUSES = ["New", "Contacted", "Interested", "Negotiation", "Converted", "Lost"];
const VISIT_STATUSES = ["Confirmed", "Completed", "Rescheduled", "Cancelled"];
const MONTH_LABELS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const DOCUMENT_TYPES = [
  { label: "RERA License Certificate", icon: FileCheck2 },
  { label: "Government ID Proof", icon: FileText },
  { label: "PAN Card", icon: FileText },
  { label: "Agency Agreement", icon: FileText },
  { label: "Address Proof", icon: FileText },
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

function seedFromId(id) {
  const digits = id.replace(/\D/g, "");
  return Number(digits) || 1;
}

function buildLeads(seed) {
  return Array.from({ length: 6 }, (_, i) => {
    const s = seed + i;
    return {
      id: `LD-${seed}${i}`,
      name: LEAD_NAMES[(seed + i) % LEAD_NAMES.length],
      interest: PROPERTIES[(seed + i * 3) % PROPERTIES.length].type,
      status: LEAD_STATUSES[pseudoRandom(s, LEAD_STATUSES.length)],
      source: LEAD_SOURCES[pseudoRandom(s + 4, LEAD_SOURCES.length)],
      date: `2026-${String(1 + ((seed + i) % 9)).padStart(2, "0")}-${String(1 + ((seed + i * 5) % 27)).padStart(2, "0")}`,
    };
  });
}

function buildVisits(seed) {
  return Array.from({ length: 5 }, (_, i) => {
    const s = seed + i + 20;
    const property = PROPERTIES[(seed + i * 7) % PROPERTIES.length];
    return {
      id: `SV-${seed}${i}`,
      property: property.title,
      client: LEAD_NAMES[(seed + i + 3) % LEAD_NAMES.length],
      status: VISIT_STATUSES[pseudoRandom(s, VISIT_STATUSES.length)],
      date: `2026-${String(1 + ((seed + i + 2) % 9)).padStart(2, "0")}-${String(1 + ((seed + i * 3) % 27)).padStart(2, "0")}`,
      time: `${10 + ((seed + i) % 7)}:${(seed + i) % 2 === 0 ? "00" : "30"}`,
    };
  });
}

function buildPerformance(seed, conversions) {
  const base = Math.max(1, Math.round(conversions / MONTH_LABELS.length));
  return MONTH_LABELS.map((month, i) => ({
    month,
    conversions: Math.max(0, base + pseudoRandom(seed + i, 5) - 2),
  }));
}

export function AgentProfileTabs({ agent }) {
  const seed = seedFromId(agent.id);
  const agentProperties = PROPERTIES.filter((p) => p.agent.name === agent.name);
  const leads = buildLeads(seed);
  const visits = buildVisits(seed);
  const performance = buildPerformance(seed, agent.conversions);
  const conversionRate = agent.leadsCount > 0 ? Math.round((agent.conversions / agent.leadsCount) * 100) : 0;

  function handleDownload(docLabel) {
    toast.success(`Downloading ${docLabel}…`);
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList className="flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="leads">Leads</TabsTrigger>
        <TabsTrigger value="visits">Site Visits</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="animate-slide-up lg:col-span-1">
            <CardContent className="space-y-4 pt-5">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback className="text-lg">{initials(agent.name)}</AvatarFallback>
                </Avatar>
                <p className="mt-3 font-display text-lg font-semibold text-foreground">{agent.name}</p>
                <p className="text-xs text-foreground-muted">{agent.agency}</p>
                <div className="mt-2">
                  <StatusBadge status={agent.status} />
                </div>
              </div>
              <div className="space-y-2.5 border-t border-border-subtle pt-4 text-sm">
                <p className="flex items-center gap-2 text-foreground-muted">
                  <Phone className="h-3.5 w-3.5" /> {agent.phone}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <Mail className="h-3.5 w-3.5" /> {agent.email}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <MapPin className="h-3.5 w-3.5" /> {agent.city}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <UserRoundCog className="h-3.5 w-3.5" /> {agent.licenseNumber}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <CalendarClock className="h-3.5 w-3.5" /> Joined {formatDate(agent.joinedDate)}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2">
            {[
              { icon: Building2, label: "Properties Listed", value: formatNumber(agent.propertiesCount) },
              { icon: Users, label: "Total Leads", value: formatNumber(agent.leadsCount) },
              { icon: Target, label: "Conversions", value: formatNumber(agent.conversions) },
              { icon: TrendingUp, label: "Conversion Rate", value: `${conversionRate}%` },
            ].map((stat) => (
              <Card key={stat.label} hover className="animate-slide-up">
                <CardContent className="flex items-center gap-3 pt-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground-muted">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="properties">
        <Card>
          {agentProperties.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No properties assigned"
              description={`${agent.name} does not have any properties listed yet.`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {agentProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group overflow-hidden rounded-xl border border-border-subtle transition-shadow hover:shadow-card-hover"
                >
                  <div className="relative aspect-[16/10]">
                    <PropertyImage src={property.images[0]} alt={property.title} />
                  </div>
                  <div className="space-y-1.5 p-3">
                    <p className="truncate text-sm font-medium text-foreground">{property.title}</p>
                    <p className="flex items-center gap-1 text-xs text-foreground-muted">
                      <MapPin className="h-3 w-3" /> {property.location.locality}, {property.location.city}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-display text-sm font-semibold text-primary-700 dark:text-primary-400">
                        {formatCurrency(property.price)}
                      </span>
                      <StatusBadge status={property.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="leads">
        <Card className="divide-y divide-border-subtle">
          {leads.map((lead) => (
            <div key={lead.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(lead.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-foreground-muted">
                    Interested in {lead.interest} · via {lead.source}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-foreground-muted">{formatDate(lead.date)}</span>
                <StatusBadge status={lead.status} />
              </div>
            </div>
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="visits">
        <Card className="divide-y divide-border-subtle">
          {visits.map((visit) => (
            <div key={visit.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{visit.property}</p>
                  <p className="text-xs text-foreground-muted">
                    With {visit.client} · {formatDate(visit.date)} at {visit.time}
                  </p>
                </div>
              </div>
              <StatusBadge status={visit.status} />
            </div>
          ))}
        </Card>
      </TabsContent>

      <TabsContent value="performance">
        <Card className="animate-slide-up">
          <CardHeader>
            <div>
              <CardTitle>Monthly Conversions</CardTitle>
              <CardDescription>Deals closed by {agent.name} over the last 8 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
                    width={32}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-surface-muted)" }} />
                  <Bar dataKey="conversions" name="Conversions" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents">
        <Card className="divide-y divide-border-subtle">
          {DOCUMENT_TYPES.map((doc, i) => (
            <div key={doc.label} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-foreground-muted">
                  <doc.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.label}</p>
                  <p className="text-xs text-foreground-muted">PDF · {(120 + i * 37) % 900} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={i % 3 === 0 ? "warning" : "success"}>{i % 3 === 0 ? "Pending" : "Verified"}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleDownload(doc.label)}>
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
