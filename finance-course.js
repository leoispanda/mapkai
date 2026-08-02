const progressKey = "mapkaiFinanceProgress";
const language = document.body.dataset.language === "zh" ? "zh" : "en";
const day = Number(document.querySelector("[data-course-day]")?.dataset.courseDay || 0);
const toast = document.querySelector(".finance-toast");

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(progressKey) || "{}");
    return {
      visitedDays: Array.isArray(value.visitedDays) ? value.visitedDays : [],
      completedDays: Array.isArray(value.completedDays) ? value.completedDays : [],
      lastVisitedDay: Number(value.lastVisitedDay || 0),
      updatedAt: value.updatedAt || "",
    };
  } catch {
    return { visitedDays: [], completedDays: [], lastVisitedDay: 0, updatedAt: "" };
  }
}

function saveProgress(progress) {
  progress.updatedAt = new Date().toISOString();
  localStorage.setItem(progressKey, JSON.stringify(progress));
}

function notify(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => { toast.hidden = true; }, 3200);
}

function track(event, detail = {}) {
  const allowed = new Set(["finance_course_viewed", "finance_day_started", "finance_day_completed", "finance_course_completed", "pdc_clicked_after_course"]);
  if (!allowed.has(event)) return;
  const body = JSON.stringify({ event, day: day || undefined, language, ...detail });
  if (navigator.sendBeacon) navigator.sendBeacon("/api/course-event", new Blob([body], { type: "application/json" }));
  else fetch("/api/course-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
}

function initOverview() {
  const root = document.querySelector("[data-course-overview]");
  if (!root) return;
  const progress = readProgress();
  const complete = [...new Set(progress.completedDays)].filter((value) => value >= 1 && value <= 5);
  const nextDay = [1, 2, 3, 4, 5].find((value) => !complete.includes(value));
  root.querySelector("[data-course-progress]").textContent = language === "zh" ? `已完成 ${complete.length}/5 天` : `${complete.length} of 5 days completed`;
  const continueLink = root.querySelector("[data-course-continue]");
  if ((progress.lastVisitedDay || complete.length) && nextDay && continueLink) {
    continueLink.hidden = false;
    continueLink.href = `${language === "zh" ? "/zh" : ""}/learning/corporate-finance/day-${nextDay}`;
    continueLink.textContent = language === "zh" ? `继续第 ${nextDay} 天` : `Continue Day ${nextDay}`;
  }
  if (complete.length === 5) root.querySelector("[data-course-start]").textContent = language === "zh" ? "回顾课程" : "Review the Course";
  root.querySelectorAll("[data-course-day-card]").forEach((card) => {
    const cardDay = Number(card.dataset.courseDayCard);
    const status = card.querySelector("[data-day-status]");
    const link = card.querySelector("a");
    if (complete.includes(cardDay)) {
      card.classList.add("is-complete");
      status.textContent = language === "zh" ? "已完成" : "Completed";
      link.textContent = language === "zh" ? "复习" : "Review";
    } else if (progress.visitedDays.includes(cardDay)) {
      status.textContent = language === "zh" ? "继续" : "Continue";
      link.textContent = language === "zh" ? `继续第 ${cardDay} 天` : `Continue Day ${cardDay}`;
    }
  });
  track("finance_course_viewed");
}

function initDay() {
  if (!day) return;
  const progress = readProgress();
  if (!progress.visitedDays.includes(day)) progress.visitedDays.push(day);
  progress.lastVisitedDay = day;
  saveProgress(progress);
  track("finance_day_started");
  const button = document.querySelector("[data-mark-complete]");
  if (progress.completedDays.includes(day)) {
    button.textContent = language === "zh" ? "已完成" : "Completed";
    button.classList.add("is-complete");
  }
  button?.addEventListener("click", () => {
    const next = readProgress();
    if (!next.completedDays.includes(day)) next.completedDays.push(day);
    next.lastVisitedDay = day;
    saveProgress(next);
    button.textContent = language === "zh" ? "已完成" : "Completed";
    button.classList.add("is-complete");
    notify(language === "zh" ? `第 ${day} 天已完成，进度已保存在当前设备。` : `Day ${day} completed. Your progress is saved on this device.`);
    track("finance_day_completed");
    if (next.completedDays.length === 5) track("finance_course_completed");
  });
}

function initModes() {
  document.querySelectorAll("[data-content-mode]").forEach((button) => button.addEventListener("click", () => {
    const mode = button.dataset.contentMode;
    document.querySelectorAll("[data-content-mode]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-mode-panel]").forEach((panel) => { panel.hidden = panel.dataset.modePanel !== mode; });
  }));
}

function initChecks() {
  document.querySelectorAll("[data-check-answer]").forEach((button) => button.addEventListener("click", () => {
    const panel = button.closest(".finance-knowledge-check");
    panel.querySelectorAll("button").forEach((item) => item.classList.remove("is-correct", "is-wrong"));
    button.classList.add(button.dataset.checkAnswer === "true" ? "is-correct" : "is-wrong");
    panel.querySelector("[data-check-result]").hidden = false;
  }));
}

function initChrome() {
  localStorage.setItem("mapkaiLanguageV2", language);
  const menuButton = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-panel");
  menuButton?.addEventListener("click", () => {
    const open = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });
  const currentTheme = localStorage.getItem("mapkaiTheme") === "dark" ? "dark" : "light";
  document.body.dataset.theme = currentTheme;
  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === currentTheme));
    button.addEventListener("click", () => {
      localStorage.setItem("mapkaiTheme", button.dataset.themeOption);
      document.body.dataset.theme = button.dataset.themeOption;
      document.querySelectorAll("[data-theme-option]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    });
  });
}

document.querySelectorAll("[data-course-event]").forEach((target) => target.addEventListener("click", () => track(target.dataset.courseEvent)));
initChrome();
initOverview();
initDay();
initModes();
initChecks();
