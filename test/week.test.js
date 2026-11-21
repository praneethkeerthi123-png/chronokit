import assert from 'node:assert/strict';
import test from 'node:test';
import { endOfWeek, getDayOfWeek, getWeekNumber, getWeekdayName, startOfWeek, toISODate } from '../src/index.js';

test('week utilities use configurable week starts', () => {
  assert.equal(getDayOfWeek('2025-06-18'), 3);
  assert.equal(toISODate(startOfWeek('2025-06-18', { weekStartsOn: 1 })), '2025-06-16');
  assert.equal(toISODate(endOfWeek('2025-06-18', { weekStartsOn: 1 })), '2025-06-22');
});

test('getWeekNumber uses the week containing January 1 as week 1', () => {
  assert.equal(getWeekNumber('2025-01-01', { weekStartsOn: 1 }), 1);
  assert.equal(getWeekNumber('2025-01-06', { weekStartsOn: 1 }), 2);
  assert.equal(getWeekdayName('2025-06-18', 'en-US'), 'Wednesday');
});
