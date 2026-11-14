import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const data = JSON.parse(
  readFileSync(path.join(root, "data", "projects.json"), "utf8"),
);
const template = readFileSync(
  path.join(root, "templates", "projects.html"),
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

const renderLink = (link) =>
  `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(
    link.label,
  )}</a>`;

const renderProject = (project) => {
  const logoClass = project.pixelated
    ? "project-logo project-logo-pixelated"
    : "project-logo";

  const lines = [
    "<li>",
    '    <article class="project">',
    `        <img class="${logoClass}" src="${esc(project.logo)}" alt="" />`,
    '        <div class="project-body">',
    `            <h3>${esc(project.title)}</h3>`,
    "            <p>",
    `                ${esc(project.description)}`,
    "            </p>",
    '            <ul class="tags" aria-label="Technologies">',
    ...project.tags.map((tag) => `                <li>${esc(tag)}</li>`),
    "            </ul>",
  ];

  const links = Array.isArray(project.links) ? project.links : [];
  if (links.length > 0) {
    const linkHtml = links.map(renderLink).join(" · ");
    lines.push(`            <p class="project-links">${linkHtml}</p>`);
  }

  lines.push("        </div>");
  lines.push("    </article>");
  lines.push("</li>");

  return lines.join("\n");
};

const items = data.map(renderProject).join("\n\n");
const projectList = indent(
  16,
  `<ul class="project-list">\n${indent(4, items)}\n</ul>`,
);

if (!template.includes("{{PROJECT_LIST}}")) {
  throw new Error("Template is missing {{PROJECT_LIST}} placeholder");
}

const output = template.replace("{{PROJECT_LIST}}", projectList);
writeFileSync(path.join(root, "projects.html"), output);
console.log(`Wrote projects.html (${data.length} projects)`);
