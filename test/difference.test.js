import assert from 'node:assert/strict';
import test from 'node:test';
import { dateDifference } from '../src/index.js';

test('dateDifference returns days and normalized calendar duration', () => {
  const result = dateDifference('2020-01-31', '2021-03-01');
  assert.equal(result.totalDays, 395);
  assert.equal(result.years, 1);
  assert.equal(result.months, 1);
  assert.equal(result.days, 1);
  assert.equal(result.sign, 1);
});

test('dateDifference returns signed values for a reversed range', () => {
  assert.deepEqual(dateDifference('2025-03-05', '2024-01-04'), {
    totalDays: -426,
    years: -1,
    months: -2,
    days: -1,
    sign: -1,
    startDate: '2025-03-05',
    endDate: '2024-01-04',
  });
});

test('dateDifference treats equal dates as zero', () => {
  assert.equal(dateDifference('2025-01-01', '2025-01-01').totalDays, 0);
});
