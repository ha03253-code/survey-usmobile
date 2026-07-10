/* =========================================================
   CSAT Dashboard — admin.js
   Fetches stats from the same Google Apps Script Web App
   used by the survey page, then renders them.
   ========================================================= */

// PASTE THE SAME GOOGLE APPS SCRIPT WEB APP URL YOU USED IN script.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyClpyyz-OctfBpteR8ndDEE7YuwjQ7fpiB5cw1HwF5ZhWu_475UIuUZjEzhVhvWe8qCw/exec";

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const dashboard = document.getElementById("dashboard");
const refreshBtn = document.getElementById("refreshBtn");
const latestBody = document.getElementById("latestBody");

const EMOJI_MAP = {
  Excellent: "😀",
  Good: "🙂",
  Okay: "😐",
  Poor: "🙁"
};

function loadDashboard() {
  loadingState.classList.remove("hidden");
  errorState.classList.add("hidden");
  dashboard.classList.add("hidden");

  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "ok") throw new Error(data.message || "Unknown error");
      renderDashboard(data);
      loadingState.classList.add("hidden");
      dashboard.classList.remove("hidden");
    })
    .catch(() => {
      loadingState.classList.add("hidden");
      errorState.classList.remove("hidden");
    });
}

function renderDashboard(data) {
  document.getElementById("statTotal").textContent = data.total;
  document.getElementById("statExcellent").textContent = data.excellent;
  document.getElementById("statGood").textContent = data.good;
  document.getElementById("statOkay").textContent = data.okay;
  document.getElementById("statPoor").textContent = data.poor;
  document.getElementById("statPositive").textContent = data.positivePct + "%";
  document.getElementById("statNegative").textContent = data.negativePct + "%";

  latestBody.innerHTML = "";
  data.latest.forEach(row => {
    const tr = document.createElement("tr");

    const dateCell = document.createElement("td");
    const date = new Date(row.timestamp);
    dateCell.textContent = isNaN(date.getTime())
      ? row.timestamp
      : date.toLocaleString();

    const ratingCell = document.createElement("td");
    ratingCell.textContent = `${EMOJI_MAP[row.rating] || ""} ${row.rating}`;

    const feedbackCell = document.createElement("td");
    feedbackCell.className = "feedback-cell";
    feedbackCell.textContent = row.feedback || "—";

    const ticketCell = document.createElement("td");
    ticketCell.textContent = row.ticketNumber || "—";

    const agentCell = document.createElement("td");
    agentCell.textContent = row.agentName || "—";

    const customerCell = document.createElement("td");
    customerCell.textContent = row.customerName || "—";

    tr.append(dateCell, ratingCell, feedbackCell, ticketCell, agentCell, customerCell);
    latestBody.appendChild(tr);
  });
}

refreshBtn.addEventListener("click", loadDashboard);

loadDashboard();
