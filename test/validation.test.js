import assert from 'node:assert/strict';
import test from 'node:test';
import { assertValidDate, isDateInRange, isLeapYear, isValidCalendarDate, isValidDate } from '../src/index.js';

test('isValidDate accepts only supported unambiguous input', () => {
  assert.equal(isValidDate('2024-02-29'), true);
  assert.equal(isValidDate('2023-02-29'), false);
  assert.equal(isValidDate('02/29/2024'), false);
  assert.equal(isValidDate(new Date('invalid')), false);
  assert.equal(isValidDate(undefined), false);
});

test('leap-year validation follows Gregorian rules', () => {
  assert.equal(isLeapYear(2024), true);
  assert.equal(isLeapYear(1900), false);
  assert.equal(isLeapYear(2000), true);
  assert.equal(isValidCalendarDate(2024, 2, 29), true);
});

test('ranges are inclusive by default and accept reversed bounds', () => {
  assert.equal(isDateInRange('2025-01-05', '2025-01-10', '2025-01-01'), true);
  assert.equal(isDateInRange('2025-01-01', '2025-01-01', '2025-01-10', { inclusive: false }), false);
  assert.throws(() => assertValidDate('January 1, 2025'), /ambiguous date strings/);
  assert.throws(() => assertValidDate(), /must be a Date/);
});
