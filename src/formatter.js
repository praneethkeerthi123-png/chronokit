import { toDate, toDateKey } from './utils.js';

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

/** Returns a local-calendar ISO date (`YYYY-MM-DD`), avoiding UTC date shifts. */
export function toISODate(date) {
  return toDateKey(date);
}

/**
 * Formats a date using readable tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D, HH, H, mm, m, ss, s.
 * Pass `ISO`, `US`, or `EU` for common formats.
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const value = toDate(date);
  if (typeof format !== 'string') {
    throw new TypeError('format must be a formatting string. Use formatLocaleDate for Intl options.');
  }
  const pattern = {
    ISO: 'YYYY-MM-DD',
    US: 'MM/DD/YYYY',
    EU: 'DD/MM/YYYY',
  }[format] ?? format;
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
  const shortMonthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const replacements = {
    YYYY: pad(value.getFullYear(), 4),
    YY: pad(value.getFullYear() % 100),
    MMMM: monthFormatter.format(value),
    MMM: shortMonthFormatter.format(value),
    MM: pad(value.getMonth() + 1),
    M: String(value.getMonth() + 1),
    DD: pad(value.getDate()),
    D: String(value.getDate()),
    HH: pad(value.getHours()),
    H: String(value.getHours()),
    mm: pad(value.getMinutes()),
    m: String(value.getMinutes()),
    ss: pad(value.getSeconds()),
    s: String(value.getSeconds()),
  };
  return pattern.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s/g, (token) => replacements[token]);
}

/** Formats a date with the host's Intl implementation and user-supplied locale options. */
export function formatLocaleDate(date, locales = 'en-US', options = {}) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an Intl.DateTimeFormat options object.');
  }
  const value = toDate(date);
  try {
    return new Intl.DateTimeFormat(locales, options).format(value);
  } catch (error) {
    throw new RangeError(`Invalid locale or formatting options: ${error.message}`);
  }
}
