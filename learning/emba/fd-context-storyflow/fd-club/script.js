const clubFilm = document.querySelector(".film-section video");
if (clubFilm) {
  clubFilm.defaultPlaybackRate = 1.15;
  clubFilm.playbackRate = 1.15;
}

const interestForm = document.querySelector("#interest-form");
const formStatus = document.querySelector("#form-status");
const submitButton = interestForm?.querySelector("[type=submit]");
const submissionResult = document.querySelector("#submission-result");
const submissionMessage = document.querySelector("#submission-message");

function setFormStatus(message, state = "error") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

interestForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!interestForm.reportValidity() || !submitButton) return;

  const values = new FormData(interestForm);
  const payload = {
    eventId: "flagship-the-club",
    eventTitle: "fd. The Club · Expression of Interest",
    name: String(values.get("name") || "").trim(),
    title: String(values.get("title") || "").trim(),
    company: String(values.get("company") || "").trim(),
    email: String(values.get("email") || "").trim(),
    strategicChallenge: String(values.get("strategicChallenge") || "").trim(),
    contribution: String(values.get("contribution") || "").trim()
  };

  submitButton.disabled = true;
  submitButton.setAttribute("aria-busy", "true");
  submitButton.textContent = "Submitting…";
  setFormStatus("Submitting your expression of interest…", "loading");

  let saved = false;
  try {
    const response = await fetch("/api/emba/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => null);

    if (!response.ok || result?.ok !== true || result?.saved !== true) {
      if (result?.demo === true || result?.code === "SERVICE_NOT_CONFIGURED") {
        setFormStatus("Demo mode: the application service is not configured in this preview. Your information has not been sent or stored. Your answers are still here; please retry when the service is available.");
      } else {
        setFormStatus("We could not save your expression of interest. Your information has not been accepted, and your answers are still here. Please try again.");
      }
      return;
    }

    saved = true;
    const notification = result.notification?.status;
    if (notification === "sent") {
      submissionMessage.textContent = "A receipt email was accepted for sending. This confirms receipt only; it is not an invitation or membership approval.";
    } else if (notification === "failed") {
      submissionMessage.textContent = "Your expression was saved, but the receipt notification could not be sent. The saved submission remains received. This is not an invitation or membership approval.";
    } else {
      submissionMessage.textContent = "Your expression was saved. Email notifications are not configured. This is not an invitation or membership approval.";
    }

    interestForm.hidden = true;
    submissionResult.hidden = false;
    setFormStatus("", "success");
    submissionResult.scrollIntoView({ block: "nearest", behavior: "smooth" });
  } catch {
    setFormStatus("The application service could not be reached. Nothing was confirmed as saved; your answers are still here. Please try again when the service is available.");
  } finally {
    if (!saved) {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.textContent = "Submit expression of interest";
    }
  }
});
