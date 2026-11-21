import assert from 'node:assert/strict';
import test from 'node:test';
import { addDays, addMonths, addYears, subtractDays, subtractMonths, subtractYears, toISODate } from '../src/index.js';

test('day arithmetic crosses month and year boundaries', () => {
  assert.equal(toISODate(addDays('2024-12-31', 1)), '2025-01-01');
  assert.equal(toISODate(subtractDays('2025-01-01', 1)), '2024-12-31');
});

test('month arithmetic clamps dates at month end', () => {
  assert.equal(toISODate(addMonths('2024-01-31', 1)), '2024-02-29');
  assert.equal(toISODate(addMonths('2023-01-31', 1)), '2023-02-28');
  assert.equal(toISODate(subtractMonths('2025-03-31', 1)), '2025-02-28');
});

test('year arithmetic handles February 29 and rejects non-integer values', () => {
  assert.equal(toISODate(addYears('2024-02-29', 1)), '2025-02-28');
  assert.equal(toISODate(subtractYears('2024-02-29', 4)), '2020-02-29');
  assert.throws(() => addDays('2025-01-01', 1.5), /integer/);
});
