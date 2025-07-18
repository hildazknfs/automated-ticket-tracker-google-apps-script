function synctoInternalTracker() {
  const props = PropertiesService.getScriptProperties();
  const sourceSheetName = props.getProperty("FORM_RESPONSES_SHEET_NAME");
  const sourceSheetUrl = props.getProperty("FORM_REQUEST_RESPONSES_SHEET_URL");
  const trackerSheetUrl = props.getProperty("TRACKER_SHEET_URL");
  const trackerSheetName = props.getProperty("TRACKER_SHEET_NAME");

  // OPEN SOURCE SHEET (GForm Responses)
  const sourceSS = SpreadsheetApp.openByUrl(sourceSheetUrl);
  const sourceSheet = sourceSS.getSheetByName(sourceSheetName);

  if (!sourceSheet) {
    Logger.log(`Sheet '${sourceSheetName}' not found in '${sourceSheetUrl}'`);
    return;
  }

  const lastRow = sourceSheet.getLastRow();
  const lastCol = sourceSheet.getLastColumn();

  if (lastRow <= 1) {
    Logger.log("No data to sync.");
    return;
  }

  const data = sourceSheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  // OPEN TARGET SHEET (Tracker)
  const targetSS = SpreadsheetApp.openByUrl(trackerSheetUrl);
  const targetSheet = targetSS.getSheetByName(trackerSheetName);

  if (!targetSheet) {
    Logger.log(`Tracker sheet '${trackerSheetName}' not found in '${trackerSheetUrl}'`);
    return;
  }

  const targetLastRow = targetSheet.getLastRow();
  let existingIDs = [];
  if (targetLastRow > 1) {
    existingIDs = targetSheet.getRange(2, 1, targetLastRow - 1, 1).getValues().flat();
  }

  let newRows = 0;
  data.forEach(row => {
    const email = row[1];           // B
    const name = row[2];            // C
    const department = row[3];      // D
    const requestType = row[4];     // E
    const idRequest = row[6];       // G

    if (idRequest && !existingIDs.includes(idRequest)) {
      const evidenceSubmitted = ""; // intentionally left blank
      const evidenceLink = "";      // intentionally left blank

      targetSheet.appendRow([
        idRequest,
        email,
        name,
        department,
        requestType,
        evidenceSubmitted,
        evidenceLink
      ]);

      newRows++;
      Logger.log(`Added to tracker: ${idRequest} | ${email} | ${name}`);
    }
  });
}
