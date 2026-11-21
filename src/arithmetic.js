import { addCalendarMonths, assertInteger, daysInMonth, toDate } from './utils.js';

function assertAmount(amount) {
  assertInteger(amount, 'amount');
}

/** Adds local calendar days, preserving the time of day across DST boundaries. */
export function addDays(date, amount) {
  assertAmount(amount);
  const result = toDate(date);
  result.setDate(result.getDate() + amount);
  return result;
}

/** Subtracts local calendar days. */
export function subtractDays(date, amount) {
  assertAmount(amount);
  return addDays(date, -amount);
}

/** Adds months and clamps month-end dates (January 31 + 1 month is February 28/29). */
export function addMonths(date, amount) {
  assertAmount(amount);
  return addCalendarMonths(date, amount);
}

/** Subtracts months and clamps month-end dates. */
export function subtractMonths(date, amount) {
  assertAmount(amount);
  return addMonths(date, -amount);
}

/** Adds Gregorian calendar years and clamps February 29 to February 28 when needed. */
export function addYears(date, amount) {
  assertAmount(amount);
  const result = toDate(date);
  const originalDay = result.getDate();
  const targetYear = result.getFullYear() + amount;
  const month = result.getMonth();
  result.setDate(1);
  result.setFullYear(targetYear);
  result.setDate(Math.min(originalDay, daysInMonth(targetYear, month)));
  return result;
}

/** Subtracts Gregorian calendar years. */
export function subtractYears(date, amount) {
  assertAmount(amount);
  return addYears(date, -amount);
}
