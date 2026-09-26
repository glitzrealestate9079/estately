"use client";

import { useSite } from "@/components/site/providers/site-provider";

export function SaveProjectButton({ id }) {
  const { mounted, savedIds, toggleSave } = useSite();
  const isSaved = mounted && savedIds.includes(id);
  return (
    <button
      type="button"
      className="btn btn-outline btn-lg btn-save-icon"
      aria-label={isSaved ? "Remove from saved" : "Save project"}
      title={isSaved ? "Saved" : "Save"}
      onClick={() => toggleSave(id)}
    >
      <i className={`bi bi-heart${isSaved ? "-fill" : ""}`} style={{ color: isSaved ? "#e0245e" : "inherit" }} />
    </button>
  );
}
