import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { AgentProfileTabs } from "@/components/agents/agent-profile-tabs";
import { AGENTS, getAgentById } from "@/data/agents";

export function generateStaticParams() {
  return AGENTS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const agent = getAgentById(id);
  return { title: agent ? agent.name : "Agent" };
}

export default async function AgentDetailPage({ params }) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={agent.name}
        subtitle={`${agent.id} · ${agent.agency} · ${agent.city}`}
        actions={
          <>
            <StatusBadge status={agent.status} />
            <Button variant="outline" asChild>
              <Link href="/agents">
                <ArrowLeft className="h-4 w-4" />
                Back to Agents
              </Link>
            </Button>
          </>
        }
      />
      <AgentProfileTabs agent={agent} />
    </div>
  );
}
