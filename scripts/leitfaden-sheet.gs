/**
 * Google Apps Script — Leitfaden sheet webhook
 * ============================================
 *
 * Deploy this bound to the Google Sheet you want to receive rows in.
 * The Next.js route src/app/api/leitfaden/subscribe/route.ts POSTs to
 * this script's /exec URL after each successful lead-magnet download.
 *
 * DEPLOYMENT (~2 minutes, done once):
 *
 *   1. Open the target sheet
 *      → https://docs.google.com/spreadsheets/d/1jBsRniEI3_voHYr_u2dToupdRg4zwZupbNWOiXjDyto/
 *   2. Menu: Extensions → Apps Script
 *   3. Paste this whole file into `Code.gs` (replace whatever's there).
 *   4. Deploy → New deployment
 *      - Select type: Web app
 *      - Description: "Leitfaden intake"
 *      - Execute as: Me (design@tylotech.de)
 *      - Who has access: Anyone
 *      → Deploy
 *   5. Copy the Web app URL (ends in /exec) — paste it into Vercel env:
 *        LEITFADEN_SHEET_WEBHOOK_URL=<that url>
 *   6. Redeploy the Vercel project.
 *
 * COLUMNS the script writes (row-1 header is created on first run):
 *   A  Zeitstempel        e.g. 2026-08-18 14:23:04
 *   B  Vorname            Max
 *   C  Telefon            '+491701234567    (leading ' keeps it as text)
 *   D  E-Mail             max@firma.de
 *   E  Landing Page       Leitfaden Rollenspiel
 *   F  Seiten-URL         https://selmir-suljkanovic.de/leitfaden
 *
 * Extra fields the payload sends (company, decisionMaker, submittedAt) are
 * ignored — they're only there so this same POST body works against the
 * legacy potenzialanalyse Apps Script as a fallback.
 */

/** Sheet tab that holds the rows. Change here if you rename the tab. */
var TAB_NAME = 'Leitfaden';

var HEADERS = [
  'Zeitstempel',
  'Vorname',
  'Telefon',
  'E-Mail',
  'Landing Page',
  'Seiten-URL',
];

/** HTTP entry point — called by the Next.js /api/leitfaden/subscribe route. */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var sheet = getOrCreateTab_();
    ensureHeader_(sheet);

    // Strip the leading ' the server prepended (keeps it as text in Sheets)
    var phone = String(body.phone || '');
    if (phone.charAt(0) === "'") phone = phone.slice(1);

    var row = [
      new Date(),
      body.name || '',
      phone,
      body.email || '',
      body.landingPage || 'Leitfaden Rollenspiel',
      body.pageUrl || '',
    ];
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, reason: String(err && err.message || err) });
  }
}

/** Health-check the deployment: GET the /exec URL and expect {ok:true}. */
function doGet() {
  return json_({ ok: true, note: 'leitfaden-sheet webhook alive' });
}

function getOrCreateTab_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(TAB_NAME);
  if (!s) s = ss.insertSheet(TAB_NAME);
  return s;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Reasonable column widths
    sheet.setColumnWidth(1, 160); // Zeitstempel
    sheet.setColumnWidth(2, 140); // Vorname
    sheet.setColumnWidth(3, 160); // Telefon
    sheet.setColumnWidth(4, 240); // E-Mail
    sheet.setColumnWidth(5, 200); // Landing Page
    sheet.setColumnWidth(6, 320); // Seiten-URL
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
