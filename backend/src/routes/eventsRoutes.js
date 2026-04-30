const router = require('express').Router();
const { requireRole } = require('../middleware/auth');
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  exportEventsCsv,
} = require('../controllers/eventsController');

router.get('/', listEvents);
router.get('/export/csv', exportEventsCsv);
router.get('/:id', getEvent);
router.post('/', requireRole('admin'), createEvent);
router.put('/:id', requireRole('admin'), updateEvent);
router.delete('/:id', requireRole('admin'), deleteEvent);

module.exports = router;
