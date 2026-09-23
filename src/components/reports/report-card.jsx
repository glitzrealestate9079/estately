"use client";

import { useState } from "react";
import {
  Building2,
  Contact,
  Wallet,
  UserRoundCog,
  ClipboardCheck,
  CalendarClock,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const ICONS = {
  building: Building2,
  contact: Contact,
  wallet: Wallet,
  "user-cog": UserRoundCog,
  "clipboard-check": ClipboardCheck,
  "calendar-clock": CalendarClock,
};

export function ReportCard({ report, onGenerate, onDownload }) {
  const [generating, setGenerating] = useState(false);
  const Icon = ICONS[report.icon] ?? Building2;

  async function handleGenerate() {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    onGenerate(report.id);
    setGenerating(false);
  }

  return (
    <Card hover className="animate-slide-up flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{report.title}</CardTitle>
            <Badge variant="default" className="mt-1.5">
              {report.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription>{report.description}</CardDescription>
        <p className="mt-4 text-xs text-foreground-muted">
          Last generated <span className="font-medium text-foreground">{formatDate(report.lastGenerated)}</span>
          {" · "}
          {report.format}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="flex-1" onClick={() => onDownload(report.id)}>
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Button className="flex-1" loading={generating} onClick={handleGenerate}>
          <RefreshCw className="h-4 w-4" />
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
}
