import { dateDifference } from './difference.js';
import { calendarDayDifference, startOfLocalDay, toDateKey } from './utils.js';

/**
 * Calculates age as complete calendar years, months, and days.
 * February 29 birthdays use February 28 as their anniversary in non-leap years.
 */
export function calculateAge(dateOfBirth, referenceDate = new Date()) {
  const birth = startOfLocalDay(dateOfBirth, 'dateOfBirth');
  const reference = startOfLocalDay(referenceDate, 'referenceDate');
  if (calendarDayDifference(birth, reference) < 0) {
    throw new RangeError('dateOfBirth cannot be after referenceDate.');
  }

  const difference = dateDifference(birth, reference);
  return {
    years: difference.years,
    months: difference.months,
    days: difference.days,
    dateOfBirth: toDateKey(birth),
    referenceDate: toDateKey(reference),
  };
}
