// --- Helper Functions to Get Sheets ---

/**
 * Gets a sheet by its name from the spreadsheet file defined in Script Properties.
 * @param name The name of the sheet (e.g., "Houses", "Residents").
 */
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

/**
 * Gets all data from a sheet, skipping the header row.
 * @param sheetName The name of the sheet to read data from.
 */
function getSheetData(sheetName: string): string[][] {
  const sheet = getSheet(sheetName);
  if (sheet.getLastRow() < 2) {
    return []; // Return empty if only header or empty
  }
  // Get data from row 2, column 1, to the end of the sheet
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
}

/**
 * Generates a unique ID.
 * @param prefix A prefix for the ID (e.g., "res", "occ").
 */
function generateUniqueId(prefix: string): string {
  return `${prefix}_${new Date().getTime()}_${Math.random().toString(36).substring(2, 8)}`;
}


// --- Form Submission Handling ---

/**
 * Main trigger function that runs when the resident event form is submitted.
 * This acts as a router.
 * @param e The form submission event object.
 */
function onFormSubmit(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  try {
    const responses = new Map(
      e.response.getItemResponses().map(itemResponse => [
        itemResponse.getItem().getTitle(),
        itemResponse.getResponse(),
      ])
    );

    const eventType = responses.get('イベント種別');

    switch (eventType) {
      case '入居':
        handleNewResident(responses);
        break;
      case '退居':
        // TODO: Implement handleDeparture
        console.log('Departure event received. Not yet implemented.');
        break;
      case '部屋移動':
        // TODO: Implement handleRoomChange
        console.log('Room change event received. Not yet implemented.');
        break;
      default:
        throw new Error(`Unknown event type: ${eventType}`);
    }
  } catch (error) {
    console.error('Error processing form submission:', error);
    // TODO: Add notification for the admin
  }
}

/**
 * Handles the "New Resident" (入居) event.
 * @param responses A map of question titles to their answers.
 */
function handleNewResident(responses: Map<string, any>) {
  const properties = PropertiesService.getScriptProperties();
  const residentsSheet = getSheet(properties.getProperty('SHEET_NAME_RESIDENTS') || 'Residents');
  const occupanciesSheet = getSheet(properties.getProperty('SHEET_NAME_OCCUPANCIES') || 'Occupancies');
  
  // --- 1. Get data from form responses (Corrected to match form instructions) ---
  const nameAndNickname = responses.get('氏名・ニックネームなど');
  const roomLabel = responses.get('部屋');
  const startDate = responses.get('イベント発生日');

  // For now, we'll treat the combined field as the main name and leave nickname blank.
  const newName = nameAndNickname;
  const newNickname = '';

  if (!newName || !roomLabel || !startDate) {
    throw new Error('Required information for new resident is missing.');
  }

  // --- 2. Find the room_id from the room_label ---
  const roomsData = getSheetData(properties.getProperty('SHEET_NAME_ROOMS') || 'Rooms');
  const roomRow = roomsData.find(row => row[2] === roomLabel); // room_label is 3rd column
  if (!roomRow) {
    throw new Error(`Room with label "${roomLabel}" not found in Rooms sheet.`);
  }
  const roomId = roomRow[0]; // room_id is 1st column

  // --- 3. Create new resident record ---
  const newResidentId = generateUniqueId('res');
  const now = new Date();
  residentsSheet.appendRow([newResidentId, newName, newNickname, now]);

  // --- 4. Create new occupancy record ---
  const newOccupancyId = generateUniqueId('occ');
  // The end_date is null for a new move-in
  occupanciesSheet.appendRow([newOccupancyId, newResidentId, roomId, new Date(startDate), null]);

  console.log(`Successfully added new resident ${newName} (${newResidentId})`);
}


// --- Form Choice Syncing ---

/**
 * Helper function to update a dropdown list item in a form.
 */
function updateDropdown(itemMap: Map<string, GoogleAppsScript.Forms.Item>, itemName: string, choices: string[]) {
  const item = itemMap.get(itemName);
  if (item && item.getType() === FormApp.ItemType.LIST) {
    if (choices.length > 0) {
      item.asListItem().setChoiceValues(choices);
    } else {
      item.asListItem().setChoiceValues(['（選択肢がありません）']);
    }
  } else {
    console.warn(`Dropdown item with title "${itemName}" not found or is not a list item.`);
  }
}

/**
 * A time-driven trigger function to sync data from sheets to the resident event form.
 */
function syncDataToForms() {
  const properties = PropertiesService.getScriptProperties();
  const formId = properties.getProperty('RESIDENT_EVENT_FORM_ID');
  if (!formId) {
    throw new Error('RESIDENT_EVENT_FORM_ID is not set in Script Properties.');
  }

  try {
    const form = FormApp.openById(formId);
    const items = form.getItems();
    const itemMap = new Map(items.map(item => [item.getTitle(), item]));

    const houseSheetName = properties.getProperty('SHEET_NAME_HOUSES') || 'Houses';
    const houseData = getSheetData(houseSheetName);
    const houseNames = houseData.map(row => row[1]).filter(name => name);
    updateDropdown(itemMap, 'ハウス', houseNames);

    const residentSheetName = properties.getProperty('SHEET_NAME_RESIDENTS') || 'Residents';
    const residentData = getSheetData(residentSheetName);
    const residentNames = residentData.map(row => row[2] || row[1]).filter(name => name);
    updateDropdown(itemMap, '対象の住人', ['（新規登録）', ...residentNames]);

    const roomSheetName = properties.getProperty('SHEET_NAME_ROOMS') || 'Rooms';
    const roomData = getSheetData(roomSheetName);
    const roomLabels = roomData.map(row => row[2]).filter(label => label);
    updateDropdown(itemMap, '部屋', roomLabels);

    console.log('Resident event form synced successfully.');

  } catch (error) {
    console.error('Failed to sync resident event form:', error);
    throw error;
  }
}

// --- One-time Trigger Setup ---

/**
 * Run this function ONCE to create the "on form submit" trigger.
 */
function createOnSubmitTrigger() {
  const formId = PropertiesService.getScriptProperties().getProperty('RESIDENT_EVENT_FORM_ID');
  if (!formId) {
    throw new Error('RESIDENT_EVENT_FORM_ID is not set in Script Properties to create trigger.');
  }

  // Deletes all existing triggers for this script to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // Creates the new trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(formId)
    .onFormSubmit()
    .create();
  
  console.log('"onFormSubmit" trigger created successfully.');
}
