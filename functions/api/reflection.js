const MODEL = "@cf/meta/llama-3.1-8b-instruct";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cleanList(value, maxItems = 6) {
  return Array.isArray(value)
    ? value.map((item) => cleanText(item, 80)).filter(Boolean).slice(0, maxItems)
    : [];
}

function cleanReflectionSummary(body) {
  const language = body.language === "zh" ? "zh" : "en";
  const totalAnswered = Math.max(0, Math.min(1000, Math.round(cleanNumber(body.totalAnswered))));
  const accuracy = Math.max(0, Math.min(1, cleanNumber(body.accuracy)));
  return {
    language,
    totalAnswered,
    accuracy,
    strongTags: cleanList(body.strongTags),
    weakTags: cleanList(body.weakTags),
    thinkingStyle: cleanText(body.thinkingStyle, 120),
    explorationTendency: cleanText(body.explorationTendency, 120),
  };
}

function buildPrompt(summary) {
  const languageInstruction = summary.language === "zh"
    ? "Write in Simplified Chinese."
    : "Write in English.";
  return `You are MapKAI, a calm knowledge atlas assistant.

Create a short knowledge reflection from this compressed exploration summary only.
Do not infer identity, intelligence, mental health, personality type, or fixed ability.
Do not flatter, rank, diagnose, or sound like therapy.
Keep the tone premium, reflective, atlas-like, sharp, emotionally restrained, and exploratory.
Return valid JSON only, with exactly these keys:
{
  "summary": "...",
  "fullReflection": {
    "objectivePattern": "...",
    "blindSpots": "...",
    "recentDrift": "...",
    "lessExploredAreas": "...",
    "nextDirection": "...",
    "uncomfortableTruth": "..."
  }
}

The summary is the most important output. Keep it around 120-200 words maximum.
Each fullReflection value must be one concise sentence.
${languageInstruction}

Compressed summary:
${JSON.stringify(summary)}`;
}

function extractJsonObject(value) {
  const text = typeof value === "string" ? value : String(value?.response || value?.result || "");
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Workers AI did not return JSON.");
  return JSON.parse(match[0]);
}

function cleanReflection(value) {
  return {
    summary: cleanText(value.summary, 1400),
    fullReflection: {
      objectivePattern: cleanText(value.fullReflection?.objectivePattern, 700),
      blindSpots: cleanText(value.fullReflection?.blindSpots, 700),
      recentDrift: cleanText(value.fullReflection?.recentDrift, 700),
      lessExploredAreas: cleanText(value.fullReflection?.lessExploredAreas, 700),
      nextDirection: cleanText(value.fullReflection?.nextDirection, 700),
      uncomfortableTruth: cleanText(value.fullReflection?.uncomfortableTruth, 700),
    },
  };
}

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const summary = cleanReflectionSummary(body);

  if (summary.totalAnswered < 15) {
    return json({ ok: false, error: "Reflection is locked until 15 answered questions." }, 403);
  }

  if (!env.AI) {
    return json({ ok: false, error: "Workers AI binding is not configured." }, 503);
  }

  try {
    const aiResult = await env.AI.run(MODEL, {
      prompt: buildPrompt(summary),
      max_tokens: 460,
      temperature: 0.45,
    });
    const reflection = cleanReflection(extractJsonObject(aiResult));
    if (
      !reflection.summary ||
      !reflection.fullReflection.objectivePattern ||
      !reflection.fullReflection.blindSpots ||
      !reflection.fullReflection.nextDirection
    ) {
      throw new Error("Workers AI returned an incomplete reflection.");
    }
    return json({
      ok: true,
      model: MODEL,
      reflection,
    });
  } catch (error) {
    console.error("Workers AI reflection failed:", error);
    return json({ ok: false, error: "Reflection generation failed." }, 502);
  }
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
