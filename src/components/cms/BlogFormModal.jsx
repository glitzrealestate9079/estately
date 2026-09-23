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
import { PropertyImage } from "@/components/common/property-image";
import { blogSchema, BLOG_DEFAULT_VALUES } from "@/schemas/blogSchema";

const BLOG_STATUSES = ["Draft", "Published"];

export function BlogFormModal({ open, onOpenChange, mode = "add", defaultValues, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(blogSchema),
    defaultValues: defaultValues ?? BLOG_DEFAULT_VALUES,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? BLOG_DEFAULT_VALUES);
    }
  }, [open, defaultValues, reset]);

  const coverPreview = watch("coverImage");

  async function onValid(data) {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    onSubmit(data);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>{mode === "edit" ? "Edit Blog Post" : "Add New Blog Post"}</ModalTitle>
          <ModalDescription>
            {mode === "edit"
              ? "Update this article's content and publishing status."
              : "Publish a new article to the Estately blog."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-5">
          <FormField label="Title" required error={errors.title?.message} htmlFor="title">
            <Input id="title" placeholder="e.g. 10 Tips for First-Time Home Buyers" error={!!errors.title} {...register("title")} />
          </FormField>

          <FormField label="Excerpt" required error={errors.excerpt?.message} htmlFor="excerpt" hint="A short summary shown on the blog listing page.">
            <Textarea id="excerpt" rows={3} placeholder="Write a short, compelling summary…" error={!!errors.excerpt} {...register("excerpt")} />
          </FormField>

          <FormField label="Cover Image URL" required error={errors.coverImage?.message} htmlFor="coverImage">
            <Input id="coverImage" placeholder="https://images.unsplash.com/…" error={!!errors.coverImage} {...register("coverImage")} />
          </FormField>

          {coverPreview && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-border-subtle">
              <PropertyImage src={coverPreview} alt="Cover preview" />
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Author" required error={errors.author?.message} htmlFor="author">
              <Input id="author" placeholder="e.g. Priya Malhotra" error={!!errors.author} {...register("author")} />
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
                      {BLOG_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onValid)} loading={submitting}>
            {mode === "edit" ? "Save Changes" : "Add Blog Post"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
