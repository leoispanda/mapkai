import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { createHash, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

const root = process.cwd();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const resendApiKey = process.env.RESEND_API_KEY || "";
const emailFrom = process.env.EMAIL_FROM || "MapKai <onboarding@resend.dev>";
const appOrigin = process.env.APP_ORIGIN || `http://${host}:${port}`;

const codes = new Map();
const sessions = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, appOrigin);

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

    await serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: "Internal server error" });
  }
});

async function startAuth(request, response) {
  const { email } = await readJson(request);
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail) {
    sendJson(response, 400, { error: "Enter a valid email address." });
    return;
  }

  if (!resendApiKey) {
    sendJson(response, 500, {
      error: "Email sending is not configured. Set RESEND_API_KEY and EMAIL_FROM on the server.",
    });
    return;
  }

  const code = createCode();
  codes.set(cleanEmail, {
    codeHash: hashCode(code),
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });

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
      subject: "Your MapKai login code",
      text: `Your MapKai login code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your MapKai login code is:</p><h1>${code}</h1><p>It expires in 10 minutes.</p>`,
    }),
  });

  if (!result.ok) {
    const details = await result.text();
    throw new Error(`Email provider failed: ${details}`);
  }
}

async function serveStatic(pathname, response) {
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
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

server.listen(port, host, () => {
  console.log(`MapKai running at http://${host}:${port}`);
});
