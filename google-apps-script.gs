/* =========================================================
   CSAT Survey — Google Apps Script backend
   This file lives INSIDE Google Sheets (Extensions > Apps Script).
   It does two jobs:
     1. doPost  -> saves a new survey response as a row
     2. doGet   -> returns summary stats + latest rows (for admin.html)
   ========================================================= */

const SHEET_NAME = "Responses"; // the tab name inside your Google Sheet

// Make sure the sheet has the right header row the first time it runs
function ensureSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getRange(1, 1).getValue() !== "Timestamp") {
    sheet.getRange(1, 1, 1, 7).setValues([
      ["Timestamp", "Rating", "Feedback", "Survey ID", "Ticket Number", "Agent Name", "Customer Name"]
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------- Handles new survey submissions from index.html ----------
function doPost(e) {
  try {
    const sheet = ensureSheet();
    const data = JSON.parse(e.postData.contents);

    const rating = (data.rating || "").toString().trim();
    const feedback = (data.feedback || "").toString().trim();
    const surveyId = (data.surveyId || "").toString().trim();
    const ticketNumber = (data.ticketNumber || "").toString().trim();
    const agentName = (data.agentName || "").toString().trim();
    const customerName = (data.customerName || "").toString().trim();

    sheet.appendRow([
      new Date(),
      rating,
      feedback,
      surveyId,
      ticketNumber,
      agentName,
      customerName
    ]);

    return jsonResponse({ status: "ok" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ---------- Handles dashboard data requests from admin.html ----------
function doGet(e) {
  try {
    const sheet = ensureSheet();
    const rows = sheet.getDataRange().getValues();
    rows.shift(); // remove header row

    let total = 0, excellent = 0, good = 0, okay = 0, poor = 0;
    const latest = [];

    rows.forEach(row => {
      const [timestamp, rating, feedback, surveyId, ticketNumber, agentName, customerName] = row;
      if (!rating) return;
      total++;
      if (rating === "Excellent") excellent++;
      else if (rating === "Good") good++;
      else if (rating === "Okay") okay++;
      else if (rating === "Poor") poor++;

      latest.push({
        timestamp: timestamp instanceof Date ? timestamp.toISOString() : timestamp,
        rating: rating,
        feedback: feedback,
        surveyId: surveyId,
        ticketNumber: ticketNumber,
        agentName: agentName,
        customerName: customerName
      });
    });

    // Most recent first, limit to 50 for the dashboard
    latest.reverse();
    const latestTrimmed = latest.slice(0, 50);

    const positive = excellent + good;
    const negative = okay + poor;
    const positivePct = total ? Math.round((positive / total) * 1000) / 10 : 0;
    const negativePct = total ? Math.round((negative / total) * 1000) / 10 : 0;

    return jsonResponse({
      status: "ok",
      total: total,
      excellent: excellent,
      good: good,
      okay: okay,
      poor: poor,
      positivePct: positivePct,
      negativePct: negativePct,
      latest: latestTrimmed
    });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
