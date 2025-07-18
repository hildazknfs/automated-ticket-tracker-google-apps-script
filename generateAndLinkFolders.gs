function generateFoldersAndLinkToTracker() {
  const parentFolderId = "1wUDkvkMW_HdRZE6w7lluk5FZm3UHFJM7";
  const parentFolder = DriveApp.getFolderById(parentFolderId);

  const evidenceSS = SpreadsheetApp.getActiveSpreadsheet();
  const evidenceSheet = evidenceSS.getSheetByName("Form Responses 1");
  const evidenceLastRow = evidenceSheet.getLastRow();
  if (evidenceLastRow <= 1) return;

  const evidenceData = evidenceSheet.getRange(2, 5, evidenceLastRow - 1, 2).getValues();
  const idToFolderLink = {};

  evidenceData.forEach(row => {
    const idRequest = row[0];
    const fileUrl = row[1];
    if (!idRequest || !fileUrl) return;

    try {
      let requestFolder;
      const folders = parentFolder.getFoldersByName(idRequest);
      requestFolder = folders.hasNext() ? folders.next() : parentFolder.createFolder(idRequest);
      idToFolderLink[idRequest] = requestFolder.getUrl();

      const fileId = extractFileIdFromUrl(fileUrl);
      if (!fileId) return;

      const file = DriveApp.getFileById(fileId);

      const filesInFolder = requestFolder.getFilesByName(file.getName());
      let exists = false;
      while (filesInFolder.hasNext()) {
        if (filesInFolder.next().getName() === file.getName()) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        file.makeCopy(file.getName(), requestFolder);
      }
    } catch (error) {
      Logger.log(`Error processing ${idRequest}: ${error}`);
    }
  });

  const trackerSS = SpreadsheetApp.openByUrl(
    "https://docs.google.com/spreadsheets/d/1AE2qsW9Sxc1-QPBxcoukdblOsfPpNwSGsYB1c-QAVZU/edit"
  );
  const trackerSheet = trackerSS.getSheetByName("Request Tracker");
  const trackerLastRow = trackerSheet.getLastRow();
  if (trackerLastRow <= 1) return;

  const trackerIDs = trackerSheet.getRange(2, 1, trackerLastRow - 1, 1).getValues().flat();

  trackerIDs.forEach((idRequest, idx) => {
    const row = idx + 2;

    if (idToFolderLink[idRequest]) {
      const folderUrl = idToFolderLink[idRequest];
      const richText = SpreadsheetApp.newRichTextValue()
        .setText(idRequest)
        .setLinkUrl(folderUrl)
        .build();
      trackerSheet.getRange(row, 7).setRichTextValue(richText);
      trackerSheet.getRange(row, 6).setValue("Yes");
    } else {
      trackerSheet.getRange(row, 6).setValue("No");
    }
  });
}

function extractFileIdFromUrl(url) {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}