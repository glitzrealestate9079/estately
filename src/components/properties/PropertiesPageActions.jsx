"use client";

import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BulkImportModal } from "@/components/properties/BulkImportModal";

export function PropertiesPageActions() {
  const [bulkImportOpen, setBulkImportOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
        <Upload className="h-4 w-4" />
        Bulk Import
      </Button>
      <Button asChild>
        <Link href="/admin/properties/add">
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </Button>

      <BulkImportModal open={bulkImportOpen} onOpenChange={setBulkImportOpen} />
    </>
  );
}
