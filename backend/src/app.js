const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { notFound, errorHandler } = require('./middleware/error');
const pool = require('./config/db');
const db = require('./services/dbService');

const authRoutes = require('./routes/authRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const departmentsRoutes = require('./routes/departmentsRoutes');
const participantsRoutes = require('./routes/participantsRoutes');
const resultsRoutes = require('./routes/resultsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && allowedOrigins.length === 0)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'College Event Statistics Portal API', mode: 'database' });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Database connected successfully',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error('DB ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

app.post('/api/login', (req, res) => {
  console.log('LOGIN REQUEST:', req.body);
  return res.json({ success: true, token: 'demo-token' });
});

app.get('/api/analytics/events-by-dept', async (req, res, next) => {
  try {
    const data = await db.getEventsByDepartment();
    res.json(data);
  } catch (error) {
    next(error);
  }
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
