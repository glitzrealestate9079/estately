"use client";

import { CheckCircle2, Download, UploadCloud, XCircle } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { parseCsv, validatePropertyRow } from "@/lib/csv-import";

const TEMPLATE_HEADERS = [
  "title",
  "propertyType",
  "listingType",
  "city",
  "locality",
  "price",
  "carpetArea",
  "ownerName",
  "ownerPhone",
];

const TEMPLATE_SAMPLE_ROWS = [
  [
    "Sunrise 3BHK Apartment",
    "Apartment",
    "Sale",
    "Jaipur",
    "Vaishali Nagar",
    "8500000",
    "1450",
    "Rohit Sharma",
    "9829012345",
  ],
  [
    "Green Valley Villa",
    "Villa",
    "Rent",
    "Jaipur",
    "Malviya Nagar",
    "45000",
    "2800",
    "Anita Verma",
    "9829098765",
  ],
];

// Builds the sample CSV client-side and triggers a browser download — no server round trip.
function downloadSampleTemplate() {
  const csvLines = [TEMPLATE_HEADERS.join(","), ...TEMPLATE_SAMPLE_ROWS.map((row) => row.join(","))];
  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "property-import-template.csv";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function BulkImportModal({ open, onOpenChange }) {
  const fileInputId = useId();
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);

  const validCount = rows.filter((row) => row.valid).length;
  const invalidCount = rows.length - validCount;

  function resetState() {
    setStep(1);
    setFileName("");
    setRows([]);
  }

  function handleOpenChange(nextOpen) {
    if (!nextOpen) resetState();
    onOpenChange(nextOpen);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    // Allow re-selecting the same file to re-run the import.
    event.target.value = "";
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const text = loadEvent.target?.result ?? "";
      const { headers, rows: parsedRows } = parseCsv(String(text));

      const results = parsedRows.map((row, index) => {
        const { valid, errors, record } = validatePropertyRow(row, headers);
        return {
          id: index,
          title: record.title || `Row ${index + 2}`,
          valid,
          errors,
        };
      });

      setRows(results);
      setStep(2);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    toast.success(
      `Imported ${validCount} propert${validCount === 1 ? "y" : "ies"}${
        invalidCount > 0 ? `, skipped ${invalidCount} invalid row${invalidCount === 1 ? "" : "s"}` : ""
      }.`
    );
    handleOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Bulk Import Properties</ModalTitle>
          <ModalDescription>
            {step === 1
              ? "Upload a CSV file to add multiple properties at once."
              : `Reviewing ${fileName || "your file"} — check the results below before importing.`}
          </ModalDescription>
        </ModalHeader>

        {step === 1 ? (
          <>
            <ModalBody className="space-y-5">
              <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-border-subtle bg-surface-muted px-4 py-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">Need the right format?</p>
                  <p className="text-xs text-foreground-muted">Download a sample CSV with the required columns.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={downloadSampleTemplate}>
                  <Download className="h-4 w-4" />
                  Download Sample Template
                </Button>
              </div>

              <label
                htmlFor={fileInputId}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-subtle px-6 py-10 text-center transition-colors hover:border-navy-300"
              >
                <UploadCloud className="h-6 w-6 text-foreground-muted" />
                <p className="text-sm font-medium text-foreground">Click to upload a CSV file</p>
                <p className="text-xs text-foreground-muted">Only .csv files are supported</p>
                <input
                  id={fileInputId}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </>
        ) : (
          <>
            <ModalBody className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border-subtle p-3 text-center">
                  <p className="text-2xl font-semibold text-foreground">{rows.length}</p>
                  <p className="text-xs text-foreground-muted">Total Rows</p>
                </div>
                <div className="rounded-lg border border-success-200 bg-success-50 p-3 text-center dark:border-success-500/20 dark:bg-success-500/10">
                  <p className="text-2xl font-semibold text-success-700 dark:text-success-500">{validCount}</p>
                  <p className="text-xs text-success-700 dark:text-success-500">Valid</p>
                </div>
                <div className="rounded-lg border border-error-200 bg-error-50 p-3 text-center dark:border-error-500/20 dark:bg-error-500/10">
                  <p className="text-2xl font-semibold text-error-700 dark:text-error-500">{invalidCount}</p>
                  <p className="text-xs text-error-700 dark:text-error-500">Invalid</p>
                </div>
              </div>

              <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-border-subtle p-2">
                {rows.length === 0 ? (
                  <p className="p-4 text-center text-sm text-foreground-muted">No rows found in this file.</p>
                ) : (
                  rows.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-start justify-between gap-3 rounded-lg p-2 hover:bg-surface-muted"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{row.title}</p>
                        {!row.valid && (
                          <ul className="mt-1 space-y-0.5">
                            {row.errors.map((error) => (
                              <li key={error} className="text-xs text-error-600 dark:text-error-500">
                                {error}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {row.valid ? (
                        <Badge variant="success" className="shrink-0">
                          <CheckCircle2 className="h-3 w-3" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="error" className="shrink-0">
                          <XCircle className="h-3 w-3" />
                          Error
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={handleImport} disabled={validCount === 0}>
                Import {validCount} Valid Row{validCount === 1 ? "" : "s"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
