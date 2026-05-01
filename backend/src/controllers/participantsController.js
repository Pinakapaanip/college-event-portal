const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');
const pool = require('../config/db');

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
