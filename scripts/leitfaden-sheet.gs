/**
 * Google Apps Script — unified sheet router
 * ==========================================
 *
 * Deploy this bound to the "Meta Ads Leads" sheet.
 * Every POST from the Next.js app is routed by payload:
 *
 *   • Potenzialanalyse / LP forms  → Sheet1  (the existing tab)
 *       (payload has `company` and `decisionMaker`, no `email`)
 *   • Leitfaden lead magnet        → Sheet2  (new tab)
 *       (payload has `email`, or `formType: "leitfaden"`)
 *
 * Both tabs share the same 7-column header so downstream reports stay
 * consistent:
 *
 *   A Zeitstempel   B Name   C Telefonnummer   D Firma / Betrieb
 *   E Inhaber / Entscheider   F Landingpage   G Seiten-URL
 *
 * Leitfaden rows do not have "Firma" or "Inhaber" data, so:
 *   - Firma / Betrieb          → the E-Mail address (Leitfaden's key identifier)
 *   - Inhaber / Entscheider    → left blank
 *   - Landingpage              → "Leitfaden Rollenspiel" (marks the row's origin)
 *
 * DEPLOYMENT (~2 minutes):
 *   1. Open the "Meta Ads Leads" sheet.
 *   2. Extensions → Apps Script.
 *   3. Replace Code.gs with this file.
 *   4. If the existing deployment is at
 *        https://script.google.com/macros/s/AKfycbzyCReYrLxFN95sNd5hmHtHl8Uk4XVpPzwR5g4CJgj6y673LtsKKFe2lzRQwaM_QtM2/exec
 *      then: Deploy → Manage deployments → pencil-edit that deployment →
 *      Version: "New version" → Deploy. The URL stays the same, so no
 *      env-var update needed.
 *   5. If you want a brand-new URL: Deploy → New deployment → Web app →
 *      Execute as "Me", Access "Anyone" → Deploy. Paste the new /exec URL
 *      into Vercel as GOOGLE_SHEET_WEBHOOK_URL and redeploy.
 */

// Tab names — change here if you rename the tabs in the sheet.
var TAB_LP = 'Sheet1';        // potenzialanalyse / meta-ads / LP forms
var TAB_LEITFADEN = 'Sheet2'; // leitfaden lead magnet

var HEADERS = [
  'Zeitstempel',
  'Name',
  'Telefonnummer',
  'Firma / Betrieb',
  'Inhaber / Entscheider',
  'Landingpage',
  'Seiten-URL',
];

/** HTTP entry point. */
function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var isLeitfaden =
      body.formType === 'leitfaden' ||
      body.landingPage === 'Leitfaden Rollenspiel' ||
      (body.email && !body.company);

    var tabName = isLeitfaden ? TAB_LEITFADEN : TAB_LP;
    var sheet = getOrCreateTab_(tabName);
    ensureHeader_(sheet);

    // Sheets treats a leading + as a formula, so the server prefixes the
    // phone with ' — strip it back off for display.
    var phone = String(body.phone || '');
    if (phone.charAt(0) === "'") phone = phone.slice(1);

    // Column mapping depends on the source form.
    var row;
    if (isLeitfaden) {
      row = [
        new Date(),                                    // Zeitstempel
        body.name || '',                               // Name
        phone,                                         // Telefonnummer
        body.email || '',                              // Firma / Betrieb  (E-Mail placeholder)
        '',                                            // Inhaber / Entscheider
        body.landingPage || 'Leitfaden Rollenspiel',   // Landingpage
        body.pageUrl || '',                            // Seiten-URL
      ];
    } else {
      row = [
        new Date(),                    // Zeitstempel
        body.name || '',               // Name
        phone,                         // Telefonnummer
        body.company || '',            // Firma / Betrieb
        body.decisionMaker || '',      // Inhaber / Entscheider
        body.landingPage || '',        // Landingpage
        body.pageUrl || '',            // Seiten-URL
      ];
    }

    sheet.appendRow(row);
    return json_({ ok: true, tab: tabName });
  } catch (err) {
    return json_({ ok: false, reason: String((err && err.message) || err) });
  }
}

/** Health-check the deployment: GET the /exec URL and expect {ok:true}. */
function doGet() {
  return json_({ ok: true, note: 'leads-router webhook alive' });
}

function getOrCreateTab_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(name);
  if (!s) s = ss.insertSheet(name);
  return s;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160); // Zeitstempel
    sheet.setColumnWidth(2, 160); // Name
    sheet.setColumnWidth(3, 160); // Telefonnummer
    sheet.setColumnWidth(4, 260); // Firma / Betrieb
    sheet.setColumnWidth(5, 180); // Inhaber / Entscheider
    sheet.setColumnWidth(6, 260); // Landingpage
    sheet.setColumnWidth(7, 340); // Seiten-URL
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
