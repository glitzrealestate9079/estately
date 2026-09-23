"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/modal";
import { faqSchema, FAQ_CATEGORIES, FAQ_DEFAULT_VALUES } from "@/schemas/faqSchema";

export function FaqFormModal({ open, onOpenChange, mode = "add", defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(faqSchema),
    defaultValues: defaultValues ?? FAQ_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? FAQ_DEFAULT_VALUES);
    }
  }, [open, defaultValues, reset]);

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader>
          <ModalTitle>{mode === "edit" ? "Edit FAQ" : "Add New FAQ"}</ModalTitle>
          <ModalDescription>
            {mode === "edit" ? "Update this question and answer." : "Add a new question to the public help center."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-5">
          <FormField label="Question" required error={errors.question?.message} htmlFor="question">
            <Input id="question" placeholder="e.g. How do I list my property?" error={!!errors.question} {...register("question")} />
          </FormField>

          <FormField label="Answer" required error={errors.answer?.message} htmlFor="answer">
            <Textarea id="answer" rows={5} placeholder="Write a clear, complete answer…" error={!!errors.answer} {...register("answer")} />
          </FormField>

          <FormField label="Category" required error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger error={!!errors.category}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            {mode === "edit" ? "Save Changes" : "Add FAQ"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
