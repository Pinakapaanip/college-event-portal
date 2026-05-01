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

// Fallback demo routes - return sample data
app.get('/api/events', (req, res) => {
  res.json([
    { id: 1, name: 'OJAS 2K26', category: 'Sports', image: 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=800' },
    { id: 2, name: 'Tech Fest', category: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { id: 3, name: 'Cultural Show', category: 'Arts', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800' },
  ]);
});

app.get('/api/participants', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', event: 'OJAS 2K26', department: 'CSE' },
    { id: 2, name: 'Alice Smith', event: 'Tech Fest', department: 'ECE' },
    { id: 3, name: 'Bob Johnson', event: 'Cultural Show', department: 'ME' },
  ]);
});

app.get('/api/results', (req, res) => {
  res.json([
    { event: 'OJAS 2K26', winner: 'John Doe', department: 'CSE' },
    { event: 'Tech Fest', winner: 'Alice Smith', department: 'ECE' },
    { event: 'Cultural Show', winner: 'Bob Johnson', department: 'ME' },
  ]);
});

app.get('/api/dashboard/summary', (req, res) => {
  res.json({
    totalEvents: 12,
    totalParticipants: 245,
    totalDepartments: 8,
    upcomingEvents: 3,
  });
});

app.get('/api/dashboard/events-by-department', (req, res) => {
  res.json([
    { department_name: 'CSE', total: 5 },
    { department_name: 'ECE', total: 4 },
    { department_name: 'ME', total: 3 },
  ]);
});

app.get('/api/dashboard/monthly-trend', (req, res) => {
  res.json([
    { month: 'Jan', total: 2 },
    { month: 'Feb', total: 3 },
    { month: 'Mar', total: 4 },
  ]);
});

app.get('/api/dashboard/category-breakdown', (req, res) => {
  res.json([
    { category: 'Sports', total: 5 },
    { category: 'Technology', total: 4 },
    { category: 'Arts', total: 3 },
  ]);
});

app.get('/api/dashboard/participant-mix', (req, res) => {
  res.json([
    { participant_type: 'Internal', total: 200 },
    { participant_type: 'External', total: 45 },
  ]);
});

app.get('/api/dashboard/top-departments', (req, res) => {
  res.json([
    { department_name: 'CSE', event_count: 5, participant_count: 100 },
    { department_name: 'ECE', event_count: 4, participant_count: 80 },
    { department_name: 'ME', event_count: 3, participant_count: 65 },
  ]);
});

app.get('/api/dashboard/winners-leaderboard', (req, res) => {
  res.json([
    { rank: 1, name: 'John Doe', wins: 3, department: 'CSE' },
    { rank: 2, name: 'Alice Smith', wins: 2, department: 'ECE' },
    { rank: 3, name: 'Bob Johnson', wins: 1, department: 'ME' },
  ]);
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
