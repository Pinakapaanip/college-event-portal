const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');
const pool = require('../config/db');

async function ensureDepartment(name) {
  const departmentName = String(name || 'General').trim() || 'General';
  const result = await pool.query(
    `INSERT INTO departments (department_name)
     VALUES ($1)
     ON CONFLICT (department_name) DO UPDATE SET department_name = EXCLUDED.department_name
     RETURNING id`,
    [departmentName]
  );
  return result.rows[0].id;
}

async function ensureEventExists(eventId, departmentName) {
  const existing = await pool.query('SELECT id FROM events WHERE id = $1', [eventId]);
  if (existing.rows[0]) return;

  const departmentId = await ensureDepartment(departmentName);
  await pool.query(
    `INSERT INTO events (id, title, category, department_id, date, venue, organizer, description)
     VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7)
     ON CONFLICT (id) DO NOTHING`,
    [
      eventId,
      `Event ${eventId}`,
      'General',
      departmentId,
      'TBA',
      'System',
      'Auto-created so participant data can be saved.',
    ]
  );
  await pool.query(
    `SELECT setval(pg_get_serial_sequence('events', 'id'), COALESCE((SELECT MAX(id) FROM events), 1))`
  );
}

const listParticipants = asyncHandler(async (req, res) => {
  const eventId = req.query.eventId;

  if (eventId) {
    const rows = await db.getParticipantsByEvent(Number(eventId));
    return res.json(rows);
  }

  const events = await db.listEvents({ limit: 200, sort: 'date', order: 'desc' });
  const collected = [];

  for (const event of events.data.slice(0, 20)) {
    const rows = await db.getParticipantsByEvent(event.id);
    rows.forEach((row) => collected.push(row));
    if (collected.length >= 200) break;
  }

  res.json(collected.slice(0, 200));
});

const addParticipant = asyncHandler(async (req, res) => {
  console.log('BODY:', req.body);
  const { eventId, event_id, student_name, roll_no, department, year, participant_type } = req.body;
  const mappedEventId = eventId || event_id;
  const normalizedType = String(participant_type || '').toLowerCase();

  if (!mappedEventId || !student_name || !roll_no || !department || !year || !normalizedType) {
    return res.status(400).json({ message: 'All participant fields are required.' });
  }

  const query = `INSERT INTO participants
    (event_id, student_name, roll_no, department, year, participant_type)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const values = [
    Number(mappedEventId),
    String(student_name).trim(),
    String(roll_no).trim(),
    String(department).trim(),
    String(year).trim(),
    normalizedType,
  ];

  try {
    await ensureEventExists(Number(mappedEventId), department);
    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('PARTICIPANT INSERT ERROR:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const getParticipantsByEvent = asyncHandler(async (req, res) => {
  const participants = await db.getParticipantsByEvent(Number(req.params.eventId));
  res.json(participants);
});

module.exports = { listParticipants, addParticipant, getParticipantsByEvent };
