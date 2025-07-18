# Google Apps Script Utilities for Ticket Request and Evidence Automation

This repository contains **Google Apps Script (GAS) utilities** to automate **request tracking, email notifications, and evidence folder management** within Google Workspace. These scripts streamline repetitive processes, reduce manual errors, and maintain consistency **without external pipelines or APIs**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [How It Works](#how-it-works)
- [Setup and Configuration](#setup-and-configuration)
- [Setting Triggers](#setting-triggers)
- [Usage Example](#usage-example)

---

## Overview

This project automates:

- Generating and managing evidence folders in Google Drive linked to request IDs.
- Sending automated email notifications when requests are received.
- Syncing request data from Google Forms to a structured tracker sheet.

All functionality runs **fully within Google Apps Script** for easy maintenance.

---

## Features

- **Automated Folder Creation:** Creates and links Google Drive folders for each request.
- **Automated Email Notifications:** Sends formatted confirmation emails upon new requests.
- **Request Tracker Sync:** Syncs Google Forms responses into a tracker sheet while avoiding duplicates.
- **Fully integrated within Google Workspace** without external API setup.
- Uses `Script Properties` for dynamic configuration.

---

## Tech Stack

- Google Apps Script (JavaScript)
- Google Drive
- Google Sheets
- Gmail

---

## File Structure

```plaintext
.
├── generateAndLinkFolders.gs         # Automates folder creation and linking to tracker
├── requestEmailNotification.gs       # Sends notification emails upon receiving requests
├── syncToInternalTracker.gs          # Syncs new requests to the tracker sheet
└── README.md                         # Project documentation
```

---

## How It Works

## 1. Request Email Notification
- Triggered on new Google Form submissions.
- Generates a `TICKET-XXX` ID if missing.
- Sends confirmation email with request details.
- Calls `synctoInternalTracker()` to sync data.

## 2. Sync to Internal Tracker
- Reads Google Forms responses.
- Checks for duplicates in the tracker sheet.
- Appends unique requests to the tracker sheet.

## 3. Generate and Link Folders
- Creates Drive folders named after request IDs.
- Copies submitted evidence files into folders.
- Updates the tracker sheet with folder links and status.

---

# Setup and Configuration

1. **Copy the scripts (`.gs` files)** into your Google Apps Script project linked to your Google Spreadsheet.

2. **Set Script Properties:**
   - `FORM_RESPONSES_SHEET_NAME`
   - `FORM_REQUEST_RESPONSES_SHEET_URL`
   - `TRACKER_SHEET_URL`
   - `TRACKER_SHEET_NAME`
   - `SLACK_CHANNEL_LINK`
   - `PARENT_FOLDER_ID`
   - `FORM_EVIDENCE_RESPONSES_SHEET_URL`

3. **Adjust column references** inside the scripts if your sheet structure differs.

4. Ensure your **Google Workspace account** has permissions for:
   - Sheets
   - Drive
   - Gmail

---

## Setting Triggers

You can set triggers in Google Apps Script for automated execution.

## Steps

1. Open your **Google Spreadsheet**.
2. Go to: Extensions > Apps Script
3. In the Apps Script editor, click the **Triggers icon (clock icon)** in the left sidebar.
4. Click **“Add Trigger” (+)**.
5. Configure based on your needs.

## Example Trigger Configurations

### Trigger on Form Submit
- **Function:** `requestEmailNotification`
- **Event Source:** Minute Timer
- **Event Type:** Every minute

### Daily Folder Linking
- **Function:** `generateAndLinkFolders`
- **Event Source:** Time-driven
- **Type:** Minute timer
- **Time:** Every minute

---

## Usage Example

1. User submits a request via Google Form.
2. The `requestEmailNotification` function triggers, sending a confirmation email and syncing data.
3. The `syncToInternalTracker` function ensures the request is recorded in the tracker sheet.
4. The `generateAndLinkFolders` function creates a dedicated Drive folder for the request and updates the tracker with the folder link.

This ensures **automated, consistent evidence and request tracking** without manual intervention.

---

Thank you for reading!
