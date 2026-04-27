const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const addParticipant = asyncHandler(async (req, res) => {
  const { event_id, student_name, roll_no, department, year, participant_type } = req.body;

  if (!event_id || !student_name || !roll_no || !department || !year || !participant_type) {
    return res.status(400).json({ message: 'All participant fields are required.' });
  }

  res.status(201).json(store.addParticipant({ event_id, student_name, roll_no, department, year, participant_type }));
});

const getParticipantsByEvent = asyncHandler(async (req, res) => {
  res.json(store.getParticipantsByEvent(req.params.eventId));
});

module.exports = { addParticipant, getParticipantsByEvent };
