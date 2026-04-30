const asyncHandler = require('../utils/asyncHandler');
const store = require('../services/demoStore');

const addParticipant = asyncHandler(async (req, res) => {
  const { event_id, student_name, roll_no, department, year, participant_type } = req.body;

  if (!event_id || !student_name || !roll_no || !department || !year || !participant_type) {
    return res.status(400).json({ message: 'All participant fields are required.' });
  }

  const participant = store.addParticipant({
    event_id,
    student_name,
    roll_no,
    department,
    year,
    participant_type,
  });
  
  res.status(201).json(participant);
});

const getParticipantsByEvent = asyncHandler(async (req, res) => {
  const participants = store.getParticipantsByEvent(req.params.eventId);
  res.json(participants);
});

module.exports = { addParticipant, getParticipantsByEvent };
