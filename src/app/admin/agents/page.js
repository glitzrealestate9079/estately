import { Suspense } from "react";
import { AgentsView } from "@/components/agents/agents-view";

export const metadata = { title: "Agents" };

export default function AgentsPage() {
  return (
    <Suspense fallback={null}>
      <AgentsView />
    </Suspense>
  );
}
