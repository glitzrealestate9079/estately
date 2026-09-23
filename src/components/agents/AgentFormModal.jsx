"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { agentSchema, AGENT_DEFAULT_VALUES } from "@/schemas/agentSchema";
import { AGENT_CITIES } from "@/data/agents";

export function AgentFormModal({ open, onOpenChange, mode = "add", defaultValues = AGENT_DEFAULT_VALUES, onSubmit }) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(agentSchema),
    defaultValues: AGENT_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) reset(defaultValues ?? AGENT_DEFAULT_VALUES);
  }, [open, defaultValues, reset]);

  async function submit(data) {
    await onSubmit?.(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <form onSubmit={handleSubmit(submit)}>
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
                <UserRoundCog className="h-5 w-5" />
              </div>
              <div>
                <ModalTitle>{mode === "edit" ? "Edit Agent" : "Add New Agent"}</ModalTitle>
                <ModalDescription>
                  {mode === "edit" ? "Update this agent's profile and details." : "Onboard a new agent to your platform."}
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="space-y-5">
            <FormField label="Full Name" required error={errors.name?.message} htmlFor="agent-name">
              <Input id="agent-name" placeholder="e.g. Kavita Singh" error={!!errors.name} {...register("name")} />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Phone Number" required error={errors.phone?.message} htmlFor="agent-phone">
                <Input id="agent-phone" placeholder="+91 98765 43210" error={!!errors.phone} {...register("phone")} />
              </FormField>
              <FormField label="Email Address" required error={errors.email?.message} htmlFor="agent-email">
                <Input id="agent-email" type="email" placeholder="agent@example.com" error={!!errors.email} {...register("email")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Agency Name" required error={errors.agency?.message} htmlFor="agent-agency">
                <Input id="agent-agency" placeholder="e.g. Singh Realty Associates" error={!!errors.agency} {...register("agency")} />
              </FormField>
              <FormField label="License Number" required error={errors.licenseNumber?.message} htmlFor="agent-license">
                <Input id="agent-license" placeholder="e.g. RERA-AG-2024-0123" error={!!errors.licenseNumber} {...register("licenseNumber")} />
              </FormField>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="City" required error={errors.city?.message}>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger error={!!errors.city}>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGENT_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Status" required error={errors.status?.message}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger error={!!errors.status}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {mode === "edit" ? "Save Changes" : "Add Agent"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
