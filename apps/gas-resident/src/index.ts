// This Apps Script project manages resident-related tasks.
// It interacts with Google Sheets and Forms.

import { isOccupyingOn } from '@resident-core/index';

// --- Helper Functions to Get Sheets ---

function getSheet(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID is not set in Script Properties.');
  }
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error(`Sheet with name "${name}" not found.`);
  }
  return sheet;
}

function getResidentsSheet() {
  const sheetName = PropertiesService.getScriptProperties().getProperty('SHEET_NAME_RESIDENTS') || 'Residents';
  return getSheet(sheetName);
}

// --- Triggered Functions ---

/**
 * A trigger function that runs when the resident event form is submitted.
 * @param e The form submission event object.
 */
function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  // TODO: Implement logic to handle new resident, departure, room change
  // 1. Parse the form response to get the selected house.
  // 2. Use helper functions like getResidentsSheet() to access data.
  // 3. Call the appropriate handler function (e.g., handleNewResident).
  // 4. Log the operation to the 'Logs' sheet.
  console.log(JSON.stringify(e.response.getItemResponses()));
}

/**
 * A time-driven trigger function to sync data to form choices.
 */
function syncDataToForms() {
  // TODO: Implement logic to update form dropdowns
  // This needs to handle cascading dropdowns: House -> Rooms
  // 1. Get all houses, residents, and rooms from their respective sheets.
  // 2. Update the 'House' dropdown.
  // 3. Set up logic to update the 'Room' dropdown based on the selected house.
}


// --- Query Functions ---

/**
 * Gets a list of residents currently living in a specific house.
 * @param houseId The ID of the house to filter by.
 * @param date The date to check against.
 * @returns An array of resident objects.
 */
function getActiveResidents(houseId: string, date: Date) {
  // TODO: Implement logic to read from Occupancies and Residents sheets
  // and filter by houseId and then using the isOccupyingOn function from resident-core.
}
