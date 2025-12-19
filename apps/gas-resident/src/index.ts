// This Apps Script project manages resident-related tasks.
// It interacts with Google Sheets and Forms.

import { isOccupyingOn } from '@resident-core/index';

// --- Global Variables ---
// These would typically be loaded from Script Properties (via .env)
const RESIDENTS_SHEET_ID = 'YOUR_SHEET_ID';
const RESIDENT_EVENT_FORM_ID = 'YOUR_FORM_ID';

// --- Triggered Functions ---

/**
 * A trigger function that runs when the resident event form is submitted.
 * @param e The form submission event object.
 */
function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  // TODO: Implement logic to handle new resident, departure, room change
  // 1. Parse the form response to get the selected house.
  // 2. Call the appropriate handler function (e.g., handleNewResident).
  // 3. Log the operation to the 'Logs' sheet.
  console.log(JSON.stringify(e.response.getItemResponses()));
}

/**
 * A time-driven trigger function to sync data to form choices.
 */
function syncDataToForms() {
  // TODO: Implement logic to update form dropdowns
  // This needs to handle cascading dropdowns: House -> Rooms
  // 1. Get all houses, residents, and rooms from the sheets.
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