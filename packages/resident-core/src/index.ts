// This package contains the core domain logic for residents, rooms, and occupancies.
// It should have no dependency on Google Apps Script or any external services.

// --- Type Definitions ---

export type HouseId = string;
export type ResidentId = string;
export type RoomId = string;
export type OccupancyId = string;

export interface House {
  houseId: HouseId;
  houseName: string;
}

export interface Resident {
  residentId: ResidentId;
  name: string;
  nickname: string;
}

export interface Room {
  roomId: RoomId;
  houseId: HouseId;
  roomLabel: string;
  roomType: '個室' | 'ドミトリー';
}

export interface Occupancy {
  occupancyId: OccupancyId;
  residentId: ResidentId;
  roomId: RoomId;
  startDate: Date;
  endDate: Date | null;
}

// --- Logic Functions ---

/**
 * Checks if a resident is occupying a room on a given date.
 * @param occupancy The occupancy period.
 * @param date The date to check.
 * @returns True if the resident is occupying on the date, false otherwise.
 */
export function isOccupyingOn(occupancy: Occupancy, date: Date): boolean {
  if (occupancy.endDate && date > occupancy.endDate) {
    return false;
  }
  return date >= occupancy.startDate;
}