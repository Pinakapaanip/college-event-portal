const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');

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
  const { event_id, student_name, roll_no, department, year, participant_type } = req.body;

  if (!event_id || !student_name || !roll_no || !department || !year || !participant_type) {
    return res.status(400).json({ message: 'All participant fields are required.' });
  }

  const participant = await db.addParticipant({
    event_id: Number(event_id),
    student_name,
    roll_no,
    department,
    year,
    participant_type,
  });

  res.status(201).json({ success: true, participant });
});

const getParticipantsByEvent = asyncHandler(async (req, res) => {
  const participants = await db.getParticipantsByEvent(Number(req.params.eventId));
  res.json(participants);
});

module.exports = { listParticipants, addParticipant, getParticipantsByEvent };
