import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const htmlFiles = ["index.html", "public/index.html"].map((file) => resolve(repoRoot, file));

function getAssetVersion() {
  const pagesCommit = process.env.CF_PAGES_COMMIT_SHA?.trim();
  if (pagesCommit) return { source: "CF_PAGES_COMMIT_SHA", version: pagesCommit.slice(0, 7) };

  const version = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

  return { source: "git rev-parse --short HEAD", version };
}

function versionedAsset(assetPath, version) {
  return `${assetPath}?v=${version}`;
}

function ensureStylesheet(html, version) {
  const stylesheetHref = versionedAsset("/styles.css", version);
  const stylesheetPattern = /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']\/styles\.css(?:\?[^"']*)?["'])[^>]*>/i;
  const replacement = `<link rel="stylesheet" href="${stylesheetHref}" />`;

  if (stylesheetPattern.test(html)) return html.replace(stylesheetPattern, replacement);

  return html.replace(/<\/head>/i, `    ${replacement}\n  </head>`);
}

function ensureScript(html, version) {
  const scriptSrc = versionedAsset("/script.js", version);
  const externalScriptPattern = /<script\b(?=[^>]*\bsrc=["']\/script\.js(?:\?[^"']*)?["'])[^>]*>\s*<\/script>/i;
  const externalScript = `<script src="${scriptSrc}"></script>`;

  if (externalScriptPattern.test(html)) return html.replace(externalScriptPattern, externalScript);

  const inlineScriptPattern = /\n\s*<script>\s*[\s\S]*?\s*<\/script>\s*(?=<\/body>)/i;
  if (inlineScriptPattern.test(html)) return html.replace(inlineScriptPattern, `\n    ${externalScript}\n  `);

  return html.replace(/<\/body>/i, `    ${externalScript}\n  </body>`);
}

function updateHtml(html, version) {
  return ensureScript(ensureStylesheet(html, version), version);
}

const { source, version } = getAssetVersion();
const sourceHtml = readFileSync(htmlFiles[0], "utf8");
const updatedHtml = updateHtml(sourceHtml, version);

for (const file of htmlFiles) {
  writeFileSync(file, updatedHtml);
}

console.log(`Asset version ${version} injected from ${source}.`);
