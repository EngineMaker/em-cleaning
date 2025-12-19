// This Apps Script project manages cleaning-related tasks.
// It interacts with Google Sheets and Forms.

import { findUncleanedPlaces, hasCleanedRecently } from '@cleaning-core/index';

// --- Global Variables ---
// These would typically be loaded from Script Properties (via .env)
const CLEANING_SHEET_ID = 'YOUR_SHEET_ID';
const CLEANING_FORM_ID = 'YOUR_FORM_ID';

// --- Triggered Functions ---

/**
 * A trigger function that runs when the cleaning record form is submitted.
 * @param e The form submission event object.
 */
function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  // TODO: Implement logic to handle a new cleaning record.
  // 1. Parse the form response to get house, resident, place, etc.
  // 2. Validate the submission (e.g., check for recent duplicates).
  // 3. If valid, add a new row to the 'Cleanings' sheet.
  // 4. Log the operation.
  console.log(JSON.stringify(e.response.getItemResponses()));
}

/**
 * A time-driven trigger function to sync cleaning places to the form.
 */
function syncDataToForms() {
  // TODO: Implement logic to update the 'Cleaning Places' dropdown in the form.
  // This needs to handle cascading dropdowns: House -> Cleaning Places
  // 1. Get all houses and cleaning places from the sheets.
  // 2. Update the 'House' dropdown.
  // 3. Set up logic to update 'Cleaning Places' based on the selected house.
}

// --- Validation Functions ---

/**
 * Validates a cleaning submission to prevent duplicates.
 * This could be called from onFormSubmit.
 */
function validateSubmission(residentId: string, placeId: string, cycle: string) {
  // TODO: Check if the same place has been cleaned in the same cycle.
  // This check should be scoped to the house of the cleaning place.
  // TODO: Use hasCleanedRecently from cleaning-core to warn against personal duplicates.
}