// Reshapes a real BLOGS row (src/data/blogs.js) into the field vocabulary
// the ported HomePlace template's blog teaser cards expect. `body` fields
// (category tag/tone/read-time) aren't modelled in the admin schema, so
// they're derived deterministically from the post id — same spirit as the
// rest of this mapping layer.
const TAGS = ["Buying Guide", "Market Trends", "Legal", "Finance", "Locality Guide"];
const TONES = ["blue", "green", "purple", "orange", "teal"];
const ROLES = ["Content Lead", "Research Analyst", "Market Editor", "Contributing Writer"];
const TAG_POOL = ["home buying", "india real estate", "rera", "property tips", "market trends", "home loans", "legal", "investing"];

function seedFromId(id = "") {
  const digits = id.match(/\d+/g)?.join("") ?? "0";
  return Number(digits) || 1;
}

function pseudoRandom(seed, mod) {
  return (seed * 9301 + 49297) % mod;
}

export function toTemplateBlog(blog) {
  const seed = seedFromId(blog.id);
  const words = blog.body ? blog.body.split(/\s+/).length : blog.excerpt.split(/\s+/).length + blog.title.split(/\s+/).length * 3;
  return {
    slug: blog.id.toLowerCase(),
    title: blog.title,
    excerpt: blog.excerpt,
    img: blog.coverImage,
    cat: TAGS[pseudoRandom(seed, TAGS.length)],
    tone: TONES[pseudoRandom(seed + 1, TONES.length)],
    author: { name: blog.author, role: ROLES[pseudoRandom(seed + 2, ROLES.length)] },
    date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(blog.publishedDate)),
    read: Math.max(3, Math.round(words / 200)),
    tags: [TAG_POOL[pseudoRandom(seed + 3, TAG_POOL.length)], TAG_POOL[pseudoRandom(seed + 4, TAG_POOL.length)], TAG_POOL[pseudoRandom(seed + 5, TAG_POOL.length)]],
    body: blog.body ?? null,
  };
}
