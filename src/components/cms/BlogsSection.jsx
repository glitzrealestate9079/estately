"use client";

import { useMemo, useState } from "react";
import { Newspaper, Pencil, Plus, Search, Send, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PropertyImage } from "@/components/common/property-image";
import { BlogFormModal } from "@/components/cms/BlogFormModal";
import { BLOGS as INITIAL_BLOGS } from "@/data/blogs";
import { BLOG_DEFAULT_VALUES } from "@/schemas/blogSchema";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 6;
const TODAY_ISO = "2026-09-23";

export function BlogsSection() {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = blogs;
    if (q) {
      rows = rows.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
      );
    }
    return [...rows].sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  }, [blogs, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function openAdd() {
    setFormMode("add");
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(blog) {
    setFormMode("edit");
    setEditTarget(blog);
    setFormOpen(true);
  }

  function handleSubmit(data) {
    if (formMode === "edit" && editTarget) {
      setBlogs((prev) => prev.map((b) => (b.id === editTarget.id ? { ...b, ...data } : b)));
      toast.success(`"${data.title}" was updated`);
    } else {
      const maxIdNumber = blogs.reduce((max, b) => Math.max(max, Number(b.id.split("-")[1]) || 0), 2000);
      const newBlog = {
        id: `BLG-${maxIdNumber + 1}`,
        ...data,
        publishedDate: TODAY_ISO,
      };
      setBlogs((prev) => [newBlog, ...prev]);
      toast.success(`"${data.title}" was created as ${data.status}`);
    }
  }

  function togglePublish(blog) {
    const next = blog.status === "Published" ? "Draft" : "Published";
    setBlogs((prev) => prev.map((b) => (b.id === blog.id ? { ...b, status: next } : b)));
    toast.success(`"${blog.title}" is now ${next}`);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.title}" was deleted`);
    setDeleteTarget(null);
  }

  const modalDefaultValues =
    formMode === "edit" && editTarget
      ? {
          title: editTarget.title,
          excerpt: editTarget.excerpt,
          coverImage: editTarget.coverImage,
          author: editTarget.author,
          status: editTarget.status,
          body: editTarget.body ?? "",
        }
      : BLOG_DEFAULT_VALUES;

  return (
    <Card className="animate-slide-up space-y-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <Input icon={Search} placeholder="Search by title, author or ID…" value={search} onChange={(e) => updateSearch(e.target.value)} />
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Blog Post
          </Button>
        </div>
        <p className="text-xs text-foreground-muted">{filtered.length} blog posts found</p>
      </div>

      {pageRows.length === 0 ? (
        <EmptyState icon={Newspaper} title="No blog posts found" description="Try a different search term, or add a new article." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg">
                      <PropertyImage src={blog.coverImage} alt={blog.title} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{blog.title}</p>
                      <p className="text-xs text-foreground-muted">{blog.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{blog.author}</TableCell>
                <TableCell>
                  <StatusBadge status={blog.status} />
                </TableCell>
                <TableCell className="text-sm text-foreground-muted">{formatDate(blog.publishedDate)}</TableCell>
                <TableCell className="text-right">
                  <RowActions
                    actions={[
                      { label: "Edit", icon: Pencil, onClick: () => openEdit(blog) },
                      blog.status === "Published"
                        ? { label: "Unpublish", icon: Undo2, onClick: () => togglePublish(blog) }
                        : { label: "Publish", icon: Send, onClick: () => togglePublish(blog) },
                      {
                        label: "Delete",
                        icon: Trash2,
                        destructive: true,
                        separatorBefore: true,
                        onClick: () => setDeleteTarget(blog),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {pageRows.length > 0 && (
        <Pagination page={page} pageCount={pageCount} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
      )}

      <BlogFormModal open={formOpen} onOpenChange={setFormOpen} mode={formMode} defaultValues={modalDefaultValues} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this blog post?"
        description={`"${deleteTarget?.title}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete Post"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
