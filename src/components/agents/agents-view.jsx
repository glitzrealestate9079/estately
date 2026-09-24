"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { AgentsTable } from "@/components/agents/AgentsTable";
import { AgentFormModal } from "@/components/agents/AgentFormModal";
import { AGENTS as INITIAL_AGENTS } from "@/data/agents";
import { AGENT_DEFAULT_VALUES } from "@/schemas/agentSchema";

export function AgentsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingAgent, setEditingAgent] = useState(null);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      openAdd();
      router.replace("/admin/agents");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function openAdd() {
    setFormMode("add");
    setEditingAgent(null);
    setFormOpen(true);
  }

  function openEdit(agent) {
    setFormMode("edit");
    setEditingAgent(agent);
    setFormOpen(true);
  }

  function handleSubmit(data) {
    if (formMode === "edit" && editingAgent) {
      setAgents((prev) => prev.map((a) => (a.id === editingAgent.id ? { ...a, ...data } : a)));
      toast.success(`${data.name}'s profile was updated successfully`);
    } else {
      const nextId = `AGT-${1001 + agents.length + Math.max(0, agents.length - INITIAL_AGENTS.length)}`;
      const newAgent = {
        ...data,
        id: nextId,
        avatar: `https://i.pravatar.cc/150?img=${(agents.length % 70) + 1}`,
        propertiesCount: 0,
        leadsCount: 0,
        conversions: 0,
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      setAgents((prev) => [newAgent, ...prev]);
      toast.success(`${data.name} was added as a new agent`);
    }
  }

  function handleDelete(id) {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }

  function handleToggleStatus(id, status) {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const agent = agents.find((a) => a.id === id);
    toast.success(`${agent?.name ?? "Agent"} marked as ${status}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agents"
        subtitle="Manage your platform's listing agents and their performance."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Agent
          </Button>
        }
      />

      <AgentsTable
        agents={agents}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <AgentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        defaultValues={formMode === "edit" && editingAgent ? editingAgent : AGENT_DEFAULT_VALUES}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
