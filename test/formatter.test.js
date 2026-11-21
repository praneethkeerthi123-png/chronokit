import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDate, formatLocaleDate, toISODate } from '../src/index.js';

const localDate = new Date(2025, 2, 4, 5, 6, 7);

test('formatDate supports common formats and custom tokens', () => {
  assert.equal(formatDate(localDate), '2025-03-04');
  assert.equal(formatDate(localDate, 'US'), '03/04/2025');
  assert.equal(formatDate(localDate, 'DD MMM YYYY HH:mm:ss'), '04 Mar 2025 05:06:07');
  assert.equal(toISODate(localDate), '2025-03-04');
});

test('formatLocaleDate delegates to Intl formatting', () => {
  assert.equal(formatLocaleDate('2025-03-04T12:00:00Z', 'en-GB', { timeZone: 'UTC' }), '04/03/2025');
});

test('formatters reject invalid input', () => {
  assert.throws(() => formatDate('03/04/2025'), /ambiguous date strings/);
});
