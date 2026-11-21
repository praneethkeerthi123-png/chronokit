import assert from 'node:assert/strict';
import test from 'node:test';
import { countdown } from '../src/index.js';

test('countdown splits future duration into units', () => {
  assert.deepEqual(countdown('2025-01-03T01:02:03Z', '2025-01-01T00:00:00Z'), {
    days: 2,
    hours: 1,
    minutes: 2,
    seconds: 3,
    totalSeconds: 176_523,
    hasPassed: false,
  });
});

test('countdown marks a past target without returning negative units', () => {
  const result = countdown('2025-01-01T00:00:00Z', '2025-01-01T00:00:01Z');
  assert.equal(result.seconds, 1);
  assert.equal(result.hasPassed, true);
});
