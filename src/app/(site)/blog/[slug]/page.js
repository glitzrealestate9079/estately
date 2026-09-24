import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, PenSquare } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { BLOGS } from "@/data/blogs";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return BLOGS.filter((b) => b.status === "Published").map((b) => ({ slug: b.id.toLowerCase() }));
}

function getBlog(slug) {
  return BLOGS.find((b) => b.id.toLowerCase() === slug && b.status === "Published") ?? null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) return { title: "Article Not Found" };
  return { title: blog.title, description: blog.excerpt };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{blog.title}</h1>
      <div className="mt-3 flex items-center gap-4 text-xs text-foreground-muted">
        <span className="flex items-center gap-1.5">
          <PenSquare className="h-3.5 w-3.5" /> {blog.author}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(blog.publishedDate)}
        </span>
      </div>

      <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
        <PropertyImage src={blog.coverImage} alt={blog.title} priority />
      </div>

      <div className="prose prose-sm mt-8 max-w-none space-y-4 text-sm leading-relaxed text-foreground-muted sm:text-base">
        <p className="text-base font-medium text-foreground sm:text-lg">{blog.excerpt}</p>
        <p>
          Every property decision is different, so treat this as a starting point rather than a substitute for
          professional advice. Speak with a qualified financial advisor before committing to a loan, and always
          have a lawyer review agreements and title documents before you sign anything.
        </p>
        <p>
          Before you finalise a decision, revisit the fundamentals: confirm the seller&apos;s ownership documents,
          check the project&apos;s RERA registration where applicable, compare at least three similar properties in
          the same locality, and factor in maintenance, registration and brokerage costs — not just the headline
          price.
        </p>
        <p>
          Ready to put this into practice? Use our{" "}
          <Link href="/services" className="font-medium text-primary-600 hover:underline">
            free EMI calculator
          </Link>{" "}
          to plan your budget, or head back to{" "}
          <Link href="/buy" className="font-medium text-primary-600 hover:underline">
            search verified properties
          </Link>{" "}
          that match your requirements.
        </p>
      </div>
    </article>
  );
}
