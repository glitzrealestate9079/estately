import Link from "next/link";
import { BLOGS } from "@/data/blogs";
import { toTemplateBlog } from "@/lib/site/template/blog-mapper";

export const metadata = {
  title: "Blog & Guides",
  description: "Practical guides on buying, renting, RERA, home loans and locality trends across India.",
};

export default function BlogPage() {
  const blogs = BLOGS.filter((b) => b.status === "Published")
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .map(toTemplateBlog);
  const [featured, ...rest] = blogs;

  return (
    <main className="container">
      <div className="page-head">
        <h1>Blog &amp; Guides</h1>
        <p>Practical, jargon-free advice for buyers, tenants, owners and investors.</p>
      </div>

      {featured && (
        <div className="blog-layout mt-24">
          <Link className="blog-feature" href={`/blog/${featured.slug}`}>
            <span className="blog-img" style={{ backgroundImage: `url('${featured.img}')` }} />
            <span className="blog-open" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
            <span className="blog-feature-body">
              <span className="blog-tag"><i className="bi bi-graph-up-arrow" />{featured.cat}</span>
              <span className="t">{featured.title}</span>
              <span className="d">{featured.excerpt}</span>
              <span className="blog-author">
                <span className="av">{featured.author.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                <span className="who"><strong>{featured.author.name}</strong><span>{featured.date} · {featured.read} min read</span></span>
              </span>
            </span>
          </Link>
          <div className="blog-list">
            {rest.map((b) => (
              <Link key={b.slug} className="blog-row" href={`/blog/${b.slug}`}>
                <span className="blog-thumb">
                  <span className="blog-img" style={{ backgroundImage: `url('${b.img}')` }} />
                  <span className="blog-open" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                </span>
                <span className="blog-body">
                  <span className={`blog-cat tone-${b.tone}`}>{b.cat}</span>
                  <span className="t">{b.title}</span>
                  <span className="d">{b.excerpt}</span>
                  <span className="blog-meta"><span className="by">{b.author.name}</span><span className="dot" /><span>{b.date}</span><span className="dot" /><span>{b.read} min read</span></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
