const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const addResult = asyncHandler(async (req, res) => {
  const { event_id, participant_id, rank, prize } = req.body;
  if (!event_id || !participant_id || !rank || !prize) {
    return res.status(400).json({ message: 'All result fields are required.' });
  }

  res.status(201).json(store.addResult({ event_id, participant_id, rank, prize }));
});

const getResults = asyncHandler(async (req, res) => {
  res.json(store.getResults(req.query.eventId));
});

module.exports = { addResult, getResults };
