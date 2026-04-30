const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const root = path.join(__dirname, '..');

function readCsvRows(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(',').map((h) => h.trim());
  return lines.map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return headers.reduce((acc, key, idx) => {
      acc[key] = values[idx] ?? '';
      return acc;
    }, {});
  });
}

function readExcelRows(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: '' });
}

function toYearLabel(value) {
  const year = Number(value);
  if (year === 1) return '1st Year';
  if (year === 2) return '2nd Year';
  if (year === 3) return '3rd Year';
  if (year === 4) return '4th Year';
  return String(value || '1st Year');
}

const eventsRaw = readCsvRows(path.join(root, 'data', 'events (5).csv'));
const resultsRaw = readCsvRows(path.join(root, 'data', 'results.csv'));
const participantsRaw = readExcelRows(path.join(root, 'data', 'final_matched_participants.xlsx'));
const participationRaw = readExcelRows(path.join(root, 'data', 'updated_participation.xlsx'));

const departmentNames = [...new Set(eventsRaw.map((row) => row.department))];
const departments = departmentNames.map((departmentName, index) => ({
  id: index + 1,
  department_name: departmentName,
}));
const departmentLookup = Object.fromEntries(departments.map((dept) => [dept.department_name, dept.id]));

const events = eventsRaw.map((row) => ({
  id: Number(row.event_id),
  title: row.event_name,
  category: row.category,
  department_id: departmentLookup[row.department],
  date: row.date,
  venue: row.venue,
  organizer: row.organizer,
  description: '',
  created_at: '2025-01-01T10:00:00.000Z',
  updated_at: '2025-01-01T10:00:00.000Z',
}));

const participants = participantsRaw.map((row) => ({
  id: Number(row.participant_id),
  event_id: events[(Number(row.participant_id) - 1) % events.length].id,
  student_name: String(row['Student Name'] || '').trim(),
  roll_no: String(row.roll_no || '').trim(),
  department: String(row.department || '').trim(),
  year: toYearLabel(row.year),
  participant_type: String(row.type || 'internal').trim().toLowerCase() === 'external' ? 'external' : 'internal',
  created_at: '2025-01-01T12:00:00.000Z',
}));

const participation = participationRaw.map((row, index) => ({
  id: Number(row.id || index + 1),
  event_id: Number(row.event_id),
  participant_id: Number(row.participant_id),
  participation_date: String(row.participation_date || events[index % events.length].date),
  status: String(row.status || 'registered').toLowerCase(),
  created_at: '2025-01-01T12:30:00.000Z',
}));

const results = resultsRaw.map((row) => ({
  id: Number(row.result_id),
  event_id: Number(row.event_id),
  participant_id: Number(row.participant_id),
  rank: Number(row.rank),
  prize: row.prize,
  created_at: '2025-01-01T13:00:00.000Z',
}));

const output = `const bcrypt = require('bcryptjs');\n\nconst adminPasswordHash = bcrypt.hashSync('password123', 12);\nconst demoPasswordHash = bcrypt.hashSync('password123', 12);\n\nconst departments = ${JSON.stringify(departments, null, 2)};\n\nconst users = [\n  {\n    id: 1,\n    name: 'System Admin',\n    email: 'admin@college.edu',\n    password: adminPasswordHash,\n    role: 'admin',\n  },\n  {\n    id: 2,\n    name: 'Event Coordinator',\n    email: 'coordinator@college.edu',\n    password: demoPasswordHash,\n    role: 'user',\n  },\n];\n\nconst events = ${JSON.stringify(events, null, 2)};\n\nconst participants = ${JSON.stringify(participants, null, 2)};\n\nconst participation = ${JSON.stringify(participation, null, 2)};\n\nconst results = ${JSON.stringify(results, null, 2)};\n\nmodule.exports = {\n  departments,\n  users,\n  events,\n  participants,\n  participation,\n  results,\n};\n`;

fs.writeFileSync(path.join(root, 'backend', 'src', 'data', 'demoData.js'), output, 'utf8');
console.log('Generated backend/src/data/demoData.js');
console.log('Counts:', { events: events.length, participants: participants.length, participation: participation.length, results: results.length, departments: departments.length });
