const router = require('express').Router();
const { listParticipants, addParticipant, getParticipantsByEvent } = require('../controllers/participantsController');

router.get('/', listParticipants);
router.post('/', addParticipant);
router.get('/event/:eventId', getParticipantsByEvent);

module.exports = router;
