"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { useCompareToggle } from "@/components/site/property/use-compare-toggle";

// Ported from the prototype's data-save-txt/data-compare/data-share buttons.
export function SaveShareActions({ id, title }) {
  const { mounted, savedIds, toggleSave, compareIds } = useSite();
  const handleCompareToggle = useCompareToggle();
  const router = useRouter();
  const isSaved = mounted && savedIds.includes(id);
  const isComparing = mounted && compareIds.includes(id);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* user cancelled share sheet */
    }
  }

  return (
    <div className="row-wrap mt-16 pd-actions-desktop">
      <button
        className="btn btn-outline btn-sm"
        onClick={() => {
          toggleSave(id);
          if (isSaved) {
            toast("Removed from saved", { action: { label: "Undo", onClick: () => toggleSave(id) } });
          } else {
            toast.success("Saved to your shortlist", { action: { label: "View saved", onClick: () => router.push("/saved") } });
          }
        }}
      >
        <i className={`bi bi-heart${isSaved ? "-fill" : ""}`} style={{ color: isSaved ? "#e0245e" : "inherit" }} />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>
      <label className="btn btn-outline btn-sm compare-toggle" style={{ color: "var(--ink)" }}>
        <input type="checkbox" checked={isComparing} onChange={() => handleCompareToggle(id)} />Compare
      </label>
      <button className="btn btn-outline btn-sm" onClick={handleShare}><i className="bi bi-share" />Share</button>
    </div>
  );
}
