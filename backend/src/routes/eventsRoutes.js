const router = require('express').Router();
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
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
