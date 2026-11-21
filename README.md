# ChronoKit

ChronoKit is a dependency-free JavaScript date and time utility library for Node.js. It provides practical calendar arithmetic, validation, business-day counting, timezone display helpers, relative time, and calendar generation through modern ES module exports.

The npm package is named **`chronokit-js`**. The project and library branding remain **ChronoKit**.

## Features

- Age calculations with leap-day birthday handling
- Signed date differences and normalized years/months/days durations
- Working-day counts with holidays, custom weekends, or custom working days
- Token and locale-based date formatting
- IANA timezone validation and display-ready converted values
- Relative time such as “2 minutes ago” and “next month”
- Strict date validation that rejects ambiguous date strings
- Month-end-safe date arithmetic
- Countdowns, monthly calendar grids, and configurable week helpers
- No runtime dependencies

## Requirements

- Node.js 18.18 or later
- A runtime with the built-in `Intl` APIs (standard in supported Node.js releases)

## Installation

After publishing, install ChronoKit in your project terminal:

```bash
npm install chronokit-js
```

Then import the functions you need:

```js
import { calculateAge, formatDate } from 'chronokit-js';

console.log(calculateAge('2000-02-29', '2025-02-28'));
// { years: 25, months: 0, days: 0, dateOfBirth: '2000-02-29', referenceDate: '2025-02-28' }

console.log(formatDate('2025-07-04', 'DD MMM YYYY'));
// 04 Jul 2025
```

## Date parsing conventions

ChronoKit deliberately accepts only predictable inputs:

| Input | Meaning |
| --- | --- |
| `Date` | A defensive copy of a valid JavaScript `Date` |
| number | Unix timestamp in milliseconds |
| `YYYY-MM-DD` | A **local calendar date** (not UTC) |
| ISO date-time, e.g. `2025-07-04T12:30:00Z` | An exact instant; offsets are respected |
| ISO date-time without an offset, e.g. `2025-07-04T12:30` | Local date and time |

Ambiguous strings such as `04/07/2025`, `July 4, 2025`, and invalid dates such as `2025-02-29` are rejected with a helpful `TypeError`. Use a `Date` object or ISO format instead.

Calendar-focused functions compare local calendar days. This avoids the common UTC shift caused by `new Date('YYYY-MM-DD')` in native JavaScript.

## Quick start

```js
import {
  addMonths,
  countBusinessDays,
  dateDifference,
  formatRelativeTime,
  generateCalendar,
} from 'chronokit-js';

console.log(addMonths('2024-01-31', 1));
// Date representing local 2024-02-29

console.log(countBusinessDays('2025-01-06', '2025-01-13'));
// 5 (Monday through Friday; start included, end excluded)

console.log(dateDifference('2020-01-31', '2021-03-01'));
// { totalDays: 395, years: 1, months: 1, days: 1, sign: 1, ... }

console.log(formatRelativeTime('2025-01-03T12:00:00Z', '2025-01-01T12:00:00Z'));
// "in 2 days"

console.log(generateCalendar(2024, 2, { weekStartsOn: 1 }));
```

## API reference

### Age and date differences

#### `calculateAge(dateOfBirth, referenceDate = new Date())`

Returns `{ years, months, days, dateOfBirth, referenceDate }`. The two date strings in the result use `YYYY-MM-DD`. A future birth date throws `RangeError`. For a February 29 birthday, ChronoKit uses February 28 as the anniversary in a non-leap year.

```js
calculateAge('2000-02-29', '2001-02-28');
// { years: 1, months: 0, days: 0, ... }
```

#### `dateDifference(startDate, endDate)`

Returns `{ totalDays, years, months, days, sign, startDate, endDate }`.

- `totalDays` is the signed number of local calendar-day boundaries from start to end.
- `sign` is `1`, `0`, or `-1`.
- `years`, `months`, and `days` form a normalized calendar duration and use the same sign as the direction. A reversed range therefore returns negative values.

```js
dateDifference('2025-03-05', '2024-01-04');
// { totalDays: -426, years: -1, months: -2, days: -1, sign: -1, ... }
```

### Business days

#### `countBusinessDays(startDate, endDate, options = {})`

Counts business days from `startDate` **inclusive** to `endDate` **exclusive**. Reversing the range returns a negative count.

`options` may contain:

- `holidays`: array of dates to exclude
- `weekendDays`: weekday numbers to exclude; defaults to `[0, 6]` for Sunday and Saturday
- `workingDays`: explicit weekday numbers to include. When provided, it takes precedence over `weekendDays`.

```js
countBusinessDays('2025-12-22', '2025-12-29', {
  holidays: ['2025-12-25', '2025-12-26'],
});
// 3

countBusinessDays('2025-01-05', '2025-01-12', { workingDays: [0] });
// 1
```

#### `isBusinessDay(date, options = {})`

Uses the same options and returns a boolean for one date.

### Formatting

#### `formatDate(date, format = 'YYYY-MM-DD')`

Formats using these tokens: `YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `DD`, `D`, `HH`, `H`, `mm`, `m`, `ss`, and `s`. The named formats `ISO`, `US`, and `EU` map to `YYYY-MM-DD`, `MM/DD/YYYY`, and `DD/MM/YYYY`.

```js
formatDate('2025-03-04T05:06:07', 'DD MMM YYYY HH:mm:ss');
// "04 Mar 2025 05:06:07"
```

#### `toISODate(date)`

Returns the date's **local** calendar date as `YYYY-MM-DD`.

#### `formatLocaleDate(date, locales = 'en-US', options = {})`

Formats through `Intl.DateTimeFormat`. Use it for locale-specific output or native options.

```js
formatLocaleDate('2025-03-04T12:00:00Z', 'de-DE', {
  dateStyle: 'long',
  timeZone: 'Europe/Berlin',
});
```

### Timezones

#### `isValidTimeZone(timeZone)`

Returns whether the supplied IANA name is supported, for example `Asia/Kolkata` or `America/New_York`.

#### `formatInTimeZone(date, timeZone, locales = 'en-US', options = {})`

Formats an instant using `Intl.DateTimeFormat` in the requested zone.

#### `convertTimeZone(date, timeZone, options = {})`

Returns display-ready data for the same instant in another zone:

```js
convertTimeZone('2024-07-01T12:00:00Z', 'America/New_York');
// {
//   timeZone: 'America/New_York',
//   date: '2024-07-01', time: '08:00:00',
//   dateTime: '2024-07-01T08:00:00-04:00',
//   offset: '-04:00', offsetMinutes: -240,
//   instant: '2024-07-01T12:00:00.000Z', formatted: 'Jul 1, 2024, 8:00:00 AM'
// }
```

The optional object accepts `locales` and `formatOptions` for the `formatted` field.

#### `getCurrentTimeInTimeZone(timeZone, options = {})`

Returns the same shape as `convertTimeZone`, using the current instant.

#### Daylight-saving-time behavior

ChronoKit uses the runtime's `Intl` timezone database, so converting an **instant** applies the correct DST offset for that instant. JavaScript `Date` objects do not retain a named timezone. ChronoKit therefore does not try to guess how a wall-clock time in a source zone should resolve when that time is skipped or repeated during a DST change. Supply an ISO string with `Z` or an explicit offset whenever you need an unambiguous instant.

### Relative time

#### `formatRelativeTime(date, baseDate = new Date(), options = {})`

Returns localized relative wording using `Intl.RelativeTimeFormat`, such as `"2 minutes ago"`, `"yesterday"`, or `"next month"`. Options are `locales`, `numeric` (`'auto'` by default), and `style` (`'long'` by default).

```js
formatRelativeTime('2025-01-01T09:00:00Z', '2025-01-01T12:00:00Z');
// "3 hours ago"
```

### Validation

| Function | Parameters | Returns |
| --- | --- | --- |
| `isValidDate(value)` | supported date input | boolean |
| `assertValidDate(value, label = 'date')` | supported date input and optional error label | defensive `Date` copy or throws `TypeError` |
| `isLeapYear(year)` | integer Gregorian year | boolean; throws for non-integers |
| `isValidCalendarDate(year, month, day)` | numeric calendar fields | boolean |
| `isDateInRange(date, startDate, endDate, { inclusive = true })` | date inputs; reversed endpoints are accepted | boolean |

### Date arithmetic

All arithmetic functions return a new `Date`; they never mutate the supplied date. Amounts must be integers.

| Function | Result |
| --- | --- |
| `addDays(date, amount)` / `subtractDays(date, amount)` | Adds or subtracts local calendar days, preserving local time across DST |
| `addMonths(date, amount)` / `subtractMonths(date, amount)` | Adds or subtracts months and clamps month-end dates |
| `addYears(date, amount)` / `subtractYears(date, amount)` | Adds or subtracts years and clamps February 29 where required |

```js
toISODate(addMonths('2024-01-31', 1)); // '2024-02-29'
toISODate(addYears('2024-02-29', 1));  // '2025-02-28'
```

### Countdown

#### `countdown(targetDate, referenceDate = new Date())`

Returns `{ days, hours, minutes, seconds, totalSeconds, hasPassed }`. Units are always non-negative; `hasPassed` tells you whether the target is in the past.

```js
countdown('2025-01-03T01:02:03Z', '2025-01-01T00:00:00Z');
// { days: 2, hours: 1, minutes: 2, seconds: 3, totalSeconds: 176523, hasPassed: false }
```

### Calendar generation

#### `generateCalendar(year, month, options = {})`

`month` is 1 through 12. Options are `weekStartsOn` (0 Sunday through 6 Saturday), `includeAdjacentMonths` (default `false`), `locale`, and `weekday` (an `Intl` weekday style such as `'short'` or `'long'`).

Returns:

```js
{
  year: 2024,
  month: 2,
  weekStartsOn: 1,
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weeks: [[
    null,
    { date: '2024-02-01', day: 1, weekday: 4, isCurrentMonth: true, isToday: false },
    // ...
  ]]
}
```

Empty cells are `null` unless adjacent months are requested. Each real cell identifies its date, weekday, current-month status, and whether it is today.

### Week utilities

| Function | Description |
| --- | --- |
| `getDayOfWeek(date)` | Returns 0 for Sunday through 6 for Saturday. |
| `getWeekdayName(date, locales = 'en-US', options = { weekday: 'long' })` | Returns a localized weekday name. |
| `startOfWeek(date, { weekStartsOn = 0 })` | Returns local midnight at the first day of the week. |
| `endOfWeek(date, { weekStartsOn = 0 })` | Returns 23:59:59.999 local time at the final day of the week. |
| `getWeekNumber(date, { weekStartsOn = 0 })` | Returns the number of the week containing the date, where week 1 contains January 1. |

## Error handling

Invalid dates, invalid options, malformed timezone names, and non-integer arithmetic amounts throw `TypeError` or `RangeError` with a specific explanation. If dates originate in user input, validate first with `isValidDate()` or wrap the operation in `try`/`catch`.

```js
import { isValidDate, addDays } from 'chronokit-js';

if (isValidDate(userInput)) {
  console.log(addDays(userInput, 7));
} else {
  console.error('Please enter a date in YYYY-MM-DD format.');
}
```

## Testing

From the ChronoKit project folder, run:

```bash
npm test
```

This executes the built-in Node.js test runner (`node:test` and `node:assert`) across all feature modules. You can also run the included examples:

```bash
npm run example:basic
npm run example:advanced
```

## Project structure

```text
chronokit/
├── src/          # Library modules and central index.js export
├── test/         # Automated node:test suites
├── examples/     # Runnable examples
├── .github/      # GitHub Actions test workflow
├── package.json  # npm package metadata and scripts
├── package-lock.json
├── README.md
└── LICENSE
```

## Contributing

1. Create a branch for one focused change.
2. Add or update tests for the behavior.
3. Run `npm test` locally.
4. Keep public behavior and date/time assumptions documented.
5. Open a pull request explaining the change and test results.

## License

ChronoKit is released under the [MIT License](LICENSE).
