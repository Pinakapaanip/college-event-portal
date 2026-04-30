const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const addResult = asyncHandler(async (req, res) => {
  const { event_id, participant_id, rank, prize } = req.body;
  if (!event_id || !participant_id || !rank || !prize) {
    return res.status(400).json({ message: 'All result fields are required.' });
  }

  const result = store.addResult({ event_id, participant_id, rank, prize });
  res.status(201).json(result);
});

const getResults = asyncHandler(async (req, res) => {
  const results = store.getResults(req.query.eventId);
  res.json(results);
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = store.getWinnersLeaderboard();
  res.json(leaderboard);
});

module.exports = { addResult, getResults, getLeaderboard };
