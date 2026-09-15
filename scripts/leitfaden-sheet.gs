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
 *   • Meta Instant Form (Handwerker)    → "Handwerker Erstgespräch"
 *       (payload has a top-level `properties` object — HubSpot workflow
 *        4921990350 sends this via its Send-Webhook action after HubSpot's
 *        native Meta Ads sync creates the contact. The workflow uses
 *        "Include all triggered contact properties" as its request body,
 *        so we auto-detect that shape and route to this tab.)
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
    var isPainpoints = !isMetaHandwerker && formType === 'painpoints';
    var isKontakt = !isMetaHandwerker && !isPainpoints && formType === 'kontakt';
    var isLeitfaden =
      !isMetaHandwerker &&
      !isPainpoints &&
      !isKontakt &&
      (formType === 'leitfaden' ||
        body.landingPage === 'Leitfaden Rollenspiel' ||
        (body.email && !body.company));

    var tabName = isMetaHandwerker
      ? TAB_META_HANDWERKER
      : isPainpoints
      ? TAB_PAINPOINTS
      : isKontakt
      ? TAB_KONTAKT
      : isLeitfaden
      ? TAB_LEITFADEN
      : TAB_LP;
    var headers = isMetaHandwerker
      ? HEADERS_META_HANDWERKER
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
