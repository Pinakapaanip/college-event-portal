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
const { events, participants, participation, results, analytics } = require('./data/generateDemoData');

const app = express();

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

// Real demo data routes
app.get('/api/events', (req, res) => {
  res.json({ data: events });
});

app.get('/api/participants', (req, res) => {
  res.json({ data: participants });
});

app.get('/api/participation', (req, res) => {
  res.json({ data: participation });
});

app.get('/api/results', (req, res) => {
  res.json({ data: results });
});

app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

// Dashboard routes with real calculated data
app.get('/api/dashboard/summary', (req, res) => {
  const totalEvents = events.length;
  const totalParticipants = participants.length;
  const totalDepartments = new Set(events.map((e) => e.department)).size;
  const upcomingEvents = events.filter((e) => new Date(e.date) > new Date()).length;

  res.json({
    totalEvents,
    totalParticipants,
    totalDepartments,
    upcomingEvents,
  });
});

app.get('/api/dashboard/events-by-department', (req, res) => {
  const eventsByDept = {};
  events.forEach((e) => {
    eventsByDept[e.department] = (eventsByDept[e.department] || 0) + 1;
  });

  const result = Object.entries(eventsByDept).map(([dept, count]) => ({
    department_name: dept,
    total: count,
  }));

  res.json(result);
});

app.get('/api/dashboard/monthly-trend', (req, res) => {
  const monthlyData = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  events.forEach((e) => {
    const date = new Date(e.date);
    const monthName = monthNames[date.getMonth()];
    monthlyData[monthName] = (monthlyData[monthName] || 0) + 1;
  });

  const result = monthNames
    .filter((m) => monthlyData[m])
    .map((month) => ({
      month,
      total: monthlyData[month],
    }));

  res.json(result);
});

app.get('/api/dashboard/category-breakdown', (req, res) => {
  const categoryData = {};
  events.forEach((e) => {
    categoryData[e.category] = (categoryData[e.category] || 0) + 1;
  });

  const result = Object.entries(categoryData).map(([cat, count]) => ({
    category: cat,
    total: count,
  }));

  res.json(result);
});

app.get('/api/dashboard/participant-mix', (req, res) => {
  const internal = participants.filter((p) => p.type === 'Internal').length;
  const external = participants.filter((p) => p.type === 'External').length;

  res.json([
    { participant_type: 'Internal', total: internal },
    { participant_type: 'External', total: external },
  ]);
});

app.get('/api/dashboard/top-departments', (req, res) => {
  const deptStats = {};
  events.forEach((e) => {
    if (!deptStats[e.department]) {
      deptStats[e.department] = { event_count: 0, participant_count: 0 };
    }
    deptStats[e.department].event_count++;
  });

  participants.forEach((p) => {
    if (!deptStats[p.department]) {
      deptStats[p.department] = { event_count: 0, participant_count: 0 };
    }
    deptStats[p.department].participant_count++;
  });

  const result = Object.entries(deptStats)
    .map(([dept, stats]) => ({
      department_name: dept,
      ...stats,
    }))
    .sort((a, b) => b.event_count - a.event_count)
    .slice(0, 5);

  res.json(result);
});

app.get('/api/dashboard/winners-leaderboard', (req, res) => {
  const winnerMap = {};
  results.forEach((r) => {
    if (!winnerMap[r.winnerName]) {
      winnerMap[r.winnerName] = { name: r.winnerName, department: r.department, wins: 0 };
    }
    if (r.rank === 1) {
      winnerMap[r.winnerName].wins++;
    }
  });

  const result = Object.values(winnerMap)
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10)
    .map((winner, idx) => ({
      rank: idx + 1,
      ...winner,
    }));

  res.json(result);
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
