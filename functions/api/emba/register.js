function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function ensureRegistrationsTable(database) {
  if (!database) return;
  try {
    await database.prepare(
      `CREATE TABLE IF NOT EXISTS emba_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT,
        event_title TEXT,
        name TEXT,
        title TEXT,
        email TEXT,
        company TEXT,
        cohort_goal TEXT,
        emailed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`,
    ).run();
  } catch {
    // Table may already exist
  }
}

export async function onRequestPost({ request, env = {} }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const eventId = cleanText(body.eventId, 120);
  const eventTitle = cleanText(body.eventTitle, 240);
  const name = cleanText(body.name, 120);
  const title = cleanText(body.title, 120);
  const email = cleanText(body.email, 180).toLowerCase();
  const company = cleanText(body.company, 180);
  const cohortGoal = cleanText(body.cohortGoal, 1000);

  if (!email || !isValidEmail(email)) {
    return json({ ok: false, error: "A valid corporate email is required." }, 400);
  }
  if (!name) {
    return json({ ok: false, error: "Full name is required." }, 400);
  }

  let emailed = false;
  let emailError = null;

  // 1. If RESEND_API_KEY is available (in Cloudflare env or process.env), dispatch real email!
  const resendApiKey = env.RESEND_API_KEY || (typeof process !== "undefined" ? process?.env?.RESEND_API_KEY : "");
  if (resendApiKey) {
    const isClub = eventId === "flagship-the-club";
    const emailFrom = env.EMAIL_FROM || (typeof process !== "undefined" ? process?.env?.EMAIL_FROM : "") || "MapKAI Executive Academy <onboarding@resend.dev>";
    const adminEmail = env.ADMIN_EMAIL || (typeof process !== "undefined" ? process?.env?.ADMIN_EMAIL : "");

    const emailSubject = isClub
      ? `[fd. The Club] Executive Membership Application: ${name} (${company || 'Executive'})`
      : `[FD Academy Registration] Confirmed: ${eventTitle || 'Executive Session'} — ${name}`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #111827; font-size: 20px;">${isClub ? 'fd. The Club · Membership Application' : 'FD Academy · Executive Session Registration'}</h2>
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">Official Record &amp; RSVP Submission</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 140px;">Program / Event:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #111827;">${eventTitle || 'Executive Session'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Full Name:</td>
            <td style="padding: 8px 0; font-weight: bold; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Title:</td>
            <td style="padding: 8px 0; color: #111827;">${title || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Organization:</td>
            <td style="padding: 8px 0; color: #111827;">${company || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Corporate Email:</td>
            <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${cohortGoal ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Board Discussion Goal:</td>
            <td style="padding: 8px 0; color: #374151; line-height: 1.5;">${cohortGoal}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Submitted At:</td>
            <td style="padding: 8px 0; color: #6b7280;">${new Date().toISOString()}</td>
          </tr>
        </table>

        <div style="background: #f9fafb; border-left: 4px solid #ea580c; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; color: #4b5563;">
          ${isClub
            ? 'This application has been queued for peer review by the Admissions Secretariat of fd. The Club in Amsterdam.'
            : 'Your seat reservation has been recorded. A calendar invitation (.ics) and foundational reading monograph will be coordinated.'}
        </div>

        <p style="margin: 0; font-size: 11px; color: #9ca3af; text-align: center;">
          MapKAI × FD Academy of Management &amp; Technology · Amsterdam, Netherlands
        </p>
      </div>
    `;

    try {
      const recipients = adminEmail ? [email, adminEmail] : [email];
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: recipients,
          subject: emailSubject,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        emailed = true;
      } else {
        emailError = await res.text();
        console.error("Resend API response:", emailError);
      }
    } catch (err) {
      emailError = String(err);
      console.error("Failed to send email via Resend:", err);
    }
  }

  // 2. If Cloudflare D1 database is available, persist the registration
  if (env.MAPKAI_DB) {
    try {
      await ensureRegistrationsTable(env.MAPKAI_DB);
      await env.MAPKAI_DB.prepare(
        `INSERT INTO emba_registrations (event_id, event_title, name, title, email, company, cohort_goal, emailed, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        eventId,
        eventTitle,
        name,
        title,
        email,
        company,
        cohortGoal,
        emailed ? 1 : 0,
        new Date().toISOString()
      ).run();
    } catch (dbErr) {
      console.error("Database persistence error:", dbErr);
    }
  }

  return json({
    ok: true,
    eventId,
    name,
    email,
    emailed,
    emailError: emailError ? "Notice logged" : undefined,
    message: "Registration successfully recorded."
  });
}

export function onRequestGet() {
  return json({ error: "Method not allowed. Use POST to register." }, 405);
}
