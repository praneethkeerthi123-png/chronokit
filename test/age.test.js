import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateAge } from '../src/index.js';

test('calculateAge returns normalized calendar age', () => {
  assert.deepEqual(calculateAge('2000-05-15', '2025-08-20'), {
    years: 25,
    months: 3,
    days: 5,
    dateOfBirth: '2000-05-15',
    referenceDate: '2025-08-20',
  });
});

test('calculateAge handles February 29 birthdays in a non-leap year', () => {
  assert.deepEqual(calculateAge('2000-02-29', '2001-02-28'), {
    years: 1,
    months: 0,
    days: 0,
    dateOfBirth: '2000-02-29',
    referenceDate: '2001-02-28',
  });
});

test('calculateAge rejects invalid and future birth dates', () => {
  assert.throws(() => calculateAge('2023-02-29', '2024-01-01'), /invalid calendar date/);
  assert.throws(() => calculateAge('2025-01-02', '2025-01-01'), /cannot be after/);
});
