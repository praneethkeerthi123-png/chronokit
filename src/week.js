import { addDays } from './arithmetic.js';
import { assertWeekday, startOfLocalDay, toDate } from './utils.js';

function weekStartsOnFrom(options) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object.');
  }
  const weekStartsOn = options.weekStartsOn ?? 0;
  assertWeekday(weekStartsOn, 'options.weekStartsOn');
  return weekStartsOn;
}

/** Returns the weekday number: 0 is Sunday and 6 is Saturday. */
export function getDayOfWeek(date) {
  return toDate(date).getDay();
}

/** Returns a localized weekday name. */
export function getWeekdayName(date, locales = 'en-US', options = { weekday: 'long' }) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an Intl.DateTimeFormat options object.');
  }
  return new Intl.DateTimeFormat(locales, { weekday: 'long', ...options }).format(toDate(date));
}

/** Returns local midnight at the first day of the configured week. */
export function startOfWeek(date, options = {}) {
  const weekStartsOn = weekStartsOnFrom(options);
  const result = startOfLocalDay(date);
  return addDays(result, -((result.getDay() - weekStartsOn + 7) % 7));
}

/** Returns 23:59:59.999 local time on the final day of the configured week. */
export function endOfWeek(date, options = {}) {
  const result = addDays(startOfWeek(date, options), 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Gets the week number with week 1 defined as the week containing January 1.
 * `weekStartsOn` controls which day starts each week.
 */
export function getWeekNumber(date, options = {}) {
  const value = startOfLocalDay(date);
  const yearStart = new Date(value.getFullYear(), 0, 1);
  const firstWeekStart = startOfWeek(yearStart, options);
  const elapsed = Math.round((value - firstWeekStart) / 86_400_000);
  return Math.floor(elapsed / 7) + 1;
}
