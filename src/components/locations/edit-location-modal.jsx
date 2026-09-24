"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

export function EditLocationModal({ open, onOpenChange, initialName, levelLabel = "Location", onSave }) {
  const [name, setName] = useState(initialName ?? "");
  const [error, setError] = useState("");
  const openKey = `${open}:${initialName ?? ""}`;
  const [lastOpenKey, setLastOpenKey] = useState(openKey);

  if (openKey !== lastOpenKey) {
    setLastOpenKey(openKey);
    if (open) {
      setName(initialName ?? "");
      setError("");
    }
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(`${levelLabel} name is required`);
      return;
    }
    onSave(trimmed);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader>
          <ModalTitle>Edit {levelLabel} Name</ModalTitle>
          <ModalDescription>Update the display name shown across the platform.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <FormField label={`${levelLabel} Name`} required error={error} htmlFor="location-name">
            <Input
              id="location-name"
              value={name}
              error={!!error}
              autoFocus
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </FormField>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
