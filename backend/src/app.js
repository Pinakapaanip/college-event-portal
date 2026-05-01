const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const departmentsRoutes = require('./routes/departmentsRoutes');
const participantsRoutes = require('./routes/participantsRoutes');
const resultsRoutes = require('./routes/resultsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const demoData = require('./data/generateDemoData');

const app = express();

const events = demoData.events;
const participants = demoData.participants;
const participation = demoData.participation;
const results = demoData.results;

const departmentNames = ['CSE', 'AI', 'ECE', 'MECH'];
const departments = departmentNames.map((department_name, index) => ({ id: index + 1, department_name }));

let nextEventId = Math.max(...events.map((item) => item.id), 0) + 1;
let nextParticipantId = Math.max(...participants.map((item) => item.id), 0) + 1;
let nextParticipationId = Math.max(...participation.map((item) => item.id), 0) + 1;
let nextResultId = Math.max(...results.map((item) => item.id), 0) + 1;

function resolveDepartmentName(departmentIdOrName) {
  if (!departmentIdOrName) return 'CSE';
  const asNumber = Number(departmentIdOrName);
  if (!Number.isNaN(asNumber)) {
    return departments.find((item) => item.id === asNumber)?.department_name || 'CSE';
  }
  return String(departmentIdOrName).toUpperCase();
}

function formatResultRow(resultItem) {
  const event = events.find((item) => item.id === resultItem.eventId) || null;
  const participant = participants.find((item) => item.id === resultItem.participantId) || null;
  return {
    id: resultItem.id,
    event_id: resultItem.eventId,
    participant_id: resultItem.participantId,
    event_title: event?.title || resultItem.eventTitle || 'Event',
    student_name: participant?.name || resultItem.winnerName || 'Participant',
    roll_no: participant?.rollNo || '-',
    rank: resultItem.rank,
    prize: resultItem.prize || `${resultItem.points || 0} pts`,
    points: resultItem.points || 0,
  };
}

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'College Event Statistics Portal API', mode: 'demo' });
});

app.post('/api/login', (req, res) => {
  console.log('LOGIN REQUEST:', req.body);
  return res.json({ success: true, token: 'demo-token' });
});

app.get('/api/departments', (req, res) => {
  res.json(departments);
});

app.get('/api/events', (req, res) => {
  res.json({ data: events });
});

app.post('/api/events', (req, res) => {
  const { title, category, department_id, date, venue, organizer, description } = req.body || {};

  if (!title || !category || !date || !venue || !organizer) {
    return res.status(400).json({ message: 'Title, category, date, venue, and organizer are required.' });
  }

  const department = resolveDepartmentName(department_id);
  const created = {
    id: nextEventId++,
    title: String(title),
    category: String(category),
    department,
    department_name: department,
    date: String(date),
    venue: String(venue),
    organizer: String(organizer),
    description: String(description || ''),
    image: 'https://picsum.photos/800/400?random=' + Math.floor(Math.random() * 1000),
  };

  events.unshift(created);
  return res.status(201).json(created);
});

app.get('/api/participants', (req, res) => {
  res.json({ data: participants });
});

app.post('/api/participants', (req, res) => {
  const { event_id, student_name, roll_no, department, year, participant_type } = req.body || {};

  if (!event_id || !student_name) {
    return res.status(400).json({ message: 'Event and student name are required.' });
  }

  const normalizedDepartment = resolveDepartmentName(department);
  const normalizedType = String(participant_type || 'internal').toLowerCase() === 'external' ? 'External' : 'Internal';
  const createdParticipant = {
    id: nextParticipantId++,
    name: String(student_name),
    email: `${String(student_name).toLowerCase().replace(/\s+/g, '.')}@college.edu`,
    department: normalizedDepartment,
    type: normalizedType,
    year: year || null,
    rollNo: roll_no || `DEMO-${Math.floor(Math.random() * 9000) + 1000}`,
  };

  participants.push(createdParticipant);

  const selectedEvent = events.find((item) => item.id === Number(event_id));
  participation.push({
    id: nextParticipationId++,
    participantId: createdParticipant.id,
    eventId: Number(event_id),
    eventTitle: selectedEvent?.title || 'Event',
  });

  return res.status(201).json(createdParticipant);
});

app.get('/api/participants/event/:eventId', (req, res) => {
  const eventId = Number(req.params.eventId);
  const linked = participation.filter((item) => item.eventId === eventId);

  const rows = linked
    .map((link) => {
      const participant = participants.find((item) => item.id === link.participantId);
      if (!participant) return null;
      return {
        id: participant.id,
        student_name: participant.name,
        roll_no: participant.rollNo || '-',
        department: participant.department || 'N/A',
        year: participant.year || '-',
        participant_type: participant.type || 'Internal',
        event_id: eventId,
      };
    })
    .filter(Boolean);

  res.json(rows);
});

app.get('/api/participation', (req, res) => {
  res.json({ data: participation });
});

app.get('/api/results', (req, res) => {
  const eventId = req.query.eventId ? Number(req.query.eventId) : null;
  const filtered = eventId ? results.filter((item) => item.eventId === eventId) : results;
  res.json(filtered.map(formatResultRow));
});

app.post('/api/results', (req, res) => {
  const { event_id, participant_id, rank, prize } = req.body || {};

  if (!event_id || !participant_id || !rank) {
    return res.status(400).json({ message: 'Event, participant, and rank are required.' });
  }

  const event = events.find((item) => item.id === Number(event_id));
  const participant = participants.find((item) => item.id === Number(participant_id));

  if (!event || !participant) {
    return res.status(404).json({ message: 'Event or participant not found.' });
  }

  const created = {
    id: nextResultId++,
    eventId: Number(event_id),
    participantId: Number(participant_id),
    eventTitle: event.title,
    winnerName: participant.name,
    department: participant.department,
    rank: Number(rank),
    prize: String(prize || ''),
    points: Number(rank) === 1 ? 100 : Number(rank) === 2 ? 75 : 50,
  };

  results.push(created);
  return res.status(201).json(formatResultRow(created));
});

app.get('/api/analytics', (req, res) => {
  const totalEvents = events.length;
  const totalParticipants = participants.length;

  const eventsByDept = {};
  events.forEach((event) => {
    eventsByDept[event.department] = (eventsByDept[event.department] || 0) + 1;
  });

  const categoryDist = {};
  events.forEach((event) => {
    categoryDist[event.category] = (categoryDist[event.category] || 0) + 1;
  });

  const monthlyTrend = {};
  events.forEach((event) => {
    const month = new Date(event.date).getMonth();
    monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
  });

  const internal = participants.filter((item) => item.type === 'Internal').length;
  const external = participants.filter((item) => item.type === 'External').length;

  res.json({ totalEvents, totalParticipants, eventsByDept, categoryDist, monthlyTrend, internal, external });
});

app.get('/api/dashboard/summary', (req, res) => {
  const totalEvents = events.length;
  const totalParticipants = participants.length;
  const totalDepartments = new Set(events.map((event) => event.department)).size;
  const upcomingEvents = events.filter((event) => new Date(event.date) > new Date()).length;
  res.json({ totalEvents, totalParticipants, totalDepartments, upcomingEvents });
});

app.get('/api/dashboard/events-by-department', (req, res) => {
  const counts = {};
  events.forEach((event) => {
    counts[event.department] = (counts[event.department] || 0) + 1;
  });
  res.json(Object.entries(counts).map(([department_name, total]) => ({ department_name, total })));
});

app.get('/api/dashboard/monthly-trend', (req, res) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const counts = {};
  events.forEach((event) => {
    const month = monthNames[new Date(event.date).getMonth()];
    counts[month] = (counts[month] || 0) + 1;
  });
  res.json(monthNames.filter((month) => counts[month]).map((month) => ({ month, total: counts[month] })));
});

app.get('/api/dashboard/category-breakdown', (req, res) => {
  const counts = {};
  events.forEach((event) => {
    counts[event.category] = (counts[event.category] || 0) + 1;
  });
  res.json(Object.entries(counts).map(([category, total]) => ({ category, total })));
});

app.get('/api/dashboard/participant-mix', (req, res) => {
  const internal = participants.filter((participant) => participant.type === 'Internal').length;
  const external = participants.filter((participant) => participant.type === 'External').length;
  res.json([
    { participant_type: 'Internal', total: internal },
    { participant_type: 'External', total: external },
  ]);
});

app.get('/api/dashboard/top-departments', (req, res) => {
  const stats = {};
  events.forEach((event) => {
    if (!stats[event.department]) {
      stats[event.department] = { event_count: 0, participant_count: 0 };
    }
    stats[event.department].event_count += 1;
  });

  participants.forEach((participant) => {
    if (!stats[participant.department]) {
      stats[participant.department] = { event_count: 0, participant_count: 0 };
    }
    stats[participant.department].participant_count += 1;
  });

  res.json(
    Object.entries(stats)
      .map(([department_name, data]) => ({ department_name, ...data }))
      .sort((left, right) => right.event_count - left.event_count)
      .slice(0, 6)
  );
});

app.get('/api/dashboard/winners-leaderboard', (req, res) => {
  const winners = {};
  results.forEach((resultItem) => {
    if (!winners[resultItem.winnerName]) {
      winners[resultItem.winnerName] = { name: resultItem.winnerName, department: resultItem.department, wins: 0 };
    }
    if (Number(resultItem.rank) === 1) {
      winners[resultItem.winnerName].wins += 1;
    }
  });

  res.json(
    Object.values(winners)
      .sort((left, right) => right.wins - left.wins)
      .slice(0, 10)
      .map((item, index) => ({ rank: index + 1, ...item }))
  );
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
