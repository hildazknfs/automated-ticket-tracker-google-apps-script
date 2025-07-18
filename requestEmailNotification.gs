function requestEmailNotification() {
  const props = PropertiesService.getScriptProperties();
  const sheetName = props.getProperty("FORM_RESPONSES_SHEET_NAME");
  const slackChannelLink = props.getProperty("SLACK_CHANNEL_LINK");
  const ssUrl = props.getProperty("FORM_REQUEST_RESPONSES_SHEET_URL");

  const ss = SpreadsheetApp.openByUrl(ssUrl);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log(`Sheet '${sheetName}' not found in '${ssUrl}'`);
    return;
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow <= 1) {
    Logger.log("No data to process.");
    return;
  }

  const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
  const data = dataRange.getValues();

  for (let i = 0; i < data.length; i++) {
    const rowData = data[i];
    const rowNumber = i + 2; // Row in sheet (header in row 1)

    const idRequest = rowData[6];   // Column G (index 6)
    const notified = rowData[7];    // Column H (index 7)

    // Only proceed if BOTH ID Request and Notification are empty
    if (!idRequest && !notified) {
      // Generate ID Request based on rowNumber - 1 (since first data row is 2)
      const ticketNumber = String(rowNumber - 1).padStart(3, '0');
      const generatedId = `TICKET-${ticketNumber}`;

      // Write generated ID Request into Column G
      sheet.getRange(rowNumber, 7).setValue(generatedId);
      Logger.log(`Row ${rowNumber}: Generated ID Request ${generatedId}`);

      // Prepare email data
      const timestamp = new Date(rowData[0]);
      const email = rowData[1];
      const fullName = rowData[2];
      const department = rowData[3];
      const requestType = rowData[4];
      const description = rowData[5];

      const subject = `Request Received: ${generatedId}`;

      const body = `
<p style="font-family:Arial,sans-serif;font-size:14px;">
Hi <strong>${fullName}</strong>,
</p>

<p style="font-family:Arial,sans-serif;font-size:14px;">
We have received your request with the following details:
</p>

<table cellpadding="8" cellspacing="0" width="80%" 
style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;border:1px solid #ddd;">
  <tr style="background-color:#f2f2f2;">
    <th align="left" style="border:1px solid #ddd;">Field</th>
    <th align="left" style="border:1px solid #ddd;">Details</th>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;"><strong>Timestamp</strong></td>
    <td style="border:1px solid #ddd;">${timestamp.toLocaleString()}</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;"><strong>Name</strong></td>
    <td style="border:1px solid #ddd;">${fullName}</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;"><strong>Department</strong></td>
    <td style="border:1px solid #ddd;">${department}</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;"><strong>Request Type</strong></td>
    <td style="border:1px solid #ddd;">${requestType}</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;"><strong>Description</strong></td>
    <td style="border:1px solid #ddd;">${description}</td>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;"><strong>Ticket ID</strong></td>
    <td style="border:1px solid #ddd;">${generatedId}</td>
  </tr>
</table>

<p style="font-family:Arial,sans-serif;font-size:14px;">
Our team will review and process your request shortly.
</p>

<p style="font-family:Arial,sans-serif;font-size:14px;">
If you have any updates or questions, you can reply to this email or contact us on our <a href="${slackChannelLink}">Slack channel</a>. Thank you!
</p>

<p style="font-family:Arial,sans-serif;font-size:14px;">
<strong>Best Regards,<br>
IT GRC Team</strong>
</p>
`;

      try {
        GmailApp.sendEmail(email, subject, '', { htmlBody: body });
        sheet.getRange(rowNumber, 8).setValue('Sent'); // Update Column H with 'Sent'
        Logger.log(`Row ${rowNumber}: Email sent to ${email} for ${generatedId}`);
      } catch (error) {
        Logger.log(`Row ${rowNumber}: Failed to send email to ${email} for ${generatedId}. Error: ${error}`);
      }
    } else {
    }
  }
  synctoInternalTracker();
}
