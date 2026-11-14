import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const data = JSON.parse(
  readFileSync(path.join(root, "data", "blogs.json"), "utf8"),
);
const template = readFileSync(
  path.join(root, "templates", "blogs.html"),
  "utf8",
);

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatDate = (iso) => {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const indent = (spaces, text) =>
  text
    .split("\n")
    .map((line) => (line.length ? " ".repeat(spaces) + line : line))
    .join("\n");

const renderLink = (link) =>
  `<a href="${esc(link.url)}">${esc(
    link.label,
  )}</a>`;

const renderPost = (post) => {
  const lines = [
    `<article id="${esc(post.id)}">`,
    `    <h2>${esc(post.title)}</h2>`,
    `    <div class="post-meta"><time datetime="${esc(post.date)}">${formatDate(
      post.date,
    )}</time></div>`,
  ];

  for (const paragraph of post.paragraphs || []) {
    lines.push("    <p>");
    lines.push(`        ${esc(paragraph)}`);
    lines.push("    </p>");
  }

  const links = Array.isArray(post.links) ? post.links : [];
  if (links.length > 0) {
    const linkHtml = links.map(renderLink).join(" · ");
    lines.push(`    <p class="post-links">${linkHtml}</p>`);
  }

  lines.push("</article>");
  return lines.join("\n");
};

const posts = data.map(renderPost).join("\n\n");
const blogPosts = indent(16, posts);

if (!template.includes("{{BLOG_POSTS}}")) {
  throw new Error("Template is missing {{BLOG_POSTS}} placeholder");
}

const output = template.replace("{{BLOG_POSTS}}", blogPosts);
writeFileSync(path.join(root, "blogs.html"), output);
console.log(`Wrote blogs.html (${data.length} posts)`);
