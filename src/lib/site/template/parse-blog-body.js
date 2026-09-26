function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Parses the admin-authored plain-text `body` field (## heading, > quote,
// blank-line-separated paragraphs) into typed blocks the article renderer
// and table-of-contents can both consume.
export function parseBlogBody(body) {
  if (!body) return [];
  return body
    .split(/\n\s*\n/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      if (raw.startsWith("## ")) {
        const text = raw.slice(3).trim();
        return { type: "h2", text, id: slugify(text) };
      }
      if (raw.startsWith("> ")) {
        return { type: "quote", text: raw.slice(2).trim() };
      }
      return { type: "p", text: raw };
    });
}

export function tableOfContents(blocks) {
  return blocks.filter((b) => b.type === "h2").map((b) => ({ id: b.id, text: b.text }));
}
