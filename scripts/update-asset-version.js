import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const htmlFiles = ["index.html", "public/index.html"].map((file) => resolve(repoRoot, file));
const courseHtmlFiles = [
  "public/learning/corporate-finance/index.html",
  "public/learning/corporate-finance/day-1/index.html",
  "public/learning/corporate-finance/day-2/index.html",
  "public/learning/corporate-finance/day-3/index.html",
  "public/learning/corporate-finance/day-4/index.html",
  "public/learning/corporate-finance/day-5/index.html",
  "public/learning/corporate-finance/completed/index.html",
  "public/zh/learning/corporate-finance/index.html",
  "public/zh/learning/corporate-finance/day-1/index.html",
  "public/zh/learning/corporate-finance/day-2/index.html",
  "public/zh/learning/corporate-finance/day-3/index.html",
  "public/zh/learning/corporate-finance/day-4/index.html",
  "public/zh/learning/corporate-finance/day-5/index.html",
  "public/zh/learning/corporate-finance/completed/index.html",
].map((file) => resolve(repoRoot, file));
const scriptFiles = ["script.js", "public/script.js", "map3d.js", "public/map3d.js", "map3d-terrain.js", "public/map3d-terrain.js"].map((file) => resolve(repoRoot, file));
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
    /\b(href|src)=(["'])(\/?)(styles\.css|map3d\.css|script\.js|site-shell\.(?:css|js)|finance-course\.js|content\/(?:field-fables|management-column|management-lesson-stories|management-lesson-references)\.js)(?:\?v=[^"']*)?\2/g,
    (_match, attribute, quote, slash, asset) => `${attribute}=${quote}${slash}${asset}?v=${version}${quote}`,
  );
}

function updateScriptVersion(script, version) {
  return script.replace(/\bconst appVersion = ["'][^"']*["'];/, `const appVersion = "${version}";`)
    .replace(/((?:\/|\.\/)map3d(?:-(?:terrain|flora))?\.js)\?v=[^"']*/g, `$1?v=${version}`);
}

const version = getNextVersion();
const sourceHtml = readFileSync(htmlFiles[0], "utf8");
const updatedHtml = updateAssetReferences(sourceHtml, version);

for (const file of htmlFiles) {
  writeFileSync(file, updatedHtml);
}

for (const file of courseHtmlFiles) {
  writeFileSync(file, updateAssetReferences(readFileSync(file, "utf8"), version));
}

for (const file of scriptFiles) {
  writeFileSync(file, updateScriptVersion(readFileSync(file, "utf8"), version));
}

for (const file of ["speaking/index.html", "public/speaking/index.html", "public/speaking/en/index.html"]) {
  const path = resolve(repoRoot, file);
  const html = updateAssetReferences(readFileSync(path, "utf8"), version).replace(
    /(\/speaking\/(?:app\.js|styles\.css|studio\.css))(?:\?v=[^"']*)?/g,
    `$1?v=${version}`,
  );
  writeFileSync(path, html);
}

for (const file of ["speaking/app.js", "public/speaking/app.js", "speaking/i18n.js", "public/speaking/i18n.js"]) {
  const path = resolve(repoRoot, file);
  writeFileSync(path, readFileSync(path, "utf8").replace(
    /((?:\/speaking\/|\.\/)(?:(?:i18n|translations|gemini)\.js|agent-prompt\.txt))(?:\?v=[^"']*)?/g,
    `$1?v=${version}`,
  ));
}

for (const file of ["toolbox/index.html", "public/toolbox/index.html", "public/toolbox/en/index.html", "toolbox/metronome/index.html", "public/toolbox/metronome/index.html", "public/toolbox/metronome/en/index.html", "toolbox/dishkai/index.html", "public/toolbox/dishkai/index.html", "public/toolbox/dishkai/en/index.html", "toolbox/frameworks/index.html", "public/toolbox/frameworks/index.html", "public/toolbox/frameworks/en/index.html"]) {
  const path = resolve(repoRoot, file);
  writeFileSync(path, updateAssetReferences(readFileSync(path, "utf8"), version).replace(/(\/toolbox\/(?:(?:(?:metronome|dishkai|frameworks)\/)?(?:en\/)?)?(?:app\.js|styles\.css))(?:\?v=[^"']*)?/g, `$1?v=${version}`));
}

for (const file of ['toolbox/frameworks/app.js', 'public/toolbox/frameworks/app.js', 'toolbox/frameworks/data.js', 'public/toolbox/frameworks/data.js', 'toolbox/frameworks/diagrams.js', 'public/toolbox/frameworks/diagrams.js']) {
  const path = resolve(repoRoot, file);
  writeFileSync(path, readFileSync(path, 'utf8').replace(/(\.\/(?:data|diagrams|library|references|stories)\.js)(?:\?v=[^"']*)?/g, `$1?v=${version}`));
}

writeFileSync(versionPath, `${JSON.stringify({ version, updatedAt: new Date().toISOString() }, null, 2)}\n`);

console.log(`Updated MapKAI asset version to v${version}.`);
