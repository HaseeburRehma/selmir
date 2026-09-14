/**
 * Google Apps Script — unified sheet router
 * ==========================================
 *
 * Deploy this bound to the "Meta Ads Leads" sheet.
 * Every POST from the Next.js app is routed by payload:
 *
 *   • Potenzialanalyse / LP forms       → Sheet1  (the existing tab)
 *       (payload has `company` and `decisionMaker`, no `email`)
 *   • Leitfaden lead magnet             → Sheet2
 *       (payload has `formType: "leitfaden"`)
 *   • Site-wide Kontaktformular         → Sheet3
 *       (payload has `formType: "kontakt"`)
 *   • Handwerker-Painpoints Kampagne    → Sheet4  (new tab)
 *       (payload has `formType: "painpoints"`)
 *
 * Sheet1 + Sheet2 share the same 7-column header:
 *   A Zeitstempel   B Name   C Telefonnummer   D Firma / Betrieb
 *   E Inhaber / Entscheider   F Landingpage   G Seiten-URL
 *
 * Sheet3 (Kontakt) uses its own 7-column header — the form collects
 * email + subject + free-text message, no company:
 *   A Zeitstempel   B Name   C Telefonnummer   D E-Mail
 *   E Betreff       F Nachricht                G Seiten-URL
 *
 * Sheet4 (Handwerker-Painpoints) uses its own 10-column header — the
 * form collects Vorname + Nachname + Telefon + E-Mail + the Ja/Nein
 * "Gefällt dir die Website?" answer, plus the campaign's UTM source /
 * campaign so ad-spend attribution stays in the same tab as the lead:
 *   A Zeitstempel   B Vorname          C Nachname   D Telefonnummer
 *   E E-Mail        F Website gefällt  G Landingpage
 *   H Seiten-URL    I UTM Source       J UTM Campaign
 *
 * DEPLOYMENT (~2 minutes):
 *   1. Open the "Meta Ads Leads" sheet.
 *   2. Extensions → Apps Script.
 *   3. Replace Code.gs with this file.
 *   4. Deploy → Manage deployments → pencil-edit the existing deployment →
 *      Version: "New version" → Deploy. The /exec URL stays the same, so
 *      no env-var update is needed. (First-time deploy: New deployment →
 *      Web app → Execute as "Me", Access "Anyone" → paste the URL into
 *      Vercel as GOOGLE_SHEET_WEBHOOK_URL.)
 */

// Tab names — change here if you rename the tabs in the sheet.
var TAB_LP = 'Sheet1';         // potenzialanalyse / meta-ads / LP forms
var TAB_LEITFADEN = 'Sheet2';  // leitfaden lead magnet
var TAB_KONTAKT = 'Sheet3';    // site-wide Kontaktformular
var TAB_PAINPOINTS = 'Sheet4'; // Handwerker-Painpoints Kampagne

var HEADERS_LP = [
  'Zeitstempel',
  'Name',
  'Telefonnummer',
  'Firma / Betrieb',
  'Inhaber / Entscheider',
  'Landingpage',
  'Seiten-URL',
];

var HEADERS_KONTAKT = [
  'Zeitstempel',
  'Name',
  'Telefonnummer',
  'E-Mail',
  'Betreff',
  'Nachricht',
  'Seiten-URL',
];

var HEADERS_PAINPOINTS = [
  'Zeitstempel',
  'Vorname',
  'Nachname',
  'Telefonnummer',
  'E-Mail',
  'Website gefällt',
  'Landingpage',
  'Seiten-URL',
  'UTM Source',
  'UTM Campaign',
];

/** HTTP entry point. */
function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var formType = body.formType || '';

    var isPainpoints = formType === 'painpoints';
    var isKontakt = !isPainpoints && formType === 'kontakt';
    var isLeitfaden =
      !isPainpoints &&
      !isKontakt &&
      (formType === 'leitfaden' ||
        body.landingPage === 'Leitfaden Rollenspiel' ||
        (body.email && !body.company));

    var tabName = isPainpoints
      ? TAB_PAINPOINTS
      : isKontakt
      ? TAB_KONTAKT
      : isLeitfaden
      ? TAB_LEITFADEN
      : TAB_LP;
    var headers = isPainpoints
      ? HEADERS_PAINPOINTS
      : isKontakt
      ? HEADERS_KONTAKT
      : HEADERS_LP;
    var sheet = getOrCreateTab_(tabName);
    ensureHeader_(sheet, headers);

    // Sheets treats a leading + as a formula, so the server prefixes the
    // phone with ' — strip it back off for display.
    var phone = String(body.phone || '');
    if (phone.charAt(0) === "'") phone = phone.slice(1);

    // Column mapping depends on the source form.
    var row;
    if (isPainpoints) {
      row = [
        new Date(),                            // Zeitstempel
        body.vorname || '',                    // Vorname
        body.nachname || '',                   // Nachname
        phone,                                 // Telefonnummer
        body.email || '',                      // E-Mail
        body.websiteLiked || '',               // Website gefällt (Ja/Nein)
        body.landingPage || 'Handwerker-Painpoints', // Landingpage
        body.pageUrl || '',                    // Seiten-URL
        body.utmSource || '',                  // UTM Source
        body.utmCampaign || '',                // UTM Campaign
      ];
    } else if (isKontakt) {
      row = [
        new Date(),                        // Zeitstempel
        body.name || '',                   // Name
        phone,                             // Telefonnummer
        body.email || '',                  // E-Mail
        body.betreff || '',                // Betreff
        body.nachricht || '',              // Nachricht
        body.pageUrl || '',                // Seiten-URL
      ];
    } else if (isLeitfaden) {
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

function ensureHeader_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Best-effort column widths — different tabs have different content,
    // so apply the LP defaults up to column 7 and give the painpoints
    // UTM columns some room too.
    sheet.setColumnWidth(1, 160); // Zeitstempel
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 160);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 240);
    sheet.setColumnWidth(6, 260);
    sheet.setColumnWidth(7, 340);
    if (headers.length >= 8) sheet.setColumnWidth(8, 160);
    if (headers.length >= 9) sheet.setColumnWidth(9, 220);
    if (headers.length >= 10) sheet.setColumnWidth(10, 220);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
