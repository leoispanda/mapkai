import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const resendApiKey = process.env.RESEND_API_KEY || "";
const emailFrom = process.env.EMAIL_FROM || "MapKAI <onboarding@resend.dev>";
const appOrigin = process.env.APP_ORIGIN || `http://${host}:${port}`;

const codes = new Map();
const sessions = new Map();
// This experiment is opt-in locally and is never included in the Pages output.
const speakingLocal = process.env.MAPKAI_SPEAKING_LOCAL === "1"
  ? (await import("./tools/speaking-local/handler.mjs")).handleSpeakingLocal
  : null;

const localFunctionRoutes = {
  "/api/dishkai/auth": "functions/api/dishkai/auth.js",
  "/api/dishkai/analyze-menu-text": "functions/api/dishkai/analyze-menu-text.js",
  "/api/dishkai/analyze-menu-image": "functions/api/dishkai/analyze-menu-image.js",
  "/api/dishkai/image": "functions/api/dishkai/image.js",
  "/api/visit": "functions/api/visit.js",
  "/api/contact-message": "functions/api/contact-message.js",
  "/api/contact-messages": "functions/api/contact-messages.js",
  "/api/story-ratings": "functions/api/story-ratings.js",
  "/api/course-event": "functions/api/course-event.js",
  "/api/pdc/start": "functions/api/pdc/start.js",
  "/api/pdc/validate-pass": "functions/api/pdc/validate-pass.js",
  "/api/pdc/feedback": "functions/api/pdc/feedback.js",
  "/api/pdc/founder-summary": "functions/api/pdc/founder-summary.js",
  "/api/pdc/generate-passes": "functions/api/pdc/generate-passes.js",
  "/api/pdc/latency-diagnostic": "functions/api/pdc/latency-diagnostic.js",
  "/api/factory/public-videos": "functions/api/factory/public-videos.js",
  "/api/factory/public-video": "functions/api/factory/public-video.js",
  "/api/music/listening": "functions/api/music/listening.js",
  "/api/music/votes": "functions/api/music/votes.js",
  "/api/music/auth": "functions/api/music/auth.js",
  "/api/music/tracks": "functions/api/music/tracks.js",
  "/api/music/audio": "functions/api/music/audio.js",
  "/api/music/videos": "functions/api/music/videos.js",
  "/api/music/video": "functions/api/music/video.js",
};

const legacyRedirects = {
  "/management": "/learning/corporate-finance",
  "/management/day-1-value-and-capital": "/learning/corporate-finance/day-1",
  "/management/day-2-trust-and-license": "/learning/corporate-finance/day-2",
  "/management/day-3-risk-and-governance": "/learning/corporate-finance/day-3",
  "/management/day-4-strategy-and-action": "/learning/corporate-finance/day-4",
  "/management/day-5-evidence-and-recommendation": "/learning/corporate-finance/day-5",
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".m4a": "audio/mp4",
  ".vtt": "text/vtt; charset=utf-8",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, appOrigin);
    if (speakingLocal && await speakingLocal(request, response, url)) return;

    if (request.method === "POST" && url.pathname === "/api/auth/start") {
      await startAuth(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/verify") {
      await verifyAuth(request, response);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if ((request.method === "GET" || request.method === "HEAD") && legacyRedirects[url.pathname]) {
      response.writeHead(301, { Location: legacyRedirects[url.pathname] });
      response.end();
      return;
    }

    if (localFunctionRoutes[url.pathname]) {
      await handleLocalFunctionRoute(request, response, url);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: "Internal server error" });
  }
});

let localPublicPreviewBinding;
let localMusicVideoPreviewEnv;

async function getLocalMusicVideoPreviewEnv() {
  if (localMusicVideoPreviewEnv) return localMusicVideoPreviewEnv;
  // This adapter exists only in the Node preview server, behind an explicit
  // local flag. The deployed Pages handlers always use guarded R2 bindings.
  const { MUSIC_VIDEOS } = await import("./functions/api/music/_videos.js");
  const { COST_GUARD_KEY, COST_GUARD_LIMITS } = await import("./functions/_shared/cost-guard.js");
  const spec = JSON.parse(await readFile(join(root, ".workspace-backups/your-turn-ai-label-20261023/publish-spec.json"), "utf8"));
  if (spec.runId !== "your-turn-ai-label-20261023" || !Array.isArray(spec.items) || spec.items.length !== 4) {
    throw new Error("Local music video preview is unavailable");
  }
  const sources = {
    "your-turn-asml/phone": ".workspace-backups/your-turn-ai-label-20261023/your-turn-asml-phone-AI-generated.mp4",
    "your-turn-asml/hd": ".workspace-backups/your-turn-ai-label-20261023/your-turn-asml-hd-AI-generated.mp4",
    "your-turn-artworks/phone": ".workspace-backups/your-turn-ai-label-20261023/your-turn-artworks-phone-AI-generated.mp4",
    "your-turn-original/phone": ".workspace-backups/your-turn-ai-label-20261023/your-turn-original-phone-AI-generated.mp4"
  };
  const entries = new Map();
  for (const video of MUSIC_VIDEOS) {
    for (const rendition of video.qualities) {
      const records = spec.items.filter(item => item.id === video.id && item.quality === rendition.id);
      const record = records[0];
      const filePath = join(root, sources[`${video.id}/${rendition.id}`]);
      if (records.length !== 1 || record.source !== filePath || record.bytes !== rendition.bytes
        || record.sha256 !== rendition.sha256 || record.objectKey !== rendition.objectKey || record.md5 !== rendition.etag) {
        throw new Error("Local music video preview is unavailable");
      }
      const info = await stat(filePath);
      if (!info.isFile() || info.size !== rendition.bytes) throw new Error("Local music video preview is unavailable");
      const digest = createHash("sha256");
      for await (const chunk of createReadStream(filePath)) digest.update(chunk);
      if (digest.digest("hex") !== rendition.sha256) throw new Error("Local music video preview is unavailable");
      entries.set(rendition.objectKey, { filePath, bytes: rendition.bytes, etag: rendition.etag, mtimeMs: info.mtimeMs });
    }
  }
  const headFor = async key => {
    const entry = entries.get(key);
    if (!entry) return null;
    const info = await stat(entry.filePath);
    return info.isFile() && info.size === entry.bytes && info.mtimeMs === entry.mtimeMs
      ? { size: entry.bytes, etag: entry.etag, httpEtag: `"${entry.etag}"` } : null;
  };
  const bucket = {
    head: headFor,
    get: async (key, options = {}) => {
      const head = await headFor(key);
      if (!head || (options.onlyIf?.etagMatches && options.onlyIf.etagMatches !== head.etag)) return head;
      const range = options.range;
      const streamOptions = range ? { start: range.offset, end: range.offset + range.length - 1 } : undefined;
      return { ...head, body: Readable.toWeb(createReadStream(entries.get(key).filePath, streamOptions)) };
    },
  };
  let classA = 0;
  let classB = 0;
  const database = { prepare() { return { bind(...values) { return { async first() {
    classA += values[2];
    classB += values[3];
    return { guard_key: COST_GUARD_KEY, cycle_start: values[1], class_a_used: classA, class_b_used: classB,
      upload_bytes_used: 0, storage_bytes_reserved: COST_GUARD_LIMITS.initialStorageBytes, updated_at: values[6] };
  } }; } }; } };
  localMusicVideoPreviewEnv = { ...process.env, MAPKAI_REVIEW_MEDIA: bucket, CLOUDFLARE_COST_DB: database };
  return localMusicVideoPreviewEnv;
}

async function getLocalPublicPreviewBinding() {
  if (localPublicPreviewBinding) return localPublicPreviewBinding;
  const deliveryRoot = join(root, "mapkai-video-factory/runtime/delivery");
  const publicCatalogPath = join(deliveryRoot, "public-preview-catalog.json");
  const privateCatalogPath = join(deliveryRoot, "review-catalog.json");
  const readCatalogFile = async file => JSON.parse(await readFile(file, "utf8"));
  const publicCatalog = await readCatalogFile(publicCatalogPath);
  const privateCatalog = await readCatalogFile(privateCatalogPath);
  const itemForKey = key => privateCatalog.items.find(item => item.objectKey === key);
  const localPathForItem = item => {
    const filePath = join(root, item.rawVideoPath);
    if (!filePath.startsWith(`${root}/`)) throw new Error("Local preview path escapes workspace");
    return filePath;
  };
  localPublicPreviewBinding = {
    get: async (key, options) => {
      if (key === "catalog/public-preview-v1.json") return { json: async () => publicCatalog };
      const item = itemForKey(key);
      if (!item) return null;
      const filePath = localPathForItem(item);
      const info = await stat(filePath);
      const range = options?.range;
      const streamOptions = range ? { start: range.offset, end: range.offset + range.length - 1 } : undefined;
      return { body: Readable.toWeb(createReadStream(filePath, streamOptions)), size: info.size };
    },
    head: async key => {
      const item = itemForKey(key);
      if (!item) return null;
      const info = await stat(localPathForItem(item));
      return { size: info.size };
    },
  };
  return localPublicPreviewBinding;
}

async function handleLocalFunctionRoute(request, response, url) {
  const routePath = localFunctionRoutes[url.pathname];
  const modulePath = pathToFileURL(join(root, routePath)).href;
  const routeModule = await import(modulePath);
  const headers = new Headers();

  Object.entries(request.headers).forEach(([name, value]) => {
    if (Array.isArray(value)) headers.set(name, value.join(", "));
    else if (value !== undefined) headers.set(name, value);
  });

  const requestInit = {
    method: request.method,
    headers,
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    requestInit.body = await readRawBody(request);
  }

  const methodHandlerName = `onRequest${request.method.charAt(0).toUpperCase()}${request.method.slice(1).toLowerCase()}`;
  const routeHandler = routeModule[methodHandlerName] || routeModule.onRequest;

  if (typeof routeHandler !== "function") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  const localPreviewEnabled = process.env.MAPKAI_PUBLIC_PREVIEW_LOCAL === "1"
    && url.pathname.startsWith("/api/factory/public-");
  const musicVideoPreviewEnabled = process.env.MUSIC_VIDEO_LOCAL_PREVIEW === "1"
    && url.pathname === "/api/music/video";
  const env = musicVideoPreviewEnabled ? await getLocalMusicVideoPreviewEnv() : localPreviewEnabled
    ? { ...process.env, MAPKAI_REVIEW_MEDIA: await getLocalPublicPreviewBinding() }
    : process.env;
  const functionResponse = await routeHandler({
    request: new Request(url.href, requestInit),
    env,
  });
  const responseHeaders = {};
  functionResponse.headers.forEach((value, name) => {
    responseHeaders[name] = value;
  });
  if (url.pathname === "/api/music/video" && functionResponse.body) {
    response.writeHead(functionResponse.status, responseHeaders);
    const stream = Readable.fromWeb(functionResponse.body);
    stream.on("error", () => response.destroy());
    response.on("close", () => stream.destroy());
    stream.pipe(response);
    return;
  }
  const body = Buffer.from(await functionResponse.arrayBuffer());
  response.writeHead(functionResponse.status, responseHeaders);
  response.end(body);
}

async function startAuth(request, response) {
  const { email } = await readJson(request);
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail) {
    sendJson(response, 400, { error: "Enter a valid email address." });
    return;
  }

  const code = createCode();
  codes.set(cleanEmail, {
    codeHash: hashCode(code),
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });

  if (!resendApiKey) {
    console.log(`Local MapKAI login code for ${cleanEmail}: ${code}`);
    sendJson(response, 200, { ok: true, devCode: code });
    return;
  }

  await sendLoginEmail(cleanEmail, code);
  sendJson(response, 200, { ok: true });
}

async function verifyAuth(request, response) {
  const { email, code } = await readJson(request);
  const cleanEmail = normalizeEmail(email);
  const cleanCode = String(code || "").replace(/\D/g, "");
  const record = codes.get(cleanEmail);

  if (!record || record.expiresAt < Date.now()) {
    codes.delete(cleanEmail);
    sendJson(response, 400, { error: "This code expired. Request a new one." });
    return;
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    codes.delete(cleanEmail);
    sendJson(response, 429, { error: "Too many attempts. Request a new code." });
    return;
  }

  const codeHash = hashCode(cleanCode);
  if (!safeEqual(codeHash, record.codeHash)) {
    sendJson(response, 400, { error: "That code is not correct." });
    return;
  }

  codes.delete(cleanEmail);
  const sessionId = randomUUID();
  sessions.set(sessionId, { email: cleanEmail, createdAt: Date.now() });
  sendJson(response, 200, { ok: true, sessionId, email: cleanEmail });
}

async function sendLoginEmail(email, code) {
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: email,
      subject: "Your MapKAI login code",
      text: `Your MapKAI login code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your MapKAI login code is:</p><h1>${code}</h1><p>It expires in 10 minutes.</p>`,
    }),
  });

  if (!result.ok) {
    const details = await result.text();
    throw new Error(`Email provider failed: ${details}`);
  }
}

async function serveStatic(pathname, response) {
  // Factory source, catalogs and receipts are not part of the public site.
  // Keep the local convenience server from turning those backend files into
  // a second, unauthenticated delivery channel.
  if (pathname === "/functions" || pathname.startsWith("/functions/")
    || pathname === "/.workspace-backups" || pathname.startsWith("/.workspace-backups/")
    || pathname === "/mapkai-video-factory" || pathname.startsWith("/mapkai-video-factory/")) {
    sendJson(response, 404, { error: "Not found" });
    return;
  }
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath);

  if (!filePath.startsWith(root)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    if (!extname(filePath)) {
      const directoryIndexCandidates = [join(root, safePath, "index.html"), join(root, "public", safePath, "index.html")];
      for (const candidate of directoryIndexCandidates) {
        try {
          const content = await readFile(candidate);
          response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
          response.end(content);
          return;
        } catch {
          // Continue to the standard public-file and SPA fallbacks.
        }
      }
    }
    const publicFilePath = join(root, "public", safePath);
    try {
      const content = await readFile(publicFilePath);
      response.writeHead(200, {
        "Content-Type": mimeTypes[extname(publicFilePath)] || "application/octet-stream",
      });
      response.end(content);
      return;
    } catch {
      // Static source and deploy output both lack this file; continue to the SPA fallback.
    }
    if (!extname(filePath)) {
      const content = await readFile(join(root, "index.html"));
      response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
      response.end(content);
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function createCode() {
  return String(randomInt(100000, 1000000));
}

function hashCode(code) {
  return createHash("sha256").update(code).digest();
}

function safeEqual(left, right) {
  return left.length === right.length && timingSafeEqual(left, right);
}

function normalizeEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

async function readJson(request) {
  const body = await readRawBody(request);
  if (!body.length) return {};
  return JSON.parse(body.toString("utf8"));
}

async function readRawBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : Buffer.alloc(0);
}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

server.listen(port, host, () => {
  console.log(`MapKAI running at http://${host}:${port}`);
});
