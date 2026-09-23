"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ReportCard } from "@/components/reports/report-card";
import { REPORTS as INITIAL_REPORTS } from "@/data/reports";

// Fixed "today" so the mock generation timestamp is deterministic across
// server/client renders (see project gotcha on avoiding bare `new Date()`).
const TODAY = "2026-09-23";

export function ReportsGrid() {
  const [reports, setReports] = useState(INITIAL_REPORTS);

  function handleGenerate(id) {
    const report = reports.find((r) => r.id === id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, lastGenerated: TODAY } : r)));
    toast.success(`${report?.title ?? "Report"} generated successfully`);
  }

  function handleDownload(id) {
    const report = reports.find((r) => r.id === id);
    toast.success(`Downloading ${report?.title ?? "report"}.${(report?.format ?? "pdf").toLowerCase()}`);
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} onGenerate={handleGenerate} onDownload={handleDownload} />
      ))}
    </div>
  );
}
