const asyncHandler = require('../utils/asyncHandler');
const db = require('../services/dbService');

const addResult = asyncHandler(async (req, res) => {
  const { event_id, participant_id, rank, prize } = req.body;
  if (!event_id || !participant_id || !rank || !prize) {
    return res.status(400).json({ message: 'All result fields are required.' });
  }

  const result = await db.addResult({
    event_id: Number(event_id),
    participant_id: Number(participant_id),
    rank: Number(rank),
    prize,
  });

  const participant = await db.getParticipantById(Number(participant_id));
  res.status(201).json({
    id: result.id,
    event_id: result.event_id,
    participant_id: result.participant_id,
    student_name: participant?.student_name,
    roll_no: participant?.roll_no,
    rank: result.rank,
    prize: result.prize,
  });
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
