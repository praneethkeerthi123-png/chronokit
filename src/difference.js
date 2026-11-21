import { addCalendarMonths, calendarDayDifference, startOfLocalDay, toDateKey } from './utils.js';

function positiveCalendarDuration(start, end) {
  let wholeMonths = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  let monthAnchor = addCalendarMonths(start, wholeMonths);

  if (monthAnchor > end) {
    wholeMonths -= 1;
    monthAnchor = addCalendarMonths(start, wholeMonths);
  }

  return {
    years: Math.floor(wholeMonths / 12),
    months: wholeMonths % 12,
    days: calendarDayDifference(monthAnchor, end),
  };
}

/**
 * Calculates a signed calendar difference from startDate to endDate.
 *
 * `totalDays` is the signed number of local calendar-day boundaries crossed.
 * `years`, `months`, and `days` are also signed, with their absolute values
 * forming a normalized calendar duration. Dates are compared at local midnight.
 */
export function dateDifference(startDate, endDate) {
  const start = startOfLocalDay(startDate, 'startDate');
  const end = startOfLocalDay(endDate, 'endDate');
  const totalDays = calendarDayDifference(start, end);

  if (totalDays === 0) {
    return {
      totalDays: 0,
      years: 0,
      months: 0,
      days: 0,
      sign: 0,
      startDate: toDateKey(start),
      endDate: toDateKey(end),
    };
  }

  const sign = totalDays > 0 ? 1 : -1;
  const [earlier, later] = sign === 1 ? [start, end] : [end, start];
  const duration = positiveCalendarDuration(earlier, later);
  return {
    totalDays,
    years: duration.years * sign,
    months: duration.months * sign,
    days: duration.days * sign,
    sign,
    startDate: toDateKey(start),
    endDate: toDateKey(end),
  };
}
