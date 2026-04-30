const router = require('express').Router();
const { addParticipant, getParticipantsByEvent } = require('../controllers/participantsController');

router.post('/', addParticipant);
router.get('/event/:eventId', getParticipantsByEvent);

module.exports = router;
