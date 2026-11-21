import { isRealCalendarDate, toDate } from './utils.js';

/** Returns true when a supported ChronoKit date input is valid. */
export function isValidDate(value) {
  try {
    toDate(value);
    return true;
  } catch {
    return false;
  }
}

/** Returns true for Gregorian leap years. */
export function isLeapYear(year) {
  if (!Number.isInteger(year)) {
    throw new TypeError('year must be an integer.');
  }
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/**
 * Checks whether a date falls inside a range. Reversed range endpoints are accepted.
 * Endpoints are inclusive by default; pass { inclusive: false } for an open range.
 */
export function isDateInRange(date, startDate, endDate, options = {}) {
  const { inclusive = true } = options;
  if (typeof inclusive !== 'boolean') {
    throw new TypeError('options.inclusive must be a boolean.');
  }
  const timestamp = toDate(date, 'date').getTime();
  const start = toDate(startDate, 'startDate').getTime();
  const end = toDate(endDate, 'endDate').getTime();
  const lower = Math.min(start, end);
  const upper = Math.max(start, end);
  return inclusive ? timestamp >= lower && timestamp <= upper : timestamp > lower && timestamp < upper;
}

/** Throws a helpful TypeError and otherwise returns a defensive Date copy. */
export function assertValidDate(value, label = 'date') {
  return toDate(value, label);
}

/** Validates a numeric year/month/day triple without constructing a Date. */
export function isValidCalendarDate(year, month, day) {
  return isRealCalendarDate(year, month, day);
}
