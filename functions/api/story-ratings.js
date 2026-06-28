import { checkRateLimit, getClientIp } from "./_shared/rate-limit.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanStoryId(value) {
  const storyId = String(value || "").trim();
  return /^[a-zA-Z0-9:_-]{1,160}$/.test(storyId) ? storyId : "";
}

function cleanVisitorId(value) {
  const visitorId = String(value || "").trim();
  return /^[a-zA-Z0-9-]{12,80}$/.test(visitorId) ? visitorId : "";
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanRating(value) {
  const rating = Number.parseInt(value, 10);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0;
}

function cleanLimit(value) {
  const limit = Number.parseInt(value, 10);
  if (!Number.isInteger(limit)) return 5;
  return Math.min(20, Math.max(1, limit));
}

async function ensureStoryRatingsTable(database) {
  await database.prepare(
    `CREATE TABLE IF NOT EXISTS story_ratings (
      story_id TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      page_path TEXT,
      language TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (story_id, visitor_id)
    )`,
  ).run();
  await database.prepare(
    "CREATE INDEX IF NOT EXISTS idx_story_ratings_story_id ON story_ratings (story_id)",
  ).run();
  await database.prepare(
    "CREATE INDEX IF NOT EXISTS idx_story_ratings_updated_at ON story_ratings (updated_at)",
  ).run();
}

async function getStorySummary(database, storyId) {
  const row = await database.prepare(
    `SELECT story_id AS storyId, AVG(rating) AS averageRating, COUNT(*) AS ratingCount
     FROM story_ratings
     WHERE story_id = ?
     GROUP BY story_id`,
  ).bind(storyId).first();

  return {
    storyId,
    averageRating: row ? Number(row.averageRating || 0) : 0,
    ratingCount: row ? Number(row.ratingCount || 0) : 0,
  };
}

async function getTopStories(database, limit) {
  const result = await database.prepare(
    `SELECT story_id AS storyId, AVG(rating) AS averageRating, COUNT(*) AS ratingCount, MAX(updated_at) AS lastRatedAt
     FROM story_ratings
     GROUP BY story_id
     HAVING COUNT(*) > 0
     ORDER BY averageRating DESC, ratingCount DESC, lastRatedAt DESC
     LIMIT ?`,
  ).bind(limit).all();

  return (result.results || []).map((row) => ({
    storyId: row.storyId,
    averageRating: Number(row.averageRating || 0),
    ratingCount: Number(row.ratingCount || 0),
  }));
}

export async function onRequestGet({ request, env }) {
  if (!env.MAPKAI_DB) {
    return json({ ok: false, error: "Story rating database is not configured." }, 500);
  }

  await ensureStoryRatingsTable(env.MAPKAI_DB);

  const url = new URL(request.url);
  const storyId = cleanStoryId(url.searchParams.get("storyId"));
  const visitorId = cleanVisitorId(url.searchParams.get("visitorId"));
  const limit = cleanLimit(url.searchParams.get("limit"));
  const userRatings = {};

  if (storyId) {
    if (visitorId) {
      const row = await env.MAPKAI_DB.prepare(
        "SELECT rating FROM story_ratings WHERE story_id = ? AND visitor_id = ?",
      ).bind(storyId, visitorId).first();
      if (row) userRatings[storyId] = Number(row.rating || 0);
    }

    return json({
      ok: true,
      summaries: [await getStorySummary(env.MAPKAI_DB, storyId)],
      top: await getTopStories(env.MAPKAI_DB, limit),
      userRatings,
    });
  }

  return json({
    ok: true,
    summaries: [],
    top: await getTopStories(env.MAPKAI_DB, limit),
    userRatings,
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.MAPKAI_DB) {
    return json({ ok: false, error: "Story rating database is not configured." }, 500);
  }

  const body = await request.json().catch(() => ({}));
  const storyId = cleanStoryId(body.storyId);
  const visitorId = cleanVisitorId(body.visitorId);
  const rating = cleanRating(body.rating);
  const pagePath = cleanText(body.pagePath, 240);
  const language = cleanText(body.language, 24);

  if (!storyId) return json({ ok: false, error: "Missing story id." }, 400);
  if (!visitorId) return json({ ok: false, error: "Missing visitor id." }, 400);
  if (!rating) return json({ ok: false, error: "Rating must be between 1 and 5." }, 400);

  const ipLimit = await checkRateLimit(env.MAPKAI_DB, `story-rating:ip:${getClientIp(request)}`, {
    limit: 120,
    windowSeconds: 60 * 60,
  });
  if (!ipLimit.ok) return json({ ok: false, error: "Too many ratings. Please try again later." }, 429);

  const visitorLimit = await checkRateLimit(env.MAPKAI_DB, `story-rating:visitor:${visitorId}`, {
    limit: 80,
    windowSeconds: 60 * 60,
  });
  if (!visitorLimit.ok) return json({ ok: false, error: "Too many ratings. Please try again later." }, 429);

  await ensureStoryRatingsTable(env.MAPKAI_DB);
  const now = new Date().toISOString();

  await env.MAPKAI_DB.prepare(
    `INSERT INTO story_ratings (story_id, visitor_id, rating, page_path, language, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(story_id, visitor_id) DO UPDATE SET
       rating = excluded.rating,
       page_path = excluded.page_path,
       language = excluded.language,
       updated_at = excluded.updated_at`,
  ).bind(storyId, visitorId, rating, pagePath, language, now, now).run();

  return json({
    ok: true,
    summary: await getStorySummary(env.MAPKAI_DB, storyId),
    top: await getTopStories(env.MAPKAI_DB, 5),
    userRating: rating,
  });
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
