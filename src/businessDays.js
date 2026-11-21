import { addDays } from './arithmetic.js';
import { calendarDayDifference, startOfLocalDay, toDateKey } from './utils.js';

const DEFAULT_WEEKEND_DAYS = [0, 6];

function normalizeWeekdays(values, label) {
  if (!Array.isArray(values)) {
    throw new TypeError(`${label} must be an array of weekday numbers from 0 to 6.`);
  }
  const result = new Set();
  for (const day of values) {
    if (!Number.isInteger(day) || day < 0 || day > 6) {
      throw new RangeError(`${label} entries must be integers from 0 (Sunday) to 6 (Saturday).`);
    }
    result.add(day);
  }
  return result;
}

function normalizeOptions(options = {}) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object.');
  }
  const holidays = options.holidays ?? [];
  if (!Array.isArray(holidays)) {
    throw new TypeError('options.holidays must be an array of valid dates.');
  }
  const holidayKeys = new Set(holidays.map((holiday) => toDateKey(holiday, 'holiday')));
  const workingDays = options.workingDays === undefined
    ? null
    : normalizeWeekdays(options.workingDays, 'options.workingDays');
  const weekendDays = normalizeWeekdays(options.weekendDays ?? DEFAULT_WEEKEND_DAYS, 'options.weekendDays');
  return { holidayKeys, workingDays, weekendDays };
}

/** Returns true when a date is a working day according to the supplied rules. */
export function isBusinessDay(date, options = {}) {
  const normalized = normalizeOptions(options);
  const day = startOfLocalDay(date, 'date');
  const isWorkingWeekday = normalized.workingDays
    ? normalized.workingDays.has(day.getDay())
    : !normalized.weekendDays.has(day.getDay());
  return isWorkingWeekday && !normalized.holidayKeys.has(toDateKey(day));
}

/**
 * Counts working days from startDate (included) up to endDate (excluded).
 * A reversed range returns the negative of the corresponding forward count.
 */
export function countBusinessDays(startDate, endDate, options = {}) {
  const start = startOfLocalDay(startDate, 'startDate');
  const end = startOfLocalDay(endDate, 'endDate');
  const normalized = normalizeOptions(options);
  const calendarDays = calendarDayDifference(start, end);
  if (calendarDays === 0) return 0;

  if (calendarDays < 0) {
    return -countBusinessDays(end, start, options);
  }

  let count = 0;
  for (let current = start; current < end; current = addDays(current, 1)) {
    const isWorkingWeekday = normalized.workingDays
      ? normalized.workingDays.has(current.getDay())
      : !normalized.weekendDays.has(current.getDay());
    if (isWorkingWeekday && !normalized.holidayKeys.has(toDateKey(current))) {
      count += 1;
    }
  }
  return count;
}
