import Link from "next/link";
import { CalendarDays, PenSquare } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { BLOGS } from "@/data/blogs";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog & Guides",
  description: "Practical guides on buying, renting, RERA, home loans and locality trends across India.",
};

export default function BlogPage() {
  const published = BLOGS.filter((b) => b.status === "Published").sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Learn"
        title="Blog & Guides"
        description="Practical, jargon-free advice for buyers, tenants, owners and investors."
      />
      <RevealGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {published.map((blog) => (
          <RevealItem key={blog.id}>
            <Link href={`/blog/${blog.id.toLowerCase()}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-card transition-shadow hover:shadow-card-hover">
              <div className="relative aspect-[16/10] overflow-hidden">
                <PropertyImage src={blog.coverImage} alt={blog.title} className="transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="font-display text-base font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400">{blog.title}</p>
                <p className="line-clamp-3 flex-1 text-sm text-foreground-muted">{blog.excerpt}</p>
                <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-3 text-xs text-foreground-muted">
                  <span className="flex items-center gap-1.5">
                    <PenSquare className="h-3.5 w-3.5" /> {blog.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(blog.publishedDate)}
                  </span>
                </div>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
