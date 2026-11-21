/** @internal */
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
/** @internal */
const ISO_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})?$/;

/** @internal */
export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** @internal */
export function isRealCalendarDate(year, month, day) {
  return (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    Number.isInteger(day) &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth(year, month - 1)
  );
}

/**
 * Parses a Date, Unix timestamp, ISO date-only string, or ISO date-time string.
 * Date-only strings are interpreted as local calendar dates, never as UTC.
 *
 * @internal
 */
export function toDate(value, label = 'date') {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError(`${label} must be a valid Date.`);
    }
    return new Date(value.getTime());
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isFinite(value) || Number.isNaN(date.getTime())) {
      throw new TypeError(`${label} must be a valid Unix timestamp.`);
    }
    return date;
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(
      `${label} must be a Date, Unix timestamp, YYYY-MM-DD string, or ISO date-time string.`,
    );
  }

  const input = value.trim();
  const dateOnlyMatch = input.match(DATE_ONLY_PATTERN);
  if (dateOnlyMatch) {
    const [, yearText, monthText, dayText] = dateOnlyMatch;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    if (!isRealCalendarDate(year, month, day)) {
      throw new TypeError(`${label} contains an invalid calendar date: ${input}.`);
    }
    return new Date(year, month - 1, day);
  }

  const dateTimeMatch = input.match(ISO_DATE_TIME_PATTERN);
  if (dateTimeMatch) {
    const [, yearText, monthText, dayText] = dateTimeMatch;
    if (!isRealCalendarDate(Number(yearText), Number(monthText), Number(dayText))) {
      throw new TypeError(`${label} contains an invalid calendar date: ${input}.`);
    }
    const date = new Date(input);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  throw new TypeError(
    `${label} must use YYYY-MM-DD or an ISO 8601 date-time string; ambiguous date strings are not supported.`,
  );
}

/** @internal */
export function startOfLocalDay(value, label = 'date') {
  const date = toDate(value, label);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** @internal */
export function toDateKey(value, label = 'date') {
  const date = toDate(value, label);
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** @internal */
export function calendarDayDifference(startDate, endDate) {
  const start = startOfLocalDay(startDate, 'startDate');
  const end = startOfLocalDay(endDate, 'endDate');
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((endUtc - startUtc) / 86_400_000);
}

/** @internal */
export function compareCalendarDates(left, right) {
  return Math.sign(calendarDayDifference(right, left));
}

/** @internal */
export function addCalendarMonths(dateValue, amount) {
  const date = toDate(dateValue);
  const originalDay = date.getDate();
  const targetIndex = date.getMonth() + amount;
  const targetYear = date.getFullYear() + Math.floor(targetIndex / 12);
  const targetMonth = ((targetIndex % 12) + 12) % 12;
  date.setDate(1);
  date.setFullYear(targetYear, targetMonth, 1);
  date.setDate(Math.min(originalDay, daysInMonth(targetYear, targetMonth)));
  return date;
}

/** @internal */
export function assertInteger(value, label) {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label} must be an integer.`);
  }
}

/** @internal */
export function assertWeekday(value, label = 'weekday') {
  if (!Number.isInteger(value) || value < 0 || value > 6) {
    throw new RangeError(`${label} must be an integer from 0 (Sunday) to 6 (Saturday).`);
  }
}
