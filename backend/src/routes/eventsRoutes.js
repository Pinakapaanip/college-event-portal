const router = require('express').Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  exportEventsCsv,
} = require('../controllers/eventsController');

router.get('/', authenticateToken, listEvents);
router.get('/export/csv', authenticateToken, exportEventsCsv);
router.get('/:id', authenticateToken, getEvent);
router.post('/', authenticateToken, requireRole('admin'), createEvent);
router.put('/:id', authenticateToken, requireRole('admin'), updateEvent);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteEvent);

module.exports = router;
