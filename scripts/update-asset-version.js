import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const htmlFiles = ["index.html", "public/index.html"].map((file) => resolve(repoRoot, file));
const versionPath = resolve(repoRoot, "version.json");

function getNextVersion() {
  const versionData = JSON.parse(readFileSync(versionPath, "utf8"));
  const parts = String(versionData.version || "0.1.0").split(".").map((part) => Number.parseInt(part, 10) || 0);

  while (parts.length < 3) {
    parts.push(0);
  }

  parts[2] += 1;
  return parts.slice(0, 3).join(".");
}

function updateAssetReferences(html, version) {
  return html.replace(
    /\b(href|src)=(["'])(\/?)(styles\.css|script\.js)(?:\?v=[^"']*)?\2/g,
    (_match, attribute, quote, slash, asset) => `${attribute}=${quote}${slash}${asset}?v=${version}${quote}`,
  );
}

const version = getNextVersion();
const sourceHtml = readFileSync(htmlFiles[0], "utf8");
const updatedHtml = updateAssetReferences(sourceHtml, version);

for (const file of htmlFiles) {
  writeFileSync(file, updatedHtml);
}

writeFileSync(versionPath, `${JSON.stringify({ version, updatedAt: new Date().toISOString() }, null, 2)}\n`);

console.log(`Updated MapKAI asset version to v${version}.`);
