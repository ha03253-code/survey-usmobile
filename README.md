# One-Click CSAT Survey for Zendesk

A free, one-click customer satisfaction survey that replaces Zendesk's native CSAT email.
Customers click one emoji in your closing support email — no login, no extra page loads, no ads.

Responses are saved to a Google Sheet (free database), and a simple dashboard shows you the results.

**Cost: $0.** Everything runs on free services: Google Sheets, Google Apps Script, and GitHub Pages (or Netlify/Vercel).

---

## What's in this folder

```
csat-survey/
├── index.html            → The survey page customers see (the emoji + feedback box)
├── style.css             → All the visual styling for index.html and admin.html
├── script.js             → The logic that saves a rating and shows "Thank you"
├── admin.html            → Your private dashboard page
├── admin-style.css        → Extra styling just for the dashboard
├── admin.js              → The logic that loads your stats from Google Sheets
├── google-apps-script.gs → The backend code that goes INSIDE Google Sheets
├── assets/                → Put your logo image here (logo.png)
└── README.md             → This file
```

You do not need to install anything on your computer. Everything is copy-pasted into free websites.

---

## Overview of how it works

1. Your Google Sheet has a script attached to it (Google Apps Script). That script can receive data and write it into rows, and can also report back stats.
2. Your website (`index.html`) is just a plain webpage. When a customer clicks an emoji, the page sends that rating to your Google Apps Script, which saves it to the Sheet.
3. Your dashboard (`admin.html`) asks the same script for the totals and shows them to you.
4. You host the webpage files for free on GitHub Pages (recommended) so they have a real web address you can link to from Zendesk.

---

## Step 1 — Create the Google Sheet (your free database)

1. Go to [sheets.google.com](https://sheets.google.com) and click **Blank** to create a new spreadsheet.
2. Rename it to something like **CSAT Responses** (click the title top-left).
3. You don't need to type any column headers yourself — the script will create them automatically the first time it runs. But if you want, you can manually add this header row to Row 1:
   `Timestamp | Rating | Feedback | Survey ID | Ticket Number | Agent Name`
4. Leave this tab open — you'll come back to it.

---

## Step 2 — Add the Google Apps Script (the backend)

1. In your Google Sheet, click **Extensions** in the top menu → **Apps Script**. A new tab opens with a code editor.
2. Delete any code that's already there (it usually says `function myFunction() {}`).
3. Open the file **`google-apps-script.gs`** from this project, select all the text, copy it, and paste it into the Apps Script editor.
4. Click the **Save** icon (or press Ctrl+S / Cmd+S).
5. Rename the project at the top (where it says "Untitled project") to **CSAT Backend**.

### Now deploy it as a "Web App" so your website can talk to it:

6. Click the blue **Deploy** button (top right) → **New deployment**.
7. Click the gear icon ⚙️ next to "Select type" → choose **Web app**.
8. Fill in:
   - **Description**: CSAT Survey Backend
   - **Execute as**: Me
   - **Who has access**: **Anyone** (this is important — it must be "Anyone", not "Anyone with Google account", so customers without Google logins can submit responses)
9. Click **Deploy**.
10. Google will ask you to **Authorize access** the first time. Click through:
    - "Authorize access" → choose your Google account
    - You may see a warning screen "Google hasn't verified this app" — this is normal for your own scripts. Click **Advanced** → **Go to CSAT Backend (unsafe)** → **Allow**.
11. After deploying, Google shows you a **Web app URL**. It looks like:
    `https://script.google.com/macros/s/AKfycbx.../exec`
12. **Copy this URL.** You will paste it into two files in Step 4.

> 💡 If you ever edit `google-apps-script.gs` again later, you must click **Deploy → Manage deployments → Edit (pencil icon) → New version → Deploy** for your changes to go live. Just saving the file is not enough.

---

## Step 3 — Add your logo (optional)

1. Find a small logo image (PNG with a transparent background works best, ideally under 200px tall).
2. Rename it to `logo.png`.
3. Place it inside the `assets` folder in this project, replacing nothing (the folder is currently empty except a placeholder file).
4. If you don't add a logo, the page simply won't show one — nothing breaks.

---

## Step 4 — Connect your website to your Google Sheet

You need to paste your Web App URL (from Step 2) into **two** files:

1. Open **`script.js`** in any text editor (Notepad, TextEdit, or directly on GitHub — explained below).
2. Find this line near the top:
   ```javascript
   const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the text between the quotes with your actual URL, so it looks like:
   ```javascript
   const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
4. Save the file.
5. Open **`admin.js`** and do the exact same thing — replace the placeholder with the same URL.
6. Save the file.

---

## Step 5 — Publish the website for free (GitHub Pages)

GitHub Pages is the easiest free option and doesn't require a credit card.

1. Go to [github.com](https://github.com) and create a free account if you don't have one.
2. Click the **+** icon top-right → **New repository**.
3. Name it `csat-survey` (or anything you like). Set it to **Public**. Click **Create repository**.
4. On the new repository page, click **uploading an existing file**.
5. Drag in every file and folder from this project (`index.html`, `style.css`, `script.js`, `admin.html`, `admin-style.css`, `admin.js`, `google-apps-script.gs`, `README.md`, and the `assets` folder with your logo inside it).
6. Scroll down and click **Commit changes**.
7. Go to the repository's **Settings** tab → **Pages** (left sidebar).
8. Under "Build and deployment" → **Source**, choose **Deploy from a branch**.
9. Under "Branch", choose **main** and folder **/ (root)**, then click **Save**.
10. Wait about 1–2 minutes, then refresh the page. GitHub will show you your live web address, like:
    `https://yourusername.github.io/csat-survey/`

Your survey page is now live at:
`https://yourusername.github.io/csat-survey/index.html`

Your dashboard is now live at:
`https://yourusername.github.io/csat-survey/admin.html`

> ⚠️ Note: `admin.html` is not password-protected — anyone with the link can view it. Keep the link private, and don't post it publicly. (See "Going further" below if you want a password.)

---

## Step 6 — Test it

1. Open your survey link in a browser:
   `https://yourusername.github.io/csat-survey/index.html`
2. Click **😀 Excellent**. You should immediately see "Thanks! We appreciate your feedback ❤️".
3. Open your Google Sheet — a new row should appear within a few seconds (you may need to refresh the Sheet).
4. Go back to the survey link, click **🙁 Poor**, type a sentence, and click **Submit**. Check the Sheet again for the feedback text.
5. Open your dashboard link:
   `https://yourusername.github.io/csat-survey/admin.html`
   You should see your two test responses counted in the stats and listed under "Latest Responses".

If something doesn't work, see **Troubleshooting** at the bottom.

---

## Step 7 — Add the survey link to your Zendesk closing email

In Zendesk Admin Center, go to **Objects and rules → Business rules → Triggers**, and edit (or create) the trigger that fires when a ticket is set to **Solved**. Add this HTML to the email notification action:

```html
<p>How did we do today?</p>
<p>
  <a href="https://yourusername.github.io/csat-survey/index.html?rating=Excellent&ticket={{ticket.id}}&agent={{ticket.assignee.name}}">😀 Excellent</a>
  &nbsp;&nbsp;
  <a href="https://yourusername.github.io/csat-survey/index.html?rating=Good&ticket={{ticket.id}}&agent={{ticket.assignee.name}}">🙂 Good</a>
  &nbsp;&nbsp;
  <a href="https://yourusername.github.io/csat-survey/index.html?rating=Okay&ticket={{ticket.id}}&agent={{ticket.assignee.name}}">😐 Okay</a>
  &nbsp;&nbsp;
  <a href="https://yourusername.github.io/csat-survey/index.html?rating=Poor&ticket={{ticket.id}}&agent={{ticket.assignee.name}}">🙁 Poor</a>
</p>
```

**Why this works as "one click":** each link already contains the rating (`?rating=Excellent`). When the customer clicks 😀 or 🙂, the page saves the response **instantly** the moment it loads — they never have to click anything a second time. If they click 😐 or 🙁, the page opens straight to the optional feedback box.

Replace `yourusername` with your actual GitHub username, and adjust `{{ticket.id}}` / `{{ticket.assignee.name}}` to match Zendesk's placeholder syntax for your account (check Zendesk's placeholder list under the trigger editor — these are the standard ones).

---

## Step 8 — Start collecting responses

That's it. Once the trigger is live:

- Every solved ticket sends an email with four one-click links.
- Every click is saved to your Google Sheet automatically.
- You check `admin.html` any time to see your stats.

---

## Editing colors and text

Open **`style.css`**. Near the top you'll see:

```css
:root {
  --color-accent: #1d72e8;   /* change this hex code to your brand color */
  ...
}
```

Change `#1d72e8` to any hex color code (e.g. `#16a34a` for green). This updates the button, links, and highlights everywhere.

To change wording, open **`index.html`** and edit the plain text between the tags, for example:

```html
<h1 class="title">How did we do today?</h1>
```

Change the words between `<h1 class="title">` and `</h1>` to whatever you like. Do the same for any other line of text — just don't delete the `<...>` tags around it.

---

## Adding your own logo

1. Save your logo as `logo.png` (PNG works best).
2. Upload it into the `assets` folder of your GitHub repository (or drag it in locally before uploading).
3. Refresh your survey page — the logo will appear automatically at the top of the card. If you don't add one, the space is simply skipped.

---

## Troubleshooting

**"Couldn't load data" on the dashboard**
- Double check you pasted the Web App URL correctly into `admin.js` (no extra spaces, ends in `/exec`).
- Make sure the Apps Script deployment's access is set to **Anyone**, not "Anyone with Google account."

**Clicking an emoji doesn't save a row**
- Same check as above, but for `script.js`.
- Make sure you redeployed the Apps Script after any edits (Deploy → Manage deployments → New version).

**The page loads but nothing happens after I click**
- Open your browser's developer console (right-click → Inspect → Console tab) and look for red error text — it usually names the problem directly.

**I edited the .gs file and nothing changed**
- You must create a **new version** of the deployment for changes to take effect (see the tip at the end of Step 2).

---

## Going further (optional ideas)

- **Password-protect the dashboard**: Since this is a static site, true password protection requires a small backend. The simplest free option is to keep the `admin.html` link private and unlisted, or use Netlify's free built-in password-protection feature for a single page if you switch hosting to Netlify.
- **Charts**: You could add a free charting library like Chart.js to `admin.html` for visual graphs instead of numbers — ask for this as a follow-up and it can be added.
- **Email alerts on "Poor" ratings**: Apps Script can send you an email automatically when a Poor rating comes in — also possible as a follow-up addition.

---

You're done! Your one-click CSAT system is live, free, and collecting real feedback.
