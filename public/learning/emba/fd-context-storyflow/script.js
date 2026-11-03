const explanationCopy = {
  simple: {
    says: "Buying AI tools does not automatically make a company more productive. Teams also need to change how work is organised.",
    matters: "Businesses may spend heavily before the benefits become visible, which makes investment decisions harder.",
    uncertain: "The demo does not claim how long results will take or which companies will benefit most."
  },
  business: {
    says: "The article separates technology adoption from operational change. Productivity depends on data access, redesigned workflows, employee adoption, and reliable measurement.",
    matters: "Management must evaluate the total cost of implementation and the time required to translate isolated task improvements into company-level performance.",
    uncertain: "There is not enough verified evidence in this demo to compare returns across sectors, company sizes, or implementation models."
  },
  deep: {
    says: "The proposed mechanism is complementary investment: AI capability produces value only when organisations also change processes, governance, skills, and measurement systems.",
    matters: "This creates a timing gap between expenditure and measurable output. Selection effects and inconsistent baselines can make early productivity claims difficult to compare.",
    uncertain: "Causal attribution, distribution of gains, long-run organisational effects, and the durability of measured improvements require verified longitudinal evidence."
  }
};

const timelineData = [
  { date: "2023 · EXPECTATIONS RISE", title: "The business case begins with possibility.", summary: "Discussion centres on what generative AI could make faster, cheaper, or newly possible.", known: "Early tools showed promise in writing, research, and software work.", changed: "Companies moved from demonstrations into controlled pilots." },
  { date: "2024 · PILOTS MOVE INTO OPERATIONS", title: "Experimentation meets the operating model.", summary: "Attention shifts from impressive outputs to data access, governance, reliability, and employee use.", known: "Teams could identify high-potential tasks and build initial internal tools.", changed: "Scaling required process ownership and integration beyond the AI model itself." },
  { date: "2025 · WORKFLOW CONSTRAINTS EMERGE", title: "Adoption exposes the work around the tool.", summary: "Results become linked to workflow redesign, capability building, and consistent measurement.", known: "Task-level time savings could be observed in selected settings.", changed: "Company-wide gains proved harder to isolate and compare." },
  { date: "2026 · RETURNS TAKE FOCUS", title: "The question becomes measurable value.", summary: "Decision makers ask which implementations create durable gains and which add cost or complexity.", known: "Deployment alone is an incomplete measure of business value.", changed: "Evidence quality and operational outcomes move to the centre of the discussion." }
];

const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".tab-panel"));

function selectTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach((panel) => {
    const selected = panel.id === tab.getAttribute("aria-controls");
    panel.hidden = !selected;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      tabs[nextIndex].focus();
      selectTab(tabs[nextIndex]);
    }
  });
});

document.querySelectorAll(".depth-control button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".depth-control button").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    const copy = explanationCopy[button.dataset.depth];
    document.querySelector("#says-copy").textContent = copy.says;
    document.querySelector("#matters-copy").textContent = copy.matters;
    document.querySelector("#uncertain-copy").textContent = copy.uncertain;
  });
});

document.querySelectorAll(".timeline-node").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".timeline-node").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    const node = timelineData[Number(button.dataset.node)];
    document.querySelector("#timeline-date").textContent = node.date;
    document.querySelector("#timeline-title").textContent = node.title;
    document.querySelector("#timeline-summary").textContent = node.summary;
    document.querySelector("#known-copy").textContent = node.known;
    document.querySelector("#changed-copy").textContent = node.changed;
  });
});

const sourceToggle = document.querySelector(".source-toggle");
const sourceList = document.querySelector("#source-list");
sourceToggle.addEventListener("click", () => {
  const expanded = sourceToggle.getAttribute("aria-expanded") === "true";
  sourceToggle.setAttribute("aria-expanded", String(!expanded));
  sourceList.hidden = expanded;
  sourceToggle.innerHTML = expanded ? "Show source requirements <span aria-hidden=\"true\">+</span>" : "Hide source requirements <span aria-hidden=\"true\">−</span>";
});
