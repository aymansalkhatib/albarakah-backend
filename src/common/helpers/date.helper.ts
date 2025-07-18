// File: normalize-date.ts

export function normalizeDate(dateInput: string): Date;
export function normalizeDate(dateInput: Date): Date;

export function normalizeDate(dateInput: any): Date {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Normalize to yyyy-MM-dd (remove time) then return new Date at midnight
  const isoString = date.toISOString().split('T')[0]; // e.g. '2024-02-01'
  return new Date(isoString); // returns Date at '2024-02-01T00:00:00.000Z'
}
