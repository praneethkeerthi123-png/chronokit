import assert from 'node:assert/strict';
import test from 'node:test';
import { convertTimeZone, formatInTimeZone, getCurrentTimeInTimeZone, isValidTimeZone } from '../src/index.js';

test('isValidTimeZone validates IANA identifiers', () => {
  assert.equal(isValidTimeZone('Asia/Kolkata'), true);
  assert.equal(isValidTimeZone('Not/A_Timezone'), false);
});

test('convertTimeZone preserves the instant and accounts for daylight saving time', () => {
  const converted = convertTimeZone('2024-07-01T12:00:00Z', 'America/New_York');
  assert.equal(converted.dateTime, '2024-07-01T08:00:00-04:00');
  assert.equal(converted.instant, '2024-07-01T12:00:00.000Z');
});

test('convertTimeZone handles the DST spring-forward transition', () => {
  assert.equal(
    convertTimeZone('2024-03-10T06:59:00Z', 'America/New_York').dateTime,
    '2024-03-10T01:59:00-05:00',
  );
  assert.equal(
    convertTimeZone('2024-03-10T07:01:00Z', 'America/New_York').dateTime,
    '2024-03-10T03:01:00-04:00',
  );
});

test('timezone formatting and current-time helper return values for valid zones', () => {
  assert.match(formatInTimeZone('2025-01-01T00:00:00Z', 'Asia/Kolkata', 'en-GB', { timeZoneName: 'short' }), /2025/);
  assert.equal(getCurrentTimeInTimeZone('UTC').timeZone, 'UTC');
  assert.throws(() => convertTimeZone('2025-01-01', 'Mars/Olympus'), /Invalid IANA time zone/);
});
