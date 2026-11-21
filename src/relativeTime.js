import { calendarDayDifference, startOfLocalDay, toDate } from './utils.js';

function relativeFormatter(options) {
  try {
    return new Intl.RelativeTimeFormat(options.locales ?? 'en', {
      numeric: options.numeric ?? 'auto',
      style: options.style ?? 'long',
    });
  } catch (error) {
    throw new RangeError(`Invalid relative-time locale or options: ${error.message}`);
  }
}

/**
 * Formats the difference from baseDate to date (for example, "2 minutes ago").
 * Calendar-day, month, and year wording follows the local calendar of the runtime.
 */
export function formatRelativeTime(date, baseDate = new Date(), options = {}) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object.');
  }
  const target = toDate(date, 'date');
  const base = toDate(baseDate, 'baseDate');
  const formatter = relativeFormatter(options);
  const differenceMs = target.getTime() - base.getTime();
  const absSeconds = Math.abs(differenceMs) / 1_000;
  const signed = (unitSize) => Math.round(differenceMs / unitSize);

  if (absSeconds < 45) return formatter.format(signed(1_000), 'second');
  if (absSeconds < 45 * 60) return formatter.format(signed(60_000), 'minute');
  if (absSeconds < 22 * 60 * 60) return formatter.format(signed(3_600_000), 'hour');

  const dayDifference = calendarDayDifference(startOfLocalDay(base), startOfLocalDay(target));
  if (Math.abs(dayDifference) <= 6) return formatter.format(dayDifference, 'day');
  if (Math.abs(dayDifference) < 28) return formatter.format(Math.round(dayDifference / 7), 'week');

  const monthDifference =
    (target.getFullYear() - base.getFullYear()) * 12 + target.getMonth() - base.getMonth();
  if (Math.abs(monthDifference) < 12 && monthDifference !== 0) {
    return formatter.format(monthDifference, 'month');
  }
  return formatter.format(Math.round(monthDifference / 12), 'year');
}
