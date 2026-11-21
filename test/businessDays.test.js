import assert from 'node:assert/strict';
import test from 'node:test';
import { countBusinessDays, isBusinessDay } from '../src/index.js';

test('countBusinessDays excludes the default weekend in a start-inclusive, end-exclusive range', () => {
  assert.equal(countBusinessDays('2025-01-06', '2025-01-13'), 5);
  assert.equal(countBusinessDays('2025-01-13', '2025-01-06'), -5);
});

test('countBusinessDays excludes supplied holidays', () => {
  assert.equal(countBusinessDays('2025-01-06', '2025-01-13', { holidays: ['2025-01-08'] }), 4);
});

test('business-day rules can use custom weekends or explicit working days', () => {
  assert.equal(countBusinessDays('2025-01-03', '2025-01-06', { weekendDays: [5, 6] }), 1);
  assert.equal(countBusinessDays('2025-01-05', '2025-01-12', { workingDays: [0] }), 1);
  assert.equal(isBusinessDay('2025-01-05', { workingDays: [0] }), true);
});
