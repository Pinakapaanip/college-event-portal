const router = require('express').Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { addParticipant, getParticipantsByEvent } = require('../controllers/participantsController');

router.post('/', authenticateToken, requireRole('admin'), addParticipant);
router.get('/event/:eventId', authenticateToken, getParticipantsByEvent);

module.exports = router;
