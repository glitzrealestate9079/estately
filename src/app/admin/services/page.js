"use client";

import { useState } from "react";
import { Plus, Wrench } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFormModal } from "@/components/services/ServiceFormModal";
import { SERVICES as INITIAL_SERVICES } from "@/data/services";

export default function ServicesPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  function handleAdd(data) {
    const id = `SVC-${1000 + services.length + 1}`;
    setServices((prev) => [{ ...data, id, icon: "Wrench", subscribersCount: 0 }, ...prev]);
    toast.success(`"${data.name}" was added to the catalog`);
  }

  function handleEditSubmit(data) {
    setServices((prev) => prev.map((s) => (s.id === editTarget.id ? { ...s, ...data } : s)));
    toast.success(`"${data.name}" was updated`);
    setEditTarget(null);
  }

  function handleToggleStatus(service) {
    const next = service.status === "Active" ? "Inactive" : "Active";
    setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, status: next } : s)));
    toast.success(`"${service.name}" marked as ${next}`);
  }

  function handleDelete(service) {
    setServices((prev) => prev.filter((s) => s.id !== service.id));
    toast.success(`"${service.name}" was removed from the catalog`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        subtitle="Manage premium add-on services for agents and developers."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        }
      />

      {services.length === 0 ? (
        <Card>
          <EmptyState
            icon={Wrench}
            title="No services yet"
            description="Add your first premium add-on service to start offering it to agents and developers."
            action={
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Service
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={(s) => setEditTarget(s)}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ServiceFormModal open={addOpen} onOpenChange={setAddOpen} mode="add" onSubmit={handleAdd} />

      <ServiceFormModal
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        mode="edit"
        defaultValues={editTarget ?? undefined}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}
