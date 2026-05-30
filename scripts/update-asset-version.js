import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const htmlFiles = ["index.html", "public/index.html"].map((file) => resolve(repoRoot, file));

function pad(value) {
  return String(value).padStart(2, "0");
}

function createVersion() {
  const now = new Date();
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

function updateAssetReferences(html, version) {
  return html.replace(
    /\b(href|src)=(["'])(\/?)(styles\.css|script\.js)(?:\?v=[^"']*)?\2/g,
    (_match, attribute, quote, slash, asset) => `${attribute}=${quote}${slash}${asset}?v=${version}${quote}`,
  );
}

const version = createVersion();
const sourceHtml = readFileSync(htmlFiles[0], "utf8");
const updatedHtml = updateAssetReferences(sourceHtml, version);

for (const file of htmlFiles) {
  writeFileSync(file, updatedHtml);
}

console.log(`Updated asset version to ${version}.`);
