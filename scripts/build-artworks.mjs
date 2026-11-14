import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const data = JSON.parse(
  readFileSync(path.join(root, "data", "artworks.json"), "utf8"),
);
const template = readFileSync(
  path.join(root, "templates", "artworks.html"),
  "utf8",
);

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const indent = (spaces, text) =>
  text
    .split("\n")
    .map((line) => (line.length ? " ".repeat(spaces) + line : line))
    .join("\n");

const renderArtwork = (artwork) => {
  const classes = [];
  if (artwork.pixelated) classes.push("artwork-pixelated");
  if (artwork.sprite) classes.push("artwork-sprite");
  const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
  const widthAttr = artwork.width ? ` width="${esc(artwork.width)}"` : "";

  const lines = [
    "<li>",
    `    <img${classAttr} src="${esc(artwork.image)}" alt="${esc(artwork.alt)}"${widthAttr} />`,
    '    <div class="artwork-caption">',
    `        <b>${esc(artwork.title)}</b>`,
    `        <div class="post-meta">${esc(artwork.meta)}</div>`,
    "    </div>",
    "</li>",
  ];

  return lines.join("\n");
};

const items = data.map(renderArtwork).join("\n\n");
const artworkGrid = indent(
  16,
  `<ul class="artwork-grid">\n${indent(4, items)}\n</ul>`,
);

if (!template.includes("{{ARTWORK_GRID}}")) {
  throw new Error("Template is missing {{ARTWORK_GRID}} placeholder");
}

const output = template.replace("{{ARTWORK_GRID}}", artworkGrid);
writeFileSync(path.join(root, "artworks.html"), output);
console.log(`Wrote artworks.html (${data.length} artworks)`);
