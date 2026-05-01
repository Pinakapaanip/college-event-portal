const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');
const pool = require('../config/db');

const addResult = asyncHandler(async (req, res) => {
  console.log('BODY:', req.body);
  const { eventId, participantId, event_id, participant_id, rank, prize } = req.body;
  const mappedEventId = eventId || event_id;
  const mappedParticipantId = participantId || participant_id;

  if (!mappedEventId || !mappedParticipantId || !rank || !prize) {
    return res.status(400).json({ message: 'All result fields are required.' });
  }

  const query = `INSERT INTO results
    (event_id, participant_id, rank, prize)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
  const values = [
    Number(mappedEventId),
    Number(mappedParticipantId),
    Number(rank),
    String(prize).trim(),
  ];

  try {
    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('RESULT INSERT ERROR:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const getResults = asyncHandler(async (req, res) => {
  const results = await db.getResults(req.query.eventId ? Number(req.query.eventId) : undefined);
  res.json(results);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await db.getLeaderboard();
  res.json(leaderboard);
});

module.exports = { addResult, getResults, getLeaderboard };
