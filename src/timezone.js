import { toDate } from './utils.js';

function assertTimeZone(timeZone) {
  if (typeof timeZone !== 'string' || timeZone.trim() === '') {
    throw new TypeError('timeZone must be a non-empty IANA time zone identifier.');
  }
  try {
    new Intl.DateTimeFormat('en-US', { timeZone }).format();
  } catch {
    throw new RangeError(`Invalid IANA time zone: ${timeZone}.`);
  }
  return timeZone;
}

function zonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function offsetString(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const absolute = Math.abs(minutes);
  return `${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
}

/** Returns true only for IANA time zone identifiers supported by this runtime. */
export function isValidTimeZone(timeZone) {
  try {
    assertTimeZone(timeZone);
    return true;
  } catch {
    return false;
  }
}

/** Formats an instant in an IANA time zone using Intl.DateTimeFormat. */
export function formatInTimeZone(date, timeZone, locales = 'en-US', options = {}) {
  assertTimeZone(timeZone);
  const value = toDate(date);
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an Intl.DateTimeFormat options object.');
  }
  try {
    return new Intl.DateTimeFormat(locales, { ...options, timeZone }).format(value);
  } catch (error) {
    throw new RangeError(`Invalid locale or timezone format options: ${error.message}`);
  }
}

/**
 * Converts an instant to display-ready fields in another time zone.
 * The original instant is unchanged; a JavaScript Date does not carry a time zone.
 */
export function convertTimeZone(date, timeZone, options = {}) {
  assertTimeZone(timeZone);
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object.');
  }
  const value = toDate(date);
  const parts = zonedParts(value, timeZone);
  const displayedAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  const offsetMinutes = Math.round((displayedAsUtc - value.getTime()) / 60_000);
  const offset = offsetString(offsetMinutes);
  const dateText = `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
  const timeText = `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}:${String(parts.second).padStart(2, '0')}`;
  const locales = options.locales ?? 'en-US';
  const formatOptions = options.formatOptions ?? {
    dateStyle: 'medium',
    timeStyle: 'medium',
  };
  return {
    timeZone,
    date: dateText,
    time: timeText,
    dateTime: `${dateText}T${timeText}${offset}`,
    offset,
    offsetMinutes,
    instant: value.toISOString(),
    formatted: formatInTimeZone(value, timeZone, locales, formatOptions),
  };
}

/** Returns the current instant represented as display-ready values in a time zone. */
export function getCurrentTimeInTimeZone(timeZone, options = {}) {
  return convertTimeZone(new Date(), timeZone, options);
}
