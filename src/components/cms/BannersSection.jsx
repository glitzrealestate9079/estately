"use client";

import { useMemo, useState } from "react";
import { LayoutTemplate, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { BannerCard } from "@/components/cms/BannerCard";
import { BannerFormModal } from "@/components/cms/BannerFormModal";
import { BANNERS as INITIAL_BANNERS } from "@/data/banners";
import { BANNER_DEFAULT_VALUES } from "@/schemas/bannerSchema";

export function BannersSection() {
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sorted = useMemo(() => [...banners].sort((a, b) => a.sortOrder - b.sortOrder), [banners]);

  function openAdd() {
    setFormMode("add");
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(banner) {
    setFormMode("edit");
    setEditTarget(banner);
    setFormOpen(true);
  }

  function handleSubmit(data) {
    if (formMode === "edit" && editTarget) {
      setBanners((prev) => prev.map((b) => (b.id === editTarget.id ? { ...b, ...data } : b)));
      toast.success(`"${data.title}" was updated`);
    } else {
      const nextSortOrder = banners.length ? Math.max(...banners.map((b) => b.sortOrder)) + 1 : 1;
      const maxIdNumber = banners.reduce((max, b) => Math.max(max, Number(b.id.split("-")[1]) || 0), 1000);
      const newBanner = {
        id: `BNR-${maxIdNumber + 1}`,
        ...data,
        sortOrder: nextSortOrder,
      };
      setBanners((prev) => [...prev, newBanner]);
      toast.success(`"${data.title}" was added to the carousel`);
    }
  }

  function toggleStatus(banner) {
    const next = banner.status === "Active" ? "Inactive" : "Active";
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, status: next } : b)));
    toast.success(`"${banner.title}" marked ${next}`);
  }

  function swapSortOrder(banner, direction) {
    setBanners((prev) => {
      const ordered = [...prev].sort((a, b) => a.sortOrder - b.sortOrder);
      const index = ordered.findIndex((b) => b.id === banner.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= ordered.length) return prev;

      const neighbor = ordered[targetIndex];
      return prev.map((b) => {
        if (b.id === banner.id) return { ...b, sortOrder: neighbor.sortOrder };
        if (b.id === neighbor.id) return { ...b, sortOrder: banner.sortOrder };
        return b;
      });
    });
    toast.success(`"${banner.title}" moved ${direction}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setBanners((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.title}" was removed`);
    setDeleteTarget(null);
  }

  const modalDefaultValues =
    formMode === "edit" && editTarget
      ? {
          title: editTarget.title,
          subtitle: editTarget.subtitle,
          image: editTarget.image,
          ctaLabel: editTarget.ctaLabel,
          ctaUrl: editTarget.ctaUrl,
          status: editTarget.status,
          sortOrder: editTarget.sortOrder,
        }
      : {
          ...BANNER_DEFAULT_VALUES,
          sortOrder: banners.length ? Math.max(...banners.map((b) => b.sortOrder)) + 1 : 1,
        };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground-muted">{sorted.length} banners in the homepage carousel</p>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="No banners yet"
          description="Add a hero banner to start populating the homepage carousel."
          action={
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {sorted.map((banner, index) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              isFirst={index === 0}
              isLast={index === sorted.length - 1}
              onToggleStatus={toggleStatus}
              onMoveUp={(b) => swapSortOrder(b, "up")}
              onMoveDown={(b) => swapSortOrder(b, "down")}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <BannerFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={modalDefaultValues}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this banner?"
        description={`"${deleteTarget?.title}" will be permanently removed from the homepage carousel.`}
        confirmLabel="Delete Banner"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
