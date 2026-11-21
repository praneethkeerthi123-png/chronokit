import {
  convertTimeZone,
  dateDifference,
  generateCalendar,
  isBusinessDay,
  startOfWeek,
  toISODate,
} from '../src/index.js';

const holidays = ['2025-12-25', '2025-12-26'];
console.log('Tokyo time:', convertTimeZone('2025-07-01T12:00:00Z', 'Asia/Tokyo'));
console.log('Calendar duration:', dateDifference('2020-01-31', '2021-03-01'));
console.log('Friday is working:', isBusinessDay('2025-12-26', { holidays }));
console.log('Week begins:', toISODate(startOfWeek('2025-06-18', { weekStartsOn: 1 })));
console.dir(generateCalendar(2024, 2, { weekStartsOn: 1, includeAdjacentMonths: true }), { depth: null });
