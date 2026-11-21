import { toDate } from './utils.js';

/**
 * Breaks the absolute time remaining into days, hours, minutes, and seconds.
 * `hasPassed` is true only when targetDate is earlier than referenceDate.
 */
export function countdown(targetDate, referenceDate = new Date()) {
  const target = toDate(targetDate, 'targetDate');
  const reference = toDate(referenceDate, 'referenceDate');
  const differenceMs = target.getTime() - reference.getTime();
  const totalSeconds = Math.floor(Math.abs(differenceMs) / 1_000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    hasPassed: differenceMs < 0,
  };
}
