import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtToc } from "@/components/site/blog/art-toc";
import { ReadingProgress } from "@/components/site/blog/reading-progress";
import { ShareLinks } from "@/components/site/blog/share-rail";
import { BLOGS } from "@/data/blogs";
import { toTemplateBlog } from "@/lib/site/template/blog-mapper";
import { parseBlogBody, tableOfContents } from "@/lib/site/template/parse-blog-body";

export function generateStaticParams() {
  return BLOGS.filter((b) => b.status === "Published").map((b) => ({ slug: b.id.toLowerCase() }));
}

function getBlogIndex(slug) {
  return BLOGS.findIndex((b) => b.id.toLowerCase() === slug && b.status === "Published");
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const i = getBlogIndex(slug);
  if (i < 0) return { title: "Article Not Found" };
  return { title: BLOGS[i].title, description: BLOGS[i].excerpt };
}

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const i = getBlogIndex(slug);
  if (i < 0) notFound();

  const raw = BLOGS[i];
  const b = toTemplateBlog(raw);
  const blocks = parseBlogBody(raw.body);
  const toc = tableOfContents(blocks);
  const published = BLOGS.filter((x) => x.status === "Published");
  const prev = published[published.indexOf(raw) - 1];
  const next = published[published.indexOf(raw) + 1];
  const related = published.filter((x) => x.id !== raw.id).slice(0, 3).map(toTemplateBlog);

  return (
    <>
      <ReadingProgress />
      <section className="art-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i className="bi bi-chevron-right" />
            <Link href="/blog">Insights</Link>
            <i className="bi bi-chevron-right" />
            <span>{b.cat}</span>
          </nav>
          <div className="art-head">
            <span className={`blog-cat tone-${b.tone}`}>{b.cat}</span>
            <h1 className="display">{b.title}</h1>
            <p className="art-lede">{b.excerpt}</p>
            <div className="art-byline">
              <div className="art-author">
                <span className="av">{initials(b.author.name)}</span>
                <div><strong>{b.author.name}</strong><span>{b.author.role}</span></div>
              </div>
              <div className="art-facts">
                <span><i className="bi bi-calendar3" />{b.date}</span>
                <span><i className="bi bi-clock" />{b.read} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <figure className="art-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.img} alt="" loading="eager" />
        </figure>

        <div className="art-layout">
          <aside className="art-share-rail hide-mobile" aria-label="Share">
            <ShareLinks title={b.title} />
          </aside>

          <article className="article">
            {blocks.length > 0 ? (
              blocks.map((block, idx) => {
                if (block.type === "h2") return <h2 key={idx} id={block.id}>{block.text}</h2>;
                if (block.type === "quote") return <blockquote key={idx}><i className="bi bi-quote" /><p>{block.text}</p></blockquote>;
                return <p key={idx}>{block.text}</p>;
              })
            ) : (
              <p>{b.excerpt}</p>
            )}
            <div className="art-foot">
              <div className="art-tags">
                {b.tags?.map((t) => <span key={t} className="chip chip-sm">#{t}</span>)}
              </div>
              <div className="art-share-inline">
                <ShareLinks title={b.title} inline />
              </div>
            </div>
            <div className="art-author-box">
              <span className="av">{initials(b.author.name)}</span>
              <div>
                <span className="eyebrow">Written by</span>
                <strong>{b.author.name}</strong>
                <p>{b.author.role}. Writes about India&apos;s property market, buying and renting for Estately.</p>
              </div>
            </div>
            <nav className="art-pager" aria-label="More articles">
              {prev ? (
                <div className="pager-item prev">
                  <Link className="pager-btn" href={`/blog/${prev.id.toLowerCase()}`}><i className="bi bi-arrow-left" />Previous</Link>
                  <strong>{prev.title}</strong>
                </div>
              ) : <span />}
              {next ? (
                <div className="pager-item next">
                  <Link className="pager-btn" href={`/blog/${next.id.toLowerCase()}`}>Next<i className="bi bi-arrow-right" /></Link>
                  <strong>{next.title}</strong>
                </div>
              ) : <span />}
            </nav>
          </article>

          <aside className="art-aside">
            {toc.length > 0 && <ArtToc toc={toc} />}
            <div className="art-cta">
              <span className="ico"><i className="bi bi-house-heart" /></span>
              <h3>Looking for a home?</h3>
              <p>Browse verified homes, rentals and plots across India.</p>
              <Link className="btn btn-accent" href="/buy"><i className="bi bi-search" />Browse properties</Link>
              <Link className="art-cta-link" href="/post-property">Post your property free<i className="bi bi-arrow-right" /></Link>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section art-related">
          <div className="container">
            <div className="section-head">
              <div><h2 className="h2">More insights</h2><p>Keep reading about India&apos;s property market.</p></div>
              <Link className="see-all" href="/blog">All articles <i className="bi bi-arrow-right" /></Link>
            </div>
            <div className="grid-3">
              {related.map((r) => (
                <Link key={r.slug} className="blog-card" href={`/blog/${r.slug}`}>
                  <span className="blog-thumb">
                    <span className="blog-img" style={{ backgroundImage: `url('${r.img}')` }} />
                    <span className="blog-open" aria-hidden="true"><i className="bi bi-arrow-up-right" /></span>
                  </span>
                  <span className="blog-body">
                    <span className={`blog-cat tone-${r.tone}`}>{r.cat}</span>
                    <span className="t">{r.title}</span>
                    <span className="d">{r.excerpt}</span>
                    <span className="blog-meta"><span className="by">{r.author.name}</span><span className="dot" /><span>{r.date}</span><span className="dot" /><span>{r.read} min read</span></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
