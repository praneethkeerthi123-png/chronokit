import { addDays } from './arithmetic.js';
import { assertInteger, assertWeekday, daysInMonth, toDateKey } from './utils.js';

function createLocalDate(year, monthIndex, day) {
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, monthIndex, day);
  return date;
}

function weekdayNames(weekStartsOn, locale, weekday) {
  try {
    const formatter = new Intl.DateTimeFormat(locale, { weekday, timeZone: 'UTC' });
    const sunday = new Date(Date.UTC(2023, 0, 1));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sunday);
      date.setUTCDate(sunday.getUTCDate() + ((weekStartsOn + index) % 7));
      return formatter.format(date);
    });
  } catch (error) {
    throw new RangeError(`Invalid calendar locale or weekday format: ${error.message}`);
  }
}

/**
 * Generates a monthly calendar matrix. `month` is 1-12 and weekStartsOn is
 * 0-6 (Sunday-Saturday). Empty leading/trailing cells are null unless
 * includeAdjacentMonths is true.
 */
export function generateCalendar(year, month, options = {}) {
  assertInteger(year, 'year');
  assertInteger(month, 'month');
  if (year < 1 || year > 275_760) {
    throw new RangeError('year must be between 1 and 275760.');
  }
  if (month < 1 || month > 12) {
    throw new RangeError('month must be an integer from 1 to 12.');
  }
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('options must be an object.');
  }
  const weekStartsOn = options.weekStartsOn ?? 0;
  assertWeekday(weekStartsOn, 'options.weekStartsOn');
  const includeAdjacentMonths = options.includeAdjacentMonths ?? false;
  if (typeof includeAdjacentMonths !== 'boolean') {
    throw new TypeError('options.includeAdjacentMonths must be a boolean.');
  }
  const locale = options.locale ?? 'en-US';
  const weekday = options.weekday ?? 'short';
  const first = createLocalDate(year, month - 1, 1);
  const leadingCells = (first.getDay() - weekStartsOn + 7) % 7;
  const daysThisMonth = daysInMonth(year, month - 1);
  const totalCells = leadingCells + daysThisMonth;
  const trailingCells = (7 - (totalCells % 7)) % 7;
  const cellCount = totalCells + trailingCells;
  const firstGridDate = addDays(first, -leadingCells);
  const todayKey = toDateKey(new Date());
  const cells = [];

  for (let index = 0; index < cellCount; index += 1) {
    const cellDate = addDays(firstGridDate, index);
    const isCurrentMonth = cellDate.getFullYear() === year && cellDate.getMonth() === month - 1;
    if (!isCurrentMonth && !includeAdjacentMonths) {
      cells.push(null);
      continue;
    }
    cells.push({
      date: toDateKey(cellDate),
      day: cellDate.getDate(),
      weekday: cellDate.getDay(),
      isCurrentMonth,
      isToday: toDateKey(cellDate) === todayKey,
    });
  }

  const weeks = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return {
    year,
    month,
    weekStartsOn,
    weekdays: weekdayNames(weekStartsOn, locale, weekday),
    weeks,
  };
}
