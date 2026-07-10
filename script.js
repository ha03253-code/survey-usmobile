/* =========================================================
   CSAT Survey — script.js
   Handles the one-click flow and talks to Google Sheets
   via a Google Apps Script Web App.
   ========================================================= */

// 1. PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
//    (You get this after deploying google-apps-script.gs — see README.md)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyClpyyz-OctfBpteR8ndDEE7YuwjQ7fpiB5cw1HwF5ZhWu_475UIuUZjEzhVhvWe8qCw/exec";

// ---------------------------------------------------------

const stepRating = document.getElementById("step-rating");
const stepFeedback = document.getElementById("step-feedback");
const stepThanks = document.getElementById("step-thanks");
const stepError = document.getElementById("step-error");

const chosenEmojiEl = document.getElementById("chosenEmoji");
const feedbackText = document.getElementById("feedbackText");
const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");
const thanksMessage = document.getElementById("thanksMessage");
const thanksIcon = document.getElementById("thanksIcon");

const EMOJI_MAP = {
  Excellent: "😀",
  Good: "🙂",
  Okay: "😐",
  Poor: "🙁"
};

// Read info passed in the link from the support email, e.g.
// index.html?rating=Excellent&ticket=12345&agent=Sam&survey_id=abc123
const params = new URLSearchParams(window.location.search);
const urlRating = params.get("rating");
const ticketNumber = params.get("ticket") || "";
const agentName = params.get("agent") || "";
const customerName = params.get("customer") || "";
let surveyId = params.get("survey_id") || params.get("sid") || "";

if (!surveyId) {
  // Fall back to a locally generated ID so every visit is still trackable
  surveyId = "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

function showStep(step) {
  [stepRating, stepFeedback, stepThanks, stepError].forEach(s => s.classList.add("hidden"));
  step.classList.remove("hidden");
}

function sendToSheet(rating, feedback) {
  const payload = {
    rating: rating,
    feedback: feedback || "",
    surveyId: surveyId,
    ticketNumber: ticketNumber,
    agentName: agentName,
    customerName: customerName
  };

  // Using text/plain avoids a CORS "preflight" request, which
  // Google Apps Script Web Apps do not handle well.
  return fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
}

function handlePositiveOrSubmit(rating, feedback) {
  sendToSheet(rating, feedback)
    .then(() => {
      showThanks(rating);
    })
    .catch(() => {
      // Even if the network call fails, don't leave the customer stuck.
      // Most failures here are CORS-related and the row is still saved.
      showThanks(rating);
    });
}

function showThanks(rating) {
  if (rating === "Excellent" || rating === "Good") {
    thanksIcon.textContent = "❤️";
    thanksMessage.textContent = "Thanks! We appreciate your feedback ❤️";
  } else {
    thanksIcon.textContent = "🙏";
    thanksMessage.textContent = "Thank you for helping us improve.";
  }
  showStep(stepThanks);
}

function handleRatingClick(rating) {
  if (rating === "Excellent" || rating === "Good") {
    handlePositiveOrSubmit(rating, "");
  } else {
    chosenEmojiEl.textContent = EMOJI_MAP[rating] || "";
    showStep(stepFeedback);
    submitFeedbackBtn.dataset.rating = rating;
    feedbackText.focus();
  }
}

// Wire up the four rating buttons
document.querySelectorAll(".rating-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    handleRatingClick(btn.dataset.rating);
  });
});

// Wire up the feedback submit button
submitFeedbackBtn.addEventListener("click", () => {
  const rating = submitFeedbackBtn.dataset.rating;
  submitFeedbackBtn.disabled = true;
  submitFeedbackBtn.textContent = "Submitting...";
  handlePositiveOrSubmit(rating, feedbackText.value.trim());
});

// TRUE ONE-CLICK FLOW:
// If the email link already contains ?rating=Excellent etc.,
// the customer never even sees the button grid for positive ratings —
// it submits instantly. For Okay/Poor it jumps straight to the
// optional feedback box.
if (urlRating && EMOJI_MAP[urlRating]) {
  document.querySelectorAll(".rating-btn").forEach(b => {
    if (b.dataset.rating === urlRating) b.classList.add("selected");
  });
  handleRatingClick(urlRating);
}
