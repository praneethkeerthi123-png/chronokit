import assert from 'node:assert/strict';
import test from 'node:test';
import { generateCalendar } from '../src/index.js';

test('generateCalendar builds a leap-year February grid', () => {
  const calendar = generateCalendar(2024, 2, { weekStartsOn: 1 });
  const currentMonthDays = calendar.weeks.flat().filter((cell) => cell?.isCurrentMonth);
  assert.equal(calendar.weekdays[0], 'Mon');
  assert.equal(currentMonthDays.length, 29);
  assert.equal(currentMonthDays.at(-1).date, '2024-02-29');
});

test('generateCalendar can fill adjacent-month cells', () => {
  const calendar = generateCalendar(2025, 2, { includeAdjacentMonths: true });
  assert.equal(calendar.weeks[0][0].date, '2025-01-26');
  assert.equal(calendar.weeks.at(-1).at(-1).date, '2025-03-01');
});

test('generateCalendar validates its bounds and options', () => {
  assert.throws(() => generateCalendar(2025, 13), /1 to 12/);
  assert.throws(() => generateCalendar(2025, 1, { weekStartsOn: 7 }), /0 \(Sunday\) to 6/);
});
