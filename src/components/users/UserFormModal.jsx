"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { userSchema, USER_DEFAULT_VALUES, USER_STATUSES } from "@/schemas/userSchema";
import { USER_ROLES } from "@/lib/constants";

// mode: "add" | "edit". `user` supplies default values when editing.
export function UserFormModal({ open, onOpenChange, mode = "add", user, onSave }) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: USER_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(
        isEdit && user
          ? { name: user.name, email: user.email, role: user.role, status: user.status }
          : USER_DEFAULT_VALUES
      );
    }
  }, [open, isEdit, user, reset]);

  async function onSubmit(data) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onSave?.(data);
    toast.success(isEdit ? `${data.name}'s details updated` : `${data.name} added as ${data.role}`);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit User" : "Add New User"}</ModalTitle>
          <ModalDescription>
            {isEdit ? "Update this team member's details and access role." : "Invite a new team member to the admin panel."}
          </ModalDescription>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <ModalBody className="space-y-5">
            <FormField label="Full Name" required error={errors.name?.message} htmlFor="user-name">
              <Input id="user-name" icon={User} placeholder="e.g. Kavita Singh" error={!!errors.name} {...register("name")} />
            </FormField>

            <FormField label="Email Address" required error={errors.email?.message} htmlFor="user-email">
              <Input
                id="user-email"
                type="email"
                icon={Mail}
                placeholder="name@estately.example"
                error={!!errors.email}
                {...register("email")}
              />
            </FormField>

            <FormField label="Role" required error={errors.role?.message} htmlFor="user-role">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="user-role" error={!!errors.role}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Status" required error={errors.status?.message} htmlFor="user-status">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="user-status" error={!!errors.status}>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "Save Changes" : "Add User"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
