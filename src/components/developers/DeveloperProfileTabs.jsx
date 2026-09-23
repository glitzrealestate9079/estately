"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import {
  Building2,
  CalendarClock,
  Download,
  FileCheck2,
  FileText,
  Globe,
  HardHat,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { formatDate, formatNumber, initials } from "@/lib/utils";

const LEAD_NAMES = ["Anjali Verma", "Manish Gupta", "Ritu Choudhary", "Sameer Khan", "Pooja Agarwal"];
const LEAD_STATUSES = ["New", "Contacted", "Interested", "Negotiation", "Converted"];
const MONTH_LABELS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const DOCUMENTS = [
  { label: "RERA Certificate.pdf", icon: FileCheck2 },
  { label: "Company Profile.pdf", icon: FileText },
  { label: "Trade License.pdf", icon: FileText },
];

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

function seedFromId(id) {
  const digits = id.replace(/\D/g, "");
  return Number(digits) || 1;
}

function buildLeads(seed, developer) {
  const count = 3 + (seed % 3); // 3-5 leads
  return Array.from({ length: count }, (_, i) => {
    const s = seed + i;
    return {
      id: `LD-${developer.id}-${i}`,
      name: LEAD_NAMES[(seed + i) % LEAD_NAMES.length],
      status: LEAD_STATUSES[pseudoRandom(s, LEAD_STATUSES.length)],
      date: `2026-${String(1 + ((seed + i) % 9)).padStart(2, "0")}-${String(1 + ((seed + i * 5) % 27)).padStart(2, "0")}`,
    };
  });
}

function buildInventory(seed, developer) {
  if (developer.projects?.length) {
    return developer.projects.map((project, i) => {
      const s = seed + i * 3;
      let ratio;
      if (project.status === "Ready to Move" || project.status === "Completed") ratio = 10 + pseudoRandom(s, 15);
      else if (project.status === "Under Construction") ratio = 35 + pseudoRandom(s, 25);
      else ratio = 60 + pseudoRandom(s, 30);
      const available = Math.round((project.units * ratio) / 100);
      return {
        name: project.name.length > 18 ? `${project.name.slice(0, 18)}…` : project.name,
        total: project.units,
        available,
      };
    });
  }
  const available = Math.round(developer.totalUnits * (0.2 + (seed % 30) / 100));
  return [{ name: developer.name, total: developer.totalUnits, available }];
}

function buildPerformance(seed, leadsCount) {
  const base = Math.max(1, Math.round(leadsCount / MONTH_LABELS.length));
  return MONTH_LABELS.map((month, i) => ({
    month,
    leads: Math.max(0, base + pseudoRandom(seed + i, 6) - 3),
  }));
}

export function DeveloperProfileTabs({ developer }) {
  const seed = seedFromId(developer.id);
  const leads = buildLeads(seed, developer);
  const inventory = buildInventory(seed, developer);
  const performance = buildPerformance(seed, developer.leadsCount);
  const yearsActive = 2026 - developer.establishedYear;

  function handleDownload(docLabel) {
    toast.success(`Downloading ${docLabel}…`);
  }

  return (
    <Tabs defaultValue="overview">
      <TabsList className="flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="leads">Leads</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="animate-slide-up lg:col-span-1">
            <CardContent className="space-y-4 pt-5">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">{initials(developer.name)}</AvatarFallback>
                </Avatar>
                <p className="mt-3 font-display text-lg font-semibold text-foreground">{developer.name}</p>
                <p className="text-xs text-foreground-muted">Est. {developer.establishedYear}</p>
                <div className="mt-2">
                  <StatusBadge status={developer.status} />
                </div>
              </div>
              <div className="space-y-2.5 border-t border-border-subtle pt-4 text-sm">
                <p className="flex items-center gap-2 text-foreground-muted">
                  <Phone className="h-3.5 w-3.5" /> {developer.phone}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <Mail className="h-3.5 w-3.5" /> {developer.email}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <Globe className="h-3.5 w-3.5" /> {developer.website}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <MapPin className="h-3.5 w-3.5" /> {developer.city}
                </p>
                <p className="flex items-center gap-2 text-foreground-muted">
                  <CalendarClock className="h-3.5 w-3.5" /> Onboarded {formatDate(developer.createdDate)}
                </p>
              </div>
              <div className="border-t border-border-subtle pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">About</p>
                <p className="mt-1.5 text-sm text-foreground-muted">{developer.description}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-2">
            {[
              { icon: Building2, label: "Total Projects", value: formatNumber(developer.projectsCount) },
              { icon: HardHat, label: "Total Units", value: formatNumber(developer.totalUnits) },
              { icon: Users, label: "Total Leads", value: formatNumber(developer.leadsCount) },
              { icon: Target, label: "Years Active", value: `${yearsActive} yrs` },
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

      <TabsContent value="projects">
        <Card>
          {!developer.projects?.length ? (
            <EmptyState
              icon={Building2}
              title="No projects listed"
              description={`${developer.name} does not have any projects on record yet.`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {developer.projects.map((project) => (
                <div
                  key={project.name}
                  className="space-y-3 rounded-xl border border-border-subtle p-4 transition-shadow hover:shadow-card-hover"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-foreground-muted">{project.type}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-foreground-muted">{formatNumber(project.units)} units</span>
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="inventory">
        <Card className="animate-slide-up">
          <CardHeader>
            <div>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>Total vs. available units across {developer.name}&apos;s project portfolio</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventory} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-foreground-muted)", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
                    width={40}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-surface-muted)" }} />
                  <Bar dataKey="total" name="Total Units" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="available" name="Available Units" fill="var(--color-accent-500)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
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
                  <p className="text-xs text-foreground-muted">Interested in {developer.name}&apos;s projects</p>
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

      <TabsContent value="performance">
        <Card className="animate-slide-up">
          <CardHeader>
            <div>
              <CardTitle>Monthly Leads</CardTitle>
              <CardDescription>Leads generated for {developer.name} over the last 8 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performance} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--color-border-subtle)" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 12, right: 12 }}
                    tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    tick={{ fill: "var(--color-foreground-muted)", fontSize: 12 }}
                    width={32}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    name="Leads"
                    stroke="var(--color-primary-500)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents">
        <Card className="divide-y divide-border-subtle">
          {DOCUMENTS.map((doc, i) => (
            <div key={doc.label} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-foreground-muted">
                  <doc.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.label}</p>
                  <p className="text-xs text-foreground-muted">PDF · {(140 + i * 53) % 900} KB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDownload(doc.label)}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          ))}
        </Card>
      </TabsContent>
    </Tabs>
  );
}
