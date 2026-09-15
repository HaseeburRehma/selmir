/**
 * Google Apps Script — unified sheet router
 * ==========================================
 *
 * Deploy this bound to the "Meta Ads Leads" sheet.
 * Every POST is routed by payload:
 *
 *   • Potenzialanalyse / LP forms       → Sheet1
 *       (payload has `company` and `decisionMaker`, no `email`)
 *   • Leitfaden lead magnet             → Sheet2
 *       (payload has `formType: "leitfaden"`)
 *   • Site-wide Kontaktformular         → Sheet3
 *       (payload has `formType: "kontakt"`)
 *   • Handwerker-Painpoints (LP form)   → Sheet4
 *       (payload has `formType: "painpoints"`)
 *   • Betriebs-Röntgen wizard           → "Betriebs-Roentgen"
 *       (payload has `formType: "betriebs-roentgen"` — the top-right
 *        "Potenzialanalyse sichern" CTA on the site; 18-col tab with
 *        contact + full wizard answers)
 *   • Meta Instant Form (Handwerker)    → "Handwerker Erstgespräch"
 *       (payload has a top-level `properties` object — HubSpot workflow
 *        4921990350 sends this via its Send-Webhook action after HubSpot's
 *        native Meta Ads sync creates the contact. The workflow uses
 *        "Include all triggered contact properties" as its request body,
 *        so we auto-detect that shape and route to this tab.)
 *   • SMS verified, form not submitted  → "Verifiziert – nicht abgeschickt"
 *       (payload has `formType: "sms-verified"` — POSTed by
 *        /api/phone/verify-only the moment the visitor's Twilio code is
 *        approved. Same person completing the form later still lands in
 *        their normal tab; this row stays as the abandonment marker.)
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
 * Sheet4 (Handwerker-Painpoints, WEBSITE form) uses its own 10-column
 * header — the form collects Vorname + Nachname + Telefon + E-Mail +
 * the Ja/Nein "Bist du Inhaber/Entscheider?" answer, plus the
 * campaign's UTM source / campaign so ad-spend attribution stays in
 * the same tab as the lead:
 *   A Zeitstempel   B Vorname               C Nachname   D Telefonnummer
 *   E E-Mail        F Inhaber / Entscheider  G Landingpage
 *   H Seiten-URL    I UTM Source            J UTM Campaign
 *
 * "Handwerker Erstgespräch" (Meta Instant Form) matches the layout
 * Meta's native Google-Sheets connector uses so the tab stays
 * consistent whether the row is written by Meta directly or by the
 * HubSpot-backed fallback:
 *   A id                       B created_time
 *   C ad_id                    D ad_name
 *   E adset_id                 F adset_name
 *   G campaign_id              H campaign_name
 *   I form_id                  J form_name
 *   K is_organic               L platform
 *   M was_ist_gerade_deine_...  N bist_du_inhaber_...
 *   O vollständiger_name       P telefonnummer
 *   Q name_des_unternehmens    R e-mail-adresse
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
var TAB_LP = 'Sheet1';                       // potenzialanalyse / LP forms
var TAB_LEITFADEN = 'Sheet2';                // leitfaden lead magnet
var TAB_KONTAKT = 'Sheet3';                  // site-wide Kontaktformular
var TAB_PAINPOINTS = 'Sheet4';               // Handwerker-Painpoints WEBSITE form
var TAB_META_HANDWERKER = 'Handwerker Erstgespräch'; // Meta Instant Form leads (HubSpot -> sheet)
var TAB_SMS_VERIFIED = 'Verifiziert – nicht abgeschickt'; // SMS code approved but form not submitted
var TAB_BR = 'Betriebs-Roentgen';            // Betriebs-Röntgen wizard submissions (18-col tab)

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
  'Inhaber / Entscheider',
  'Landingpage',
  'Seiten-URL',
  'UTM Source',
  'UTM Campaign',
];

// Betriebs-Röntgen wizard — the 18-column tab the client set up by hand
// in the "Meta Ads Leads" spreadsheet. Column A is intentionally left
// as a plain timestamp so Sheets orders newest-last naturally; every
// other column matches the wizard payload built by /api/betriebs-roentgen/submit.
var HEADERS_BR = [
  'Zeitstempel',
  'Name',
  'E-Mail',
  'Telefonnummer',
  'Branche',
  'Jahresumsatz (EUR)',
  'Mitarbeiter',
  'Anfragen / Monat',
  'Ø Auftragswert (EUR)',
  'Abschlussquote (0-10)',
  'Reaktionszeit',
  'Wochenstunden Inhaber',
  'Vertrieb ohne dich',
  'Vertriebsprozess',
  'Nachfassen',
  'Branchen-Frage 1',
  'Branchen-Frage 2',
  'Seiten-URL',
];

// Abandoned SMS-verified visitors — the 8-column tab tracks the phone
// they proved they own plus whatever else they had already typed. The
// LP / Meta enrichment lives on the contact's proper row when they later
// come back and finish; this row stays as the abandonment audit trail.
var HEADERS_SMS_VERIFIED = [
  'Zeitstempel',
  'Telefonnummer',
  'Vorname',
  'Nachname',
  'E-Mail',
  'Quelle',
  'Seiten-URL',
  'Status',
];

// Matches Meta's native Google-Sheets connector column layout so this
// tab reads the same whether Meta writes the row itself or our HubSpot
// fallback writes it via a Send-Webhook action.
var HEADERS_META_HANDWERKER = [
  'id',
  'created_time',
  'ad_id',
  'ad_name',
  'adset_id',
  'adset_name',
  'campaign_id',
  'campaign_name',
  'form_id',
  'form_name',
  'is_organic',
  'platform',
  'was_ist_gerade_deine_groesste_baustelle_',
  'bist_du_inhaber_entscheider_',
  'vollständiger_name',
  'telefonnummer',
  'name_des_unternehmens',
  'e-mail-adresse',
];

/** HTTP entry point. */
function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var formType = body.formType || '';

    // HubSpot workflow 4921990350 (Meta Instant Form -> Handwerk Erstgespräch)
    // is configured with "Include all triggered contact properties" as its
    // Send-Webhook request body. That option omits a `formType` key and posts
    // the contact record directly, so auto-detect it here and route to the
    // Meta Instant Form tab. Two known payload shapes:
    //   { vid: 123, properties: { firstname: { value: "John" }, ... } }
    //   { objectId: 123, properties: { firstname: "John", ... } }
    if (!formType && body.properties && typeof body.properties === 'object') {
      formType = 'meta-handwerker';
    }

    var isMetaHandwerker = formType === 'meta-handwerker';
    var isSmsVerified = !isMetaHandwerker && formType === 'sms-verified';
    var isBetriebsRoentgen =
      !isMetaHandwerker && !isSmsVerified && formType === 'betriebs-roentgen';
    var isPainpoints =
      !isMetaHandwerker && !isSmsVerified && !isBetriebsRoentgen && formType === 'painpoints';
    var isKontakt =
      !isMetaHandwerker && !isSmsVerified && !isBetriebsRoentgen && !isPainpoints && formType === 'kontakt';
    var isLeitfaden =
      !isMetaHandwerker &&
      !isSmsVerified &&
      !isBetriebsRoentgen &&
      !isPainpoints &&
      !isKontakt &&
      (formType === 'leitfaden' ||
        body.landingPage === 'Leitfaden Rollenspiel' ||
        (body.email && !body.company));

    var tabName = isMetaHandwerker
      ? TAB_META_HANDWERKER
      : isSmsVerified
      ? TAB_SMS_VERIFIED
      : isBetriebsRoentgen
      ? TAB_BR
      : isPainpoints
      ? TAB_PAINPOINTS
      : isKontakt
      ? TAB_KONTAKT
      : isLeitfaden
      ? TAB_LEITFADEN
      : TAB_LP;
    var headers = isMetaHandwerker
      ? HEADERS_META_HANDWERKER
      : isSmsVerified
      ? HEADERS_SMS_VERIFIED
      : isBetriebsRoentgen
      ? HEADERS_BR
      : isPainpoints
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
    if (isMetaHandwerker) {
      // Meta Instant Form leads — pushed by the HubSpot workflow's
      // Send-Webhook action ("Include all triggered contact properties")
      // after HubSpot's native Meta Ads sync creates the contact. The
      // body has a `properties` object keyed by HubSpot internal-name
      // properties; helper below handles both `{value: "..."}` and plain
      // string shapes.
      var props = body.properties || {};
      function pv(name) {
        var p = props[name];
        if (p === undefined || p === null) return '';
        if (typeof p === 'object' && 'value' in p) return p.value == null ? '' : String(p.value);
        return String(p);
      }
      // HubSpot's Meta Ads sync populates first/last/email/phone from
      // Meta's field_data. Ad-attribution fields (campaign/ad/adset/form
      // ids and names) may or may not exist as custom properties depending
      // on portal setup — read them defensively so missing ones just
      // leave the column blank.
      var hsFirst = pv('firstname');
      var hsLast = pv('lastname');
      var hsFull = (hsFirst + ' ' + hsLast).trim();
      var hsPhone = pv('phone') || pv('mobilephone');
      if (hsPhone && hsPhone.charAt(0) === "'") hsPhone = hsPhone.slice(1);
      var hsId = body.vid || body.objectId || pv('hs_object_id') || '';
      var hsCreated = pv('createdate') || new Date().toISOString();
      row = [
        String(hsId),                                                  // id (HubSpot contact id)
        hsCreated,                                                     // created_time
        pv('hs_facebook_ad_id') || pv('hs_analytics_source_data_2'),   // ad_id
        pv('hs_facebook_ad_name'),                                     // ad_name
        pv('hs_facebook_adgroup_id') || pv('hs_facebook_ad_group_id'), // adset_id
        pv('hs_facebook_adgroup_name'),                                // adset_name
        pv('hs_facebook_campaign_id'),                                 // campaign_id
        pv('hs_facebook_campaign_name') || pv('hs_analytics_source_data_1'), // campaign_name
        pv('hs_facebook_form_id'),                                     // form_id
        pv('hs_facebook_form_name') || 'Kostenlose Analyse anfragen',  // form_name
        'false',                                                       // is_organic (Meta ads = paid)
        pv('hs_analytics_source') === 'PAID_SOCIAL' ? 'fb' : 'fb',     // platform
        pv('was_ist_gerade_deine_groesste_baustelle_') ||
          pv('was_ist_gerade_deine_groesste_baustelle') ||
          pv('message'),                                               // custom Q1
        pv('bist_du_inhaber_entscheider_') ||
          pv('bist_du_inhaber_entscheider'),                           // custom Q2
        hsFull,                                                        // full name
        hsPhone,                                                       // telefonnummer
        pv('company') || pv('name_des_unternehmens'),                  // company
        pv('email'),                                                   // e-mail-adresse
      ];
    } else if (isBetriebsRoentgen) {
      // Betriebs-Röntgen wizard — the full qualifying picture (contact
      // block + 5 core answers + industry-specific pair) so Sales can
      // read the whole diagnosis without pivoting to HubSpot. Column
      // order MUST match the tab the client set up by hand (see
      // HEADERS_BR above).
      row = [
        new Date(),                            // A Zeitstempel
        body.name || '',                       // B Name (already "First Last")
        body.email || '',                      // C E-Mail
        phone,                                 // D Telefonnummer (verified E.164)
        body.industry || '',                   // E Branche (incl. "Sonstiges — <text>")
        body.umsatz || '',                     // F Jahresumsatz (EUR)
        body.mitarbeiter || '',                // G Mitarbeiter
        body.anfragenMonat || '',              // H Anfragen / Monat
        body.auftragWert || '',                // I Ø Auftragswert (EUR)
        body.abschlussquote != null ? body.abschlussquote : '', // J Abschlussquote (0-10)
        body.reaktionszeit || '',              // K Reaktionszeit
        body.wochenstunden || '',              // L Wochenstunden Inhaber
        body.coreVertrieb || '',               // M Vertrieb ohne dich
        body.coreProzess || '',                // N Vertriebsprozess
        body.coreNachfassen || '',             // O Nachfassen
        body.industryQ1 || '',                 // P Branchen-Frage 1
        body.industryQ2 || '',                 // Q Branchen-Frage 2
        body.pageUrl || '',                    // R Seiten-URL
      ];
    } else if (isSmsVerified) {
      // SMS was verified but the visitor never clicked Submit. Only the
      // phone is guaranteed; every other field is best-effort — the row
      // still gives sales a callable number.
      row = [
        new Date(),                            // Zeitstempel
        phone,                                 // Telefonnummer (verified)
        body.firstName || body.vorname || '',  // Vorname
        body.lastName || body.nachname || '',  // Nachname
        body.email || '',                      // E-Mail (may be empty)
        body.source || body.landingPage || '', // Quelle (page slug)
        body.pageUrl || '',                    // Seiten-URL
        'Verifiziert – nicht abgeschickt',     // Status
      ];
    } else if (isPainpoints) {
      row = [
        new Date(),                            // Zeitstempel
        body.vorname || '',                    // Vorname
        body.nachname || '',                   // Nachname
        phone,                                 // Telefonnummer
        body.email || '',                      // E-Mail
        body.entscheider || '',                // Inhaber / Entscheider (Ja/Nein)
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
    // Meta Instant Form tab has 18 columns; the extras cover its
    // id / campaign / adset / ad / form pairs and the two custom Qs.
    for (var i = 11; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 180);
    }
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ONE-TIME CLEANUP — list every tab in this spreadsheet.
 *
 * Run manually from the Apps Script editor (Run → listTabs). The output
 * lands in View → Execution log so you can see which tabs are legacy
 * and worth removing.
 */
function listTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var known = {};
  known[TAB_LP] = 1;
  known[TAB_LEITFADEN] = 1;
  known[TAB_KONTAKT] = 1;
  known[TAB_PAINPOINTS] = 1;
  known[TAB_META_HANDWERKER] = 1;
  known[TAB_SMS_VERIFIED] = 1;
  known[TAB_BR] = 1;
  var lines = ['name | rows | status'];
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i];
    var name = s.getName();
    var rows = Math.max(0, s.getLastRow() - 1); // minus header
    lines.push(name + ' | ' + rows + ' | ' + (known[name] ? 'KEEP' : 'LEGACY?'));
  }
  Logger.log(lines.join('\n'));
  return lines.join('\n');
}

/**
 * ONE-TIME CLEANUP — delete every tab that is NOT in the router allowlist
 * AND has zero data rows. Legacy empty tabs are removed silently; legacy
 * tabs with data are logged and LEFT ALONE so nothing is ever lost
 * without a human decision.
 *
 * Run from the Apps Script editor (Run → cleanupUnusedTabs). Re-run is safe.
 */
function cleanupUnusedTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var known = {};
  known[TAB_LP] = 1;
  known[TAB_LEITFADEN] = 1;
  known[TAB_KONTAKT] = 1;
  known[TAB_PAINPOINTS] = 1;
  known[TAB_META_HANDWERKER] = 1;
  known[TAB_SMS_VERIFIED] = 1;
  known[TAB_BR] = 1;

  var deleted = [];
  var keptWithData = [];
  for (var i = 0; i < sheets.length; i++) {
    var s = sheets[i];
    var name = s.getName();
    if (known[name]) continue;
    var rows = Math.max(0, s.getLastRow() - 1);
    if (rows === 0 && sheets.length - deleted.length > 1) {
      ss.deleteSheet(s);
      deleted.push(name);
    } else {
      keptWithData.push(name + ' (' + rows + ' rows)');
    }
  }
  var summary =
    'Deleted (empty legacy): ' +
    (deleted.length ? deleted.join(', ') : '(none)') +
    '\nKept (legacy with data — decide manually): ' +
    (keptWithData.length ? keptWithData.join(', ') : '(none)');
  Logger.log(summary);
  return summary;
}
