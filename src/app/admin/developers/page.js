"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { DevelopersTable } from "@/components/developers/DevelopersTable";

export default function DevelopersPage() {
  const tableRef = useRef(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Developers"
        subtitle="Manage real estate developers and their project portfolios."
        actions={
          <Button onClick={() => tableRef.current?.openAdd()}>
            <Plus className="h-4 w-4" />
            Add Developer
          </Button>
        }
      />
      <DevelopersTable ref={tableRef} />
    </div>
  );
}
