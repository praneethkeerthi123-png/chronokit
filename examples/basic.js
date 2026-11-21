import {
  addDays,
  calculateAge,
  countBusinessDays,
  formatDate,
  formatRelativeTime,
} from '../src/index.js';

console.log('Age:', calculateAge('2000-02-29', '2025-02-28'));
console.log('Working days:', countBusinessDays('2025-01-06', '2025-01-13'));
console.log('Next week:', formatDate(addDays('2025-01-01', 7), 'DD MMM YYYY'));
console.log('Relative:', formatRelativeTime('2025-01-03T12:00:00Z', '2025-01-01T12:00:00Z'));
