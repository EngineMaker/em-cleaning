// This package contains the core domain logic for cleaning management.
// It should have no dependency on Google Apps Script or any external services.

import { ResidentId, HouseId } from '@resident-core/index';

// --- Type Definitions ---

export type PlaceId = string;
export type CleaningId = string;

export interface CleaningPlace {
  placeId: PlaceId;
  houseId: HouseId;
  placeName: string;
}

export interface CleaningRecord {
  cleaningId: CleaningId;
  cycle: string; // e.g., "2023-10"
  placeId: PlaceId;
  residentId: ResidentId;
  cleanedAt: Date;
}

// --- Logic Functions ---

/**
 * Finds cleaning places a resident has never cleaned within a specific house.
 * @param allPlaces A list of all available cleaning places for a house.
 * @param history A list of the resident's cleaning history.
 * @returns A list of places the resident has not cleaned.
 */
export function findUncleanedPlaces(allPlaces: CleaningPlace[], history: CleaningRecord[]): CleaningPlace[] {
  const cleanedPlaceIds = new Set(history.map(record => record.placeId));
  return allPlaces.filter(place => !cleanedPlaceIds.has(place.placeId));
}

/**
 * Checks if a resident has cleaned a specific place in the last N months.
 * @param placeId The place to check.
 * @param residentId The resident to check for.
 * @param history The entire cleaning history.
 * @param months The number of months to look back.
 * @param currentDate The date to calculate from.
 * @returns True if the resident has cleaned the place recently, false otherwise.
 */
export function hasCleanedRecently(placeId: PlaceId, residentId: ResidentId, history: CleaningRecord[], months: number, currentDate: Date): boolean {
  const limitDate = new Date(currentDate);
  limitDate.setMonth(limitDate.getMonth() - months);

  return history.some(record => 
    record.residentId === residentId &&
    record.placeId === placeId &&
    record.cleanedAt >= limitDate
  );
}