const bcrypt = require('bcryptjs');
const demoData = require('../data/demoData');

const state = {
  users: [...demoData.users],
  departments: [...demoData.departments],
  events: [...demoData.events],
  participants: [...demoData.participants],
  results: [...demoData.results],
};

function nextId(list) {
  return list.length ? Math.max(...list.map((item) => item.id)) + 1 : 1;
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function cloneRow(row) {
  return JSON.parse(JSON.stringify(row));
}

function getDepartmentName(departmentId) {
  const department = state.departments.find((item) => item.id === Number(departmentId));
  return department ? department.department_name : '';
}

function shapeEvent(event) {
  return {
    ...cloneRow(event),
    department_name: getDepartmentName(event.department_id),
  };
}

function listEvents(filters = {}) {
  const {
    q = '',
    departmentId = '',
    category = '',
    from = '',
    to = '',
    page = 1,
    limit = 10,
    sort = 'date',
    order = 'asc',
  } = filters;

  let rows = [...state.events];

  if (q) {
    const term = q.toLowerCase();
    rows = rows.filter((row) => [row.title, row.venue, row.organizer].some((value) => String(value).toLowerCase().includes(term)));
  }
  if (departmentId) {
    rows = rows.filter((row) => row.department_id === Number(departmentId));
  }
  if (category) {
    rows = rows.filter((row) => row.category.toLowerCase() === String(category).toLowerCase());
  }
  if (from) {
    rows = rows.filter((row) => row.date >= from);
  }
  if (to) {
    rows = rows.filter((row) => row.date <= to);
  }

  rows.sort((left, right) => {
    const leftValue = left[sort];
    const rightValue = right[sort];
    if (leftValue < rightValue) return order === 'desc' ? 1 : -1;
    if (leftValue > rightValue) return order === 'desc' ? -1 : 1;
    return 0;
  });

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const offset = (pageNumber - 1) * pageSize;
  const pagedRows = rows.slice(offset, offset + pageSize).map(shapeEvent);

  return {
    data: pagedRows,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total: rows.length,
      totalPages: Math.max(Math.ceil(rows.length / pageSize), 1),
    },
  };
}

function getEventById(id) {
  const event = state.events.find((item) => item.id === Number(id));
  return event ? shapeEvent(event) : null;
}

function createEvent(payload) {
  const event = {
    id: nextId(state.events),
    title: normalizeText(payload.title),
    category: normalizeText(payload.category),
    department_id: Number(payload.department_id),
    date: payload.date,
    venue: normalizeText(payload.venue),
    organizer: normalizeText(payload.organizer),
    description: normalizeText(payload.description),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  state.events.push(event);
  return shapeEvent(event);
}

function updateEvent(id, payload) {
  const index = state.events.findIndex((item) => item.id === Number(id));
  if (index === -1) return null;

  state.events[index] = {
    ...state.events[index],
    title: normalizeText(payload.title),
    category: normalizeText(payload.category),
    department_id: Number(payload.department_id),
    date: payload.date,
    venue: normalizeText(payload.venue),
    organizer: normalizeText(payload.organizer),
    description: normalizeText(payload.description),
    updated_at: new Date().toISOString(),
  };

  return shapeEvent(state.events[index]);
}

function deleteEvent(id) {
  const eventId = Number(id);
  const before = state.events.length;
  state.events = state.events.filter((event) => event.id !== eventId);
  state.participants = state.participants.filter((participant) => participant.event_id !== eventId);
  state.results = state.results.filter((result) => result.event_id !== eventId);
  return before !== state.events.length;
}

function exportEventsCsv() {
  const headers = ['id', 'title', 'category', 'department_name', 'date', 'venue', 'organizer', 'description'];
  const rows = [headers.join(',')];
  for (const event of state.events) {
    const shaped = shapeEvent(event);
    rows.push(headers.map((key) => JSON.stringify(shaped[key] ?? '')).join(','));
  }
  return rows.join('\n');
}

function getDepartments() {
  return [...state.departments];
}

function addParticipant(payload) {
  const participant = {
    id: nextId(state.participants),
    event_id: Number(payload.event_id),
    student_name: normalizeText(payload.student_name),
    roll_no: normalizeText(payload.roll_no),
    department: normalizeText(payload.department),
    year: normalizeText(payload.year),
    participant_type: payload.participant_type === 'external' ? 'external' : 'internal',
    created_at: new Date().toISOString(),
  };

  state.participants.push(participant);
  return cloneRow(participant);
}

function getParticipantsByEvent(eventId) {
  return state.participants
    .filter((participant) => participant.event_id === Number(eventId))
    .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
    .map((participant) => ({ ...cloneRow(participant), event_title: getEventById(participant.event_id)?.title || '' }));
}

function addResult(payload) {
  const result = {
    id: nextId(state.results),
    event_id: Number(payload.event_id),
    participant_id: Number(payload.participant_id),
    rank: Number(payload.rank),
    prize: normalizeText(payload.prize),
    created_at: new Date().toISOString(),
  };

  state.results.push(result);
  return cloneRow(result);
}

function getResults(eventId) {
  const rows = eventId ? state.results.filter((result) => result.event_id === Number(eventId)) : [...state.results];
  return rows
    .sort((left, right) => left.rank - right.rank)
    .map((result) => {
      const event = getEventById(result.event_id);
      const participant = state.participants.find((item) => item.id === result.participant_id);
      return {
        ...cloneRow(result),
        event_title: event?.title || '',
        student_name: participant?.student_name || '',
        roll_no: participant?.roll_no || '',
      };
    });
}

function getSummary() {
  return {
    totalEvents: state.events.length,
    totalParticipants: state.participants.length,
    totalDepartments: state.departments.length,
    upcomingEvents: state.events.filter((event) => event.date >= '2026-04-24').length,
  };
}

function getEventsByDepartment() {
  return state.departments.map((department) => ({
    department_name: department.department_name,
    total: state.events.filter((event) => event.department_id === department.id).length,
  }));
}

function getMonthlyTrend() {
  const counts = new Map();
  for (const event of state.events) {
    const month = event.date.slice(0, 7);
    counts.set(month, (counts.get(month) || 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([month, total]) => ({ month, total }));
}

function getCategoryBreakdown() {
  const counts = new Map();
  for (const event of state.events) {
    counts.set(event.category, (counts.get(event.category) || 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1]).map(([category, total]) => ({ category, total }));
}

function getParticipantMix() {
  const counts = { internal: 0, external: 0 };
  for (const participant of state.participants) {
    counts[participant.participant_type] = (counts[participant.participant_type] || 0) + 1;
  }
  return Object.entries(counts).map(([participant_type, total]) => ({ participant_type, total }));
}

function getTopDepartments() {
  return [...new Set(state.participants.map((participant) => participant.department))]
    .map((department) => ({
      department,
      total: state.participants.filter((participant) => participant.department === department).length,
    }))
    .sort((left, right) => right.total - left.total)
    .slice(0, 5);
}

function getWinnersLeaderboard() {
  return state.results
    .map((result) => {
      const participant = state.participants.find((item) => item.id === result.participant_id);
      const event = getEventById(result.event_id);
      return {
        student_name: participant?.student_name || '',
        roll_no: participant?.roll_no || '',
        event_title: event?.title || '',
        rank: result.rank,
        prize: result.prize,
      };
    })
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 10);
}

function registerUser(payload) {
  const email = normalizeText(payload.email).toLowerCase();
  const existing = state.users.find((user) => user.email === email);
  if (existing) {
    const error = new Error('Email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = {
    id: nextId(state.users),
    name: normalizeText(payload.name),
    email,
    password: bcrypt.hashSync(normalizeText(payload.password), 12),
    role: payload.role === 'admin' ? 'admin' : 'user',
  };

  state.users.push(user);
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function loginUser(payload) {
  const email = normalizeText(payload.email).toLowerCase();
  const user = state.users.find((item) => item.email === email);
  if (!user) return null;

  const valid = await bcrypt.compare(normalizeText(payload.password), user.password);
  if (!valid) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = {
  registerUser,
  loginUser,
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  exportEventsCsv,
  getDepartments,
  addParticipant,
  getParticipantsByEvent,
  addResult,
  getResults,
  getSummary,
  getEventsByDepartment,
  getMonthlyTrend,
  getCategoryBreakdown,
  getParticipantMix,
  getTopDepartments,
  getWinnersLeaderboard,
};
