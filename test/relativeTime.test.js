import assert from 'node:assert/strict';
import test from 'node:test';
import { formatRelativeTime } from '../src/index.js';

test('formatRelativeTime produces relative seconds, minutes, and hours', () => {
  assert.equal(formatRelativeTime('2025-01-01T12:02:00Z', '2025-01-01T12:00:00Z'), 'in 2 minutes');
  assert.equal(formatRelativeTime('2025-01-01T09:00:00Z', '2025-01-01T12:00:00Z'), '3 hours ago');
});

test('formatRelativeTime uses automatic calendar wording', () => {
  assert.equal(formatRelativeTime('2025-01-01T12:00:00Z', '2025-01-02T12:00:00Z'), 'yesterday');
  assert.equal(formatRelativeTime('2025-02-01T12:00:00Z', '2025-01-01T12:00:00Z'), 'next month');
});
