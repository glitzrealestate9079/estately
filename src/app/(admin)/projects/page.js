"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, CheckCircle2, FolderKanban, Home, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectFilters, DEFAULT_PROJECT_FILTERS } from "@/components/projects/project-filters";
import { ProjectFormModal } from "@/components/projects/project-form-modal";
import { PROJECTS as INITIAL_PROJECTS } from "@/data/projects";
import { formatCompactNumber } from "@/lib/utils";

const PAGE_SIZE = 9;

function StatCard({ icon: Icon, label, value, accent }) {
  const accents = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
    success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
    accent: "bg-accent-500/10 text-accent-600 dark:text-accent-400",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
  };
  return (
    <Card className="flex items-center gap-3 p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-foreground-muted">{label}</p>
      </div>
    </Card>
  );
}

function ProjectsPageInner() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [filters, setFilters] = useState(DEFAULT_PROJECT_FILTERS);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(searchParams.get("new") === "1");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    let rows = projects;
    const q = filters.search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.developer.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") rows = rows.filter((p) => p.projectType === filters.type);
    if (filters.status !== "all") rows = rows.filter((p) => p.status === filters.status);
    if (filters.city !== "all") rows = rows.filter((p) => p.city === filters.city);
    return rows;
  }, [projects, filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totals = useMemo(() => {
    const activeStatuses = new Set(["New Launch", "Under Construction", "Ready to Move"]);
    const unitsAvailable = projects.reduce((sum, p) => sum + p.availableUnits, 0);
    const unitsSold = projects.reduce((sum, p) => sum + p.soldUnits, 0);
    return {
      total: projects.length,
      active: projects.filter((p) => activeStatuses.has(p.status)).length,
      unitsAvailable,
      unitsSold,
    };
  }, [projects]);

  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function handleAdd(data) {
    const id = `PRJ-${3000 + projects.length}`;
    setProjects((prev) => [{ ...data, id, slug: id.toLowerCase(), soldUnits: 0, priceRangeMax: data.startingPrice, createdAt: "2026-01-01" }, ...prev]);
    toast.success(`${data.projectName} added successfully`);
  }

  function handleEditSubmit(data) {
    setProjects((prev) => prev.map((p) => (p.id === editTarget.id ? { ...p, ...data } : p)));
    toast.success(`${data.projectName} updated successfully`);
    setEditTarget(null);
  }

  function handleStatusChange(id, status) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast.success("Project status updated");
  }

  function handleDelete() {
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`${deleteTarget.projectName} deleted successfully`);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Track residential, commercial and mixed-use projects across your portfolio."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={FolderKanban} label="Total Projects" value={formatCompactNumber(totals.total)} accent="primary" />
        <StatCard icon={CheckCircle2} label="Active Projects" value={formatCompactNumber(totals.active)} accent="success" />
        <StatCard icon={Home} label="Units Available" value={formatCompactNumber(totals.unitsAvailable)} accent="accent" />
        <StatCard icon={Building2} label="Units Sold" value={formatCompactNumber(totals.unitsSold)} accent="warning" />
      </div>

      <ProjectFilters filters={filters} onChange={updateFilters} resultCount={filtered.length} />

      {pageRows.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderKanban}
            title="No projects found"
            description="Try adjusting your filters or search terms, or add a new project."
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pageRows.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(p) => setEditTarget(p)}
                onDelete={(p) => setDeleteTarget(p)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <Card>
            <Pagination page={page} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          </Card>
        </>
      )}

      <ProjectFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="add"
        onSubmit={handleAdd}
      />

      <ProjectFormModal
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        mode="edit"
        defaultValues={editTarget ?? undefined}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this project?"
        description={`"${deleteTarget?.projectName}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Project"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectsPageInner />
    </Suspense>
  );
}
