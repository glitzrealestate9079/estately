"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";

// Ported from app.js's delegated `[data-compare]` change handler + Intents.compare()
// — checking a compare box either adds it (toast with a "Compare now" action) or,
// at the 4-item cap, shows the limit error; unchecking just confirms the removal.
export function useCompareToggle() {
  const { compareIds, toggleCompare, maxCompare } = useSite();
  const router = useRouter();

  return function handleCompareToggle(id) {
    const { didAdd, atLimit } = toggleCompare(id);
    if (atLimit) {
      toast.error(`You can compare up to ${maxCompare} properties`, {
        action: { label: "Open compare", onClick: () => router.push("/compare") },
      });
    } else if (didAdd) {
      toast(`Added to compare (${compareIds.length + 1}/${maxCompare})`, {
        action: { label: "Compare now", onClick: () => router.push("/compare") },
      });
    } else {
      toast("Removed from compare");
    }
  };
}
