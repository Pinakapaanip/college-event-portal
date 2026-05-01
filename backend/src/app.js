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

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
